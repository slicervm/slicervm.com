import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-static";
export const size = {
  width: 1200,
  height: 630,
};
export const alt = "SlicerVM — Real Linux, in milliseconds";
export const contentType = "image/png";

/**
 * Serve the pre-generated OG image produced by `npm run og`.
 * Falls back to a minimal rendered card if the static file doesn't exist yet.
 */
export default async function OpenGraphImage() {
  try {
    const png = await readFile(join(process.cwd(), "public", "og-image.png"));
    return new Response(new Uint8Array(png), {
      headers: { "Content-Type": "image/png" },
    });
  } catch {
    // Fallback: render a simple card so builds don't break before first og generation
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fcfcfd",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#1a1f31",
          }}
        >
          SlicerVM
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#69768a",
            marginTop: 16,
          }}
        >
          Real Linux, in milliseconds.
        </div>
      </div>,
      { ...size },
    );
  }
}
