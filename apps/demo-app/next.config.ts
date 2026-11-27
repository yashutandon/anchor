import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@anchor/spec", "@anchor/renderer"],
};

export default nextConfig;
