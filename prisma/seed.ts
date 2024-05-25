import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffle(array: Array<unknown>) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
}

async function main() {
	console.log("Seedind DB...");
	const appsObj = await fetch(
		"https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json",
	);
	const {
		applist: { apps },
	} = (await appsObj.json()) as {
		applist: { apps: { appid: number; name: string }[] };
	};

	const appsToAdd = [];

	// shuffle(apps);

	for (const app of apps.slice(0, 200)) {
		const { appid, name } = app;

		const details = await fetch(
			`https://store.steampowered.com/api/appdetails?appids=${appid}`,
		);
		const {
			[appid]: { data },
		} = (await details.json()) as {
			[key: string]: {
				data: {
					name: string;
					is_free: boolean;
					type: string;
					header_image: string;
					detailed_description: string;
					about_the_game: string;
					short_description: string;
					developers: string;
					publishers: string;
					genre: { id: number; description: string }[];
					screenshots: {
						id: number;
						path_thumbnail: string;
						path_full: string;
					}[];
					platforms: { windows: boolean; mac: boolean; linux: boolean };
					release_date: { coming_soon: boolean; date: string };
					price_overview: { final: number; initial: number };
				};
			};
		};
		if (
			!data ||
			Boolean(data.release_date?.coming_soon) ||
			data.is_free ||
			!data.price_overview?.final ||
			!data.screenshots?.length ||
			!data.screenshots[0] ||
			data.type !== "game"
		)
			continue;

		console.log(`Added ${name} to list with id ${appid}.`);

		// await sleep(5000);

		// appsToAdd.push({
		// 	title: data.name,
		// 	description: data.detailed_description,
		// 	shortDescription: data.short_description,
		// 	price: data.price_overview.final ?? Number(Math.random() * 100 + 10),
		// 	imageUrl: data.header_image,
		// 	windowsSupport: data.platforms.windows,
		// 	macSupport: data.platforms.mac,
		// 	linuxSupport: data.platforms.linux,
		// 	screenshots: {
		// 		createMany: {
		// 			data:
		// 				data.screenshots.map((screenshot) => ({
		// 					pathFull: screenshot.path_full,
		// 					pathThumbnail: screenshot.path_thumbnail,
		// 				})) ?? [],
		// 		},
		// 	},
		// 	developers: data.developers[0],
		// 	publishers: data.publishers[0],
		// 	type: data.type,
		// });

		const isDiscount = Math.random() > 0.8;
		const discountPercent = Math.floor(Math.random() * 50 + 10);
		const discountPrice = Math.floor(
			data.price_overview.final -
				data.price_overview.final * (discountPercent / 100),
		);

		await prisma.offer.create({
			data: {
				title: data.name,
				description: data.detailed_description,
				shortDescription: data.short_description,
				price: data.price_overview.final ?? Number(Math.random() * 100 + 10),
				imageUrl: data.header_image,
				windowsSupport: data.platforms.windows,
				macSupport: data.platforms.mac,
				linuxSupport: data.platforms.linux,
				screenshots: {
					createMany: {
						data:
							data.screenshots.map((screenshot) => ({
								pathFull: screenshot.path_full,
								pathThumbnail: screenshot.path_thumbnail,
							})) ?? [],
					},
				},
				keys: {
					createMany: {
						data: Array.from({ length: 20 }).map(() => ({
							key: crypto.randomUUID(),
						})),
					},
				},
				isDiscount,
				discontPrice: isDiscount ? discountPrice : null,
				discountPercent: isDiscount ? discountPercent : null,
				developers: data.developers[0],
				publishers: data.publishers[0],
				type: data.type,
			},
		});
	}

	console.log("Done.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
