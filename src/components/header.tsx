import { Button } from "@/components//ui/button";
import { auth, signIn, signOut } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Session } from "next-auth";

const Header = async () => {
	const session = await auth();
	return (
		<header className="flex items-center justify-between w-full px-3 md:px-6 xl:px-12 py-6 border-b bg-card mb-10">
			<Link href="/">
				<h1 className="text-lg font-semibold">KeyShop</h1>
			</Link>
			<div className="flex gap-2 items-center">
				{/* <Button variant="link">Search</Button> */}
				{/* <Button variant="link">Games</Button> */}
				{/* <Button variant="link">Software</Button> */}
				<Button variant="link">Specials</Button>
				<Suspense fallback={<Button disabled>Login</Button>}>
					{session?.user ? (
						<UserDropdown user={session.user} />
					) : (
						<SignInButton />
					)}
				</Suspense>
			</div>
		</header>
	);
};

const UserDropdown = ({ user }: { user: Session["user"] }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost" className="rounded-full">
					<Avatar>
						<AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
						<AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-56 mx-4">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href="/dashboard">
					<DropdownMenuItem>Dashboard</DropdownMenuItem>
				</Link>
				<DropdownMenuItem>Billing</DropdownMenuItem>
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuSeparator />
				<SignOut>
					<DropdownMenuItem className="w-full text-red-500">
						Sign Out
					</DropdownMenuItem>
				</SignOut>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const SignInButton = () => {
	const login = async () => {
		"use server";
		await signIn("discord");
	};
	return (
		<form action={login}>
			<Button className="font-semibold" type="submit">
				Login
			</Button>
		</form>
	);
};

const SignOutButton = () => {
	const logout = async () => {
		"use server";
		await signOut();
	};
	return (
		<form action={logout}>
			<Button className="font-semibold">Logout</Button>
		</form>
	);
};

const SignOut = ({ children }: { children: React.ReactNode }) => {
	const logout = async () => {
		"use server";
		await signOut({ redirectTo: "/" });
	};
	return (
		<form action={logout} className="w-full">
			<button type="submit" className="w-full">
				{children}
			</button>
		</form>
	);
};

export default Header;
