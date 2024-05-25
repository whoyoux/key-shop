"use client";
import { buy } from "@/actions/offer";
import { cn, formatPrice } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import Spinner from "./spinner";
import { Button } from "./ui/button";

type OfferWithScreenshots = Prisma.OfferGetPayload<{
	include: {
		screenshots: true;
	};
}>;

const OfferCard = ({ offer }: { offer: OfferWithScreenshots }) => {
	const { execute, status, result } = useAction(buy);

	useEffect(() => {
		if (result.serverError) toast.error(result.serverError);
	}, [result]);

	const isLoading = status === "executing";
	return (
		<div className="rounded-md bg-card border flex gap-2 items-center px-4 py-6">
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
					<p className="flex gap-2 items-center">
						<span
							className={cn(offer.isDiscount && "line-through text-red-500")}
						>
							{formatPrice(offer.price)}
						</span>
						{offer.isDiscount && offer.discontPrice && (
							<span className="text-primary">
								{formatPrice(offer.discontPrice)}
							</span>
						)}
					</p>
				</div>
				<Button
					className="font-semibold flex items-center gap-2"
					size="lg"
					onClick={() => {
						execute({ itemId: offer.id });
					}}
					disabled={isLoading}
				>
					{isLoading && <Spinner />}
					{isLoading ? "Buying..." : "Buy now"}
				</Button>
			</div>
		</div>
	);
};

export default OfferCard;
