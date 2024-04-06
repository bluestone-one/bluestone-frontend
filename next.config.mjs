/** @type {import('next').NextConfig} */
import { API_DOMAIN } from "./constants/constants.js";

console.log("NEXT_PUBLIC_ENVIRONMENT", process.env.NEXT_PUBLIC_ENVIRONMENT);
console.log("API_DOMAIN", API_DOMAIN);

const rewrites = () => {
  return [
    {
      source: "/baseAPI/:path*",
      destination: `${API_DOMAIN}/:path*`,
    },
  ];
};

const nextConfig = {
  rewrites,
  reactStrictMode: true,
  swcMinify: true,
  fastRefresh: true,
  concurrentFeatures: true,
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  minify: false, // Disable minification
  // experimental: {
  //   esmExternals: "loose",
  // },
};

export default nextConfig;
