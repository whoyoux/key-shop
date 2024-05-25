"use server";

import { prisma } from "@/lib/prisma";
import { MyError, authAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
	itemId: z.string(),
});

export const buy = authAction(schema, async ({ itemId }, { session }) => {
	const offerFound = await prisma.offer.findUnique({
		where: {
			id: itemId,
		},
		include: {
			keys: true,
		},
	});

	if (!offerFound) {
		throw new MyError("Offer not found");
	}

	if (offerFound.keys.length === 0) {
		throw new MyError("No keys available");
	}

	const order = await prisma.order.create({
		data: {
			user: {
				connect: {
					id: session.user.id,
				},
			},
			offer: {
				connect: {
					id: offerFound.id,
				},
			},
			key: undefined,
			isPaid: false,
		},
	});

	const stripeSession = await stripe.checkout.sessions.create({
		success_url: `${process.env.BASE_URL}/dashboard/order/${order.id}`,
		cancel_url: `${process.env.BASE_URL}/dashboard/order/${order.id}`,
		line_items: [
			{
				price_data: {
					currency: "usd",
					unit_amount: offerFound.price,
					product_data: {
						name: `${offerFound.title} - Game Key`,
						images: [offerFound.imageUrl],
						description: offerFound.shortDescription,
					},
				},
				quantity: 1,
			},
		],
		mode: "payment",
		payment_method_types: ["card"],
		metadata: {
			userId: session.user.id,
			orderId: order.id,
			offerId: offerFound.id,
		},
	});

	if (!stripeSession?.url) {
		throw new MyError("Failed to create stripe session");
	}

	redirect(stripeSession.url);
});
