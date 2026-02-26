#!/usr/bin/env node
/**
 * Generate the OG social card image by screenshotting /og-card with Puppeteer.
 *
 * Usage:
 *   node hack/generate-og-image.mjs            # uses http://localhost:3000
 *   node hack/generate-og-image.mjs <base-url>  # custom dev server URL
 *
 * The dev server must be running before you execute this script.
 * Output: public/og-image.png (1200×630 @2x for retina crispness)
 */
import puppeteer from "puppeteer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.argv[2] || "http://localhost:3000";
const OUT_PATH = join(__dirname, "..", "public", "og-image.png");

async function main() {
  console.log(`📸 Capturing OG card from ${BASE_URL}/og-card ...`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 2x device scale for retina-crisp output
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  await page.goto(`${BASE_URL}/og-card`, { waitUntil: "networkidle0" });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Hide Next.js dev mode indicator
  await page.evaluate(() => {
    document.querySelector("nextjs-portal")?.remove();
  });

  await page.screenshot({
    path: OUT_PATH,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });

  await browser.close();
  console.log(`✅ Saved to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
