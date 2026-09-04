/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
    ],
  },
};




export default nextConfig;
  reactStrictMode: true,
  images: {
    Standard_scalar: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.coingecko.com',
        },
        {
          protocol: 'https',
          hostname: 'coin-images.coingecko.com',
        },
      ]}

