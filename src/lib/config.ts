export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://slicervm.com");
export const SITE_NAME = "SlicerVM";
export const SITE_TITLE = "SlicerVM | Real Linux, in milliseconds";
export const SITE_DESCRIPTION =
  "Boot full Linux microVMs with systemd in milliseconds for AI sandboxes, edge workloads, and production services on Mac, Linux, and bare-metal.";
