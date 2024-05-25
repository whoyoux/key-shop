import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import type { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const DashboardPage = async () => {
	const session = await auth();

	if (!session?.user) return notFound();

	const orders = await prisma.order.findMany({
		where: {
			userId: session.user.id,
		},
		include: {
			offer: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="flex flex-col">
			<Tabs defaultValue="account" className="w-full">
				<TabsList className="w-full justify-start">
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="orders">My orders</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<AccountTab user={session.user} />
				</TabsContent>
				<TabsContent value="orders">
					<MyOrdersTab orders={orders} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

type OrderWithOffer = Prisma.OrderGetPayload<{
	include: {
		offer: true;
	};
}>;

const OrderCard = ({ order, idx }: { order: OrderWithOffer; idx: number }) => {
	return (
		<Link href={`/dashboard/order/${order.id}`}>
			<div className="px-4 py-6 bg-card border rounded-lg flex items-center gap-2">
				<div className="relative aspect-[2/1] min-w-[100px]">
					<Image
						src={order.offer.imageUrl}
						alt="offer image"
						fill
						className="rounded-lg"
					/>
				</div>
				<div>
					<h2 className="text-lg font-semibold">Order #{idx}</h2>

					<p className="text-sm">
						Total:{" "}
						{order.isPaid ? (
							formatPrice(Number(order.paidAmount))
						) : (
							<span className="text-sm font-semibold text-red-500">
								NOT PAID
							</span>
						)}
					</p>
				</div>
			</div>
		</Link>
	);
};

const MyOrdersTab = ({ orders }: { orders: OrderWithOffer[] }) => {
	return (
		<div className="flex flex-col gap-4 mt-10">
			<h2 className="font-semibold text-xl">Your orders</h2>
			{orders.map((order, idx) => (
				<OrderCard key={order.id} order={order} idx={orders.length - idx} />
			))}
		</div>
	);
};

const AccountTab = ({ user }: { user: User }) => {
	return (
		<div className="mt-10">
			<section>
				<div className="flex items-center gap-4">
					<div className="relative rounded-full">
						<Image
							src={user.image || ""}
							alt="avatar"
							width={82}
							height={82}
							className="rounded-lg bg-card"
						/>
					</div>
					<div>
						<h2 className="font-semibold text-xl">{user.name}</h2>
						<p className="text-sm">
							<strong>{user.email}</strong>
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default DashboardPage;
