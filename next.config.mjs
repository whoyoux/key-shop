/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "cdn.akamai.steamstatic.com",
				protocol: "https",
			},
			{
				hostname: "cdn.discordapp.com",
				protocol: "https",
			},
		],
	},
	experimental: {
		reactCompiler: true,
	},
};

export default nextConfig;
