import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { Suspense, useId } from "react";

import { buy } from "@/actions/offer";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

enum Sort {
	NEWEST = "newest",
	PRICE_ASC = "price-asc",
	PRICE_DESC = "price-desc",
}

type Props = {
	searchParams: {
		q: string | string[] | undefined;
		sort: string | string[] | undefined;
	};
};

export default async function Home({ searchParams }: Props) {
	const offers = await prisma.offer.findMany({
		where: {
			title: {
				contains: searchParams.q ? String(searchParams.q) : "",
			},
		},
		include: { screenshots: true },
		orderBy: {
			price: "desc",
		},
		take: 40,
	});

	return (
		<div className="w-full flex flex-col gap-4 max-w-screen-lg mx-auto">
			<SearchBar searchParams={searchParams} />
			<div className="flex flex-col gap-4 w-full">
				{offers.map((offer) => (
					<OfferCard key={offer.id} offer={offer} />
				))}
				{offers.length === 0 && (
					<div className="text-center pt-5">
						<h2 className="font-semibold">No offers found :(</h2>
					</div>
				)}
			</div>
		</div>
	);
}

type Offer = Prisma.OfferGetPayload<{
	include: {
		screenshots: true;
	};
}>;

const OfferCard = ({ offer }: { offer: Offer }) => {
	return (
		<form
			className="rounded-md bg-card border flex gap-2 items-center px-4 py-6"
			action={async () => {
				"use server";
				await buy(offer.id);
			}}
		>
			<Image
				src={offer.imageUrl}
				alt="offer image"
				width={120}
				height={60}
				quality={60}
				className="rounded-sm h-auto aspect-[2/1]"
			/>
			<div className="w-full flex justify-between items-center">
				<div>
					<Link href={`/offer/${offer.id}`}>
						<h3 className="font-semibold text-lg line-clamp-1 max-w-[500px]">
							{offer.title}
						</h3>
					</Link>
					<p>{formatPrice(offer.price)}</p>
				</div>
				<Button className="font-semibold" size="lg">
					Buy now
				</Button>
			</div>
		</form>
	);
};

// const OfferListSkeleton = () => {
// 	return (
// 		<div className="w-full flex flex-col gap-4">
// 			{Array.from({ length: 20 }).map(() => (
// 				<Skeleton key={useId()} className="h-106" />
// 			))}
// 		</div>
// 	);
// };
