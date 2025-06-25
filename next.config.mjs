/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(",") || [
      "drive.google.com",
      "drive.usercontent.google.com",
      "lh3.google.com",
    ],
  },
};

export default nextConfig;
