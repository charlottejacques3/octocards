import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
	compiler: {
		styledComponents: true,
	},
  async rewrites() {
		return [
			{
				source: '/api-proxy/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL}:path*/`,
			},
		]
	},
};

export default nextConfig;
