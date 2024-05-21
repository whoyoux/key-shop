"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function buy(itemId: string) {
	const session = await auth();

	if (!session?.user) {
		throw new Error("You must be logged in to buy an item");
	}

	const offerFound = await prisma.offer.findUnique({
		where: {
			id: itemId,
		},
		include: {
			keys: true,
		},
	});

	if (!offerFound) {
		throw new Error("Offer not found");
	}

	if (offerFound.keys.length === 0) {
		throw new Error("No keys available");
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
		throw new Error("Failed to create stripe session");
	}

	redirect(stripeSession.url);
}
