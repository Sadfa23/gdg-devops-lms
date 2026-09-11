import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // The dev-only route badge overlaps the sidebar's identity block at this
  // width; it never ships to production either way, just noise while working.
  devIndicators: false,
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN, // only needed to upload source maps; safe to leave unset
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
