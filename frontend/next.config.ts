import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.openverse.org",
        port: "",
        pathname: "/v1/images/**",
      },
      {
        protocol: "https",
        hostname: "api.openverse.org",
        port: "",
        pathname: "/v1/audio/**",
      },
    ],
  },
};

export default nextConfig;
