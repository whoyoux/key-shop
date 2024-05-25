import { buy } from "@/actions/offer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { cn, formatPrice } from "@/lib/utils";
import { AppWindow, Apple, ChevronLeft, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageHero from "./image-hero";

type Props = {
	params: {
		slug: string;
	};
};

const OfferPage = async ({ params }: Props) => {
	const offer = await prisma.offer.findUnique({
		where: {
			id: params.slug,
		},
		include: {
			screenshots: true,
		},
	});

	if (!offer) return notFound();

	const keysLeft = await prisma.key.count({
		where: {
			offerId: offer.id,
			isUsed: false,
		},
	});

	console.log(offer);

	return (
		<div className="max-w-screen-lg mx-auto">
			<div className="mb-6">
				<Link href="/">
					<Button variant="link">
						<ChevronLeft />
						Go back
					</Button>
				</Link>
			</div>
			<form
				className="flex flex-col gap-4"
				action={async () => {
					"use server";
					await buy({ itemId: offer.id });
				}}
			>
				<h1 className="text-xl md:text-2xl font-semibold">{offer.title}</h1>
				<ImageHero imageUrl={offer.imageUrl} screenshots={offer.screenshots} />

				<div
					className="prose prose-invert [&>img]:rounded-lg max-w-full"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: offer.description }}
				/>
				<p className="font-semibold">
					Keys left: <span className="text-primary">{keysLeft}</span>
				</p>
				<div className="flex items-center justify-between">
					<h2 className="font-semibold">Platforms</h2>
					<div className="flex items-center gap-4">
						{offer.windowsSupport && <Windows />}
						{offer.macSupport && <MacOS />}
						{offer.linuxSupport && <Linux />}
					</div>
				</div>
				<div className="flex items-center justify-between">
					<h2 className="font-semibold">Price</h2>
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"font-semibold",
								offer.isDiscount && "text-red-500 line-through",
							)}
						>
							{formatPrice(offer.price)}
						</span>
						<span className="font-semibold text-primary">
							{offer.isDiscount &&
								offer.discontPrice &&
								formatPrice(offer.discontPrice)}
						</span>
						{offer.isDiscount && (
							<span className="font-semibold text-primary">
								-{offer.discountPercent && offer.discountPercent}%
							</span>
						)}
					</div>
				</div>
				<Button className="font-semibold" type="submit">
					Buy now
				</Button>
			</form>
		</div>
	);
};

const Windows = () => {
	return (
		<div className="flex flex-col gap-1 items-center">
			<AppWindow className="w-6 h-6 text-muted-foreground" />
			<span className="text-xs text-muted-foreground">Windows</span>
		</div>
	);
};

const MacOS = () => {
	return (
		<div className="flex flex-col gap-1 items-center">
			<Apple className="w-6 h-6 text-muted-foreground" />
			<span className="text-xs text-muted-foreground">MacOS</span>
		</div>
	);
};

const Linux = () => {
	return (
		<div className="flex flex-col gap-1 items-center">
			<Terminal className="w-6 h-6 text-muted-foreground" />
			<span className="text-xs text-muted-foreground">Linux</span>
		</div>
	);
};

export default OfferPage;
