import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      "*.mdx": {
        loaders: ["@mdx-js/loader"],
        as: "*.jsx",
      },
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
