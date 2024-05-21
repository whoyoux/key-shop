import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { stripeWebhookMedatadataSchema } from "@/validators/stripe-validators";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get("Stripe-Signature") ?? "";

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET || "",
		);
		console.log(event.type);
	} catch (err) {
		return new Response(
			`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
			{ status: 400 },
		);
	}

	const session = event.data.object as Stripe.Checkout.Session;

	if (event.type === "checkout.session.completed") {
		const metadata = stripeWebhookMedatadataSchema.safeParse(session.metadata);
		if (!metadata.success) {
			return new Response(null, { status: 400 });
		}

		await prisma.$transaction(async (tx) => {
			const keys = await tx.key.findMany({
				where: {
					offerId: metadata.data.offerId,
					isUsed: false,
				},
			});

			if (keys.length === 0)
				// throw new Error("No keys available");
				return;

			const keyForUser = await tx.key.update({
				where: {
					id: keys[0].id,
				},
				data: {
					isUsed: true,
				},
			});

			if (!keyForUser) return;

			await tx.order.update({
				where: {
					id: metadata.data.orderId,
				},
				data: {
					isPaid: true,
					paidAt: new Date(),
					paidAmount: session.amount_total,
					key: {
						connect: {
							id: keyForUser.id,
						},
					},
				},
			});

			console.log("Order successfully updated.");
		});

		// we need to send the key to the user
	}

	return new Response(null, { status: 200 });
}
