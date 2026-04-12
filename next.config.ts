import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
		return [
			{
				source: '/api-proxy/:path*/',
				destination: `${process.env.NEXT_PUBLIC_API_URL}:path*/`,
			},
		]
	},
  images: {
    unoptimized: true, // temporary for debugging
  },
  trailingSlash: true,
};

export default nextConfig;
