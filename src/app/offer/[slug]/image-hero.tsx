"use client";

import { cn } from "@/lib/utils";
import type { Screenshot } from "@prisma/client";
import NextImage from "next/image";
import { useEffect, useState } from "react";

type Props = {
	imageUrl: string;
	screenshots: Screenshot[];
};

const ImageHero = ({ imageUrl, screenshots }: Props) => {
	const [mainImage, setMainImage] = useState(imageUrl);

	// useEffect(() => {
	// 	screenshots.map((screenshot) => {
	// 		const img = new Image();
	// 		img.src = screenshot.pathThumbnail;
	// 		console.log(img);
	// 	});
	// }, [screenshots]);

	return (
		<>
			<div className="aspect-[2/1] w-full max-w-full relative bg-card">
				<NextImage
					src={mainImage}
					alt="Offer image"
					quality={100}
					fill
					className="rounded-md h-auto"
				/>
			</div>
			<div className="w-full flex gap-4 overflow-x-scroll no-scrollbar">
				<div
					key={imageUrl}
					className={cn(
						"relative min-w-[100px] aspect-[2/1] hover:cursor-pointer rounded-md bg-card",
						imageUrl === mainImage && "border-2 border-primary",
					)}
					onMouseDown={() => setMainImage(imageUrl)}
				>
					<NextImage
						src={imageUrl}
						alt="Screenshot"
						quality={60}
						fill
						className="rounded-md h-auto"
					/>
				</div>
				{screenshots.map((screenshot) => (
					<div
						key={screenshot.id}
						className={cn(
							"relative min-w-[100px] aspect-[2/1] hover:cursor-pointer rounded-md bg-card",
							screenshot.pathThumbnail === mainImage &&
								"border-2 border-primary",
						)}
						onMouseDown={() => setMainImage(screenshot.pathThumbnail)}
					>
						<NextImage
							src={screenshot.pathFull}
							alt="Screenshot"
							quality={60}
							fill
							className="rounded-md h-auto"
						/>
					</div>
				))}
			</div>
		</>
	);
};

export default ImageHero;
