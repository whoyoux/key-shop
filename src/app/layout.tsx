import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import Header from "@/components/header";
import { cn } from "@/lib/utils";

import { siteConfig } from "@/config/site";
import { SessionProvider } from "next-auth/react";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		"Games",
		"Steam games",
		"Games key",
		"Games keys",
		"keys",
		"Steam games key",
		"Steam games keys",
	],
	authors: [
		{
			name: "whoyoux",
			url: "https://whx.world",
		},
	],
	creator: "WHX",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [`${siteConfig.url}/og.jpg`],
		creator: "@whx",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={cn(
					"min-h-[dvh] bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Header />
				<main className="px-4 md:px-8 xl:px-12 pb-20">{children}</main>
			</body>
		</html>
	);
}
