import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const DashboardPage = async () => {
	const session = await auth();

	if (!session?.user) return notFound();

	const orders = await prisma.order.findMany({
		where: {
			userId: session.user.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="flex flex-col">
			<Tabs defaultValue="orders" className="w-full">
				<TabsList className="w-full justify-start">
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="orders">My orders</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					Make changes to your account here.
				</TabsContent>
				<TabsContent value="orders">
					<div className="flex flex-col gap-4 mt-10">
						{orders.map((order, idx) => (
							<OrderCard
								key={order.id}
								order={order}
								idx={orders.length - idx}
							/>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

const OrderCard = ({ order, idx }: { order: Order; idx: number }) => {
	return (
		<div className="px-4 py-6 bg-card border rounded-lg">
			<Link href={`/dashboard/order/${order.id}`}>
				<h2 className="text-lg font-semibold">Order #{idx}</h2>
			</Link>
			<p className="text-sm">
				Total:{" "}
				{order.isPaid ? (
					formatPrice(Number(order.paidAmount))
				) : (
					<span className="text-sm font-semibold text-red-500">NOT PAID</span>
				)}
			</p>
		</div>
	);
};

export default DashboardPage;
