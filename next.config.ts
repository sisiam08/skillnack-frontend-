import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploads are stored on Cloudinary and, for some accounts, Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // `quality={80}` is used on avatars; Next only allows configured qualities.
    qualities: [75, 80],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
