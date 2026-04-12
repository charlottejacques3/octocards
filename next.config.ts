import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
		return [
			{
				source: '/api-proxy/:path*/',
				destination: `https://from-savanna-stoop.ngrok-free.dev/:path*/`,
			},
		]
	},
  images: {
    unoptimized: true, // temporary for debugging
  },
  trailingSlash: true,
};

export default nextConfig;
