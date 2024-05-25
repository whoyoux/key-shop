"use client";

import type { Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import OfferCard from "./offer-card";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

enum Sort {
	TITLE = "title",
	PRICE_ASC = "price-asc",
	PRICE_DESC = "price-desc",
}

type OfferWithScreenshots = Prisma.OfferGetPayload<{
	include: {
		screenshots: true;
	};
}>;

const OffersList = ({
	offers: dbOffers,
}: { offers: OfferWithScreenshots[] }) => {
	const [sort, setSort] = useState<Sort>();
	const [offers, setOffers] = useState<OfferWithScreenshots[]>(dbOffers);

	useEffect(() => {
		switch (sort) {
			case Sort.PRICE_ASC:
				setOffers((prevOffers) =>
					[...prevOffers].sort((a, b) => a.price - b.price),
				);
				break;
			case Sort.PRICE_DESC:
				setOffers((prevOffers) =>
					[...prevOffers].sort((a, b) => b.price - a.price),
				);
				break;
			case Sort.TITLE:
				setOffers((prevOffers) =>
					[...prevOffers].sort((a, b) => a.title.localeCompare(b.title)),
				);
				break;
			default:
				break;
		}
	}, [sort]);

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex justify-end items-center">
				<Select onValueChange={(v) => setSort(v as Sort)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Sort by</SelectLabel>
							<SelectItem value={Sort.PRICE_ASC}>price asc</SelectItem>
							<SelectItem value={Sort.PRICE_DESC}>price desc</SelectItem>
							<SelectItem value={Sort.TITLE}>title</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			{offers.map((offer) => (
				<OfferCard key={offer.id} offer={offer} />
			))}
			{offers.length === 0 && (
				<div className="text-center pt-5">
					<h2 className="font-semibold">No offers found :(</h2>
				</div>
			)}
		</div>
	);
};

export default OffersList;
