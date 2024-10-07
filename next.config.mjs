/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: "cdn.shopify.com",
        },
        {
            protocol: "https",
            hostname:"dummyimage.com"
        }
    ],
  }
};

export default nextConfig;
