import OffersList from "@/components/offers-list";
import SearchBar from "@/components/search-bar";
import { prisma } from "@/lib/prisma";

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
			<OffersList offers={offers} />
		</div>
	);
}

// const OfferListSkeleton = () => {
// 	return (
// 		<div className="w-full flex flex-col gap-4">
// 			{Array.from({ length: 20 }).map(() => (
// 				<Skeleton key={useId()} className="h-106" />
// 			))}
// 		</div>
// 	);
// };
