import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Project Pages serves this repository beneath /escapejson.
  // Keep the local development URL at the root path.
  basePath: isGitHubActions ? "/escapejson" : undefined,
};

export default nextConfig;
