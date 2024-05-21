import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
	params: {
		slug: string;
	};
};

const OrderPage = async ({ params }: Props) => {
	const session = await auth();
	if (!session?.user) return notFound();

	const order = await prisma.order.findUnique({
		where: {
			id: params.slug,
			userId: session.user.id,
		},
		include: {
			offer: true,
			key: true,
		},
	});

	if (!order) return notFound();

	if (!order.isPaid) return <OrderNotPaid />;

	return (
		<div>
			<div className="w-full flex flex-col gap-4">
				<h1 className="text-xl font-semibold">Your order</h1>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="aspect-[2/1] min-w-[200px] relative">
						<Image
							src={order.offer.imageUrl}
							alt="Order image"
							fill
							quality={60}
							className="rounded-md"
						/>
					</div>

					<div>
						<h2 className="text-lg font-semibold">{order.offer.title}</h2>
						<p className="text-sm text-muted-foreground">
							{order.offer.shortDescription}
						</p>
					</div>
				</div>
				<div>
					<h2 className="text-lg font-medium">
						Your key: <span className="text-primary">{order.key?.key}</span>
					</h2>
				</div>
			</div>
		</div>
	);
};

const OrderNotPaid = () => {
	return (
		<div className="w-full flex flex-col gap-4">
			<h1 className="text-xl font-semibold">Order not paid</h1>
			<p>
				You have not paid for this order yet. Please complete the payment to get
				your key.
			</p>
		</div>
	);
};

export default OrderPage;
