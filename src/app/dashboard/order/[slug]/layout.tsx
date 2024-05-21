import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col gap-4 max-w-screen-md mx-auto">
			<Link href="/dashboard">
				<Button variant="link">
					<ChevronLeft /> Go Back
				</Button>
			</Link>
			{children}
		</div>
	);
};

export default OrderLayout;
