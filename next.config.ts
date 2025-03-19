import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: [
			"www.badflay.com",
			"cdn-icons-png.flaticon.com",
			"wp.badmintonlaorden.es",
			"192.168.1.33",
			"51.75.207.217",
			"badscoring.duckdns.org",
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*", // Permite todos los orígenes, puedes restringir si es necesario
					},
				],
			},
		];
	},
};

export default nextConfig;
