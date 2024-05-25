import { buy } from "@/actions/offer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
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
				{/* <div className="aspect-[2/1] w-full max-w-full relative">
					<Image
						src={offer.imageUrl}
						alt="Offer image"
						quality={100}
						fill
						className="rounded-md h-auto"
					/>
				</div>
				<div className="w-full flex gap-4">
					{offer.screenshots.map((screenshot) => (
						<div
							key={screenshot.id}
							className="relative min-w-[100px] aspect-[2/1]"
						>
							<Image
								src={screenshot.pathFull}
								alt="Screenshot"
								quality={60}
								fill
								className="rounded-md h-auto"
							/>
						</div>
					))}
				</div> */}
				<ImageHero imageUrl={offer.imageUrl} screenshots={offer.screenshots} />
				<h1 className="text-xl font-semibold">{offer.title}</h1>
				{/* <p className="text-sm text-muted-foreground">{offer.description}</p> */}
				<div
					className="prose-invert text-muted-foreground [&>img]:rounded-lg "
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
					<span className="font-semibold">{formatPrice(offer.price)}</span>
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
