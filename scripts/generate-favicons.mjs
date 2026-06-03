/**
 * Rasterize public/favicon.svg into ICO/PNG suite and site.webmanifest.
 * Run: npm run icons
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const svgPath = path.join(publicDir, "favicon.svg");

const pngSizes = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

const svg = await readFile(svgPath);

for (const { name, size } of pngSizes) {
  const out = path.join(publicDir, name);
  await sharp(svg, { density: 72 })
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`Wrote ${name}`);
}

const icoPngBuffers = await Promise.all(
  [16, 32, 48].map((size) =>
    sharp(svg, { density: 72 }).resize(size, size).png().toBuffer(),
  ),
);

const ico = await toIco(icoPngBuffers);
await writeFile(path.join(publicDir, "favicon.ico"), ico);
console.log("Wrote favicon.ico");

const manifest = {
  name: "SSATCY | Sunshine Sneeze and the Contagious Yawn",
  short_name: "SSATCY",
  description:
    "SSATCY is a Toronto-based musical duo. Explore our discography, film scoring, game soundtracks, events, and visual archive.",
  start_url: "/",
  display: "standalone",
  theme_color: "#09090b",
  background_color: "#09090b",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
};

await writeFile(
  path.join(publicDir, "site.webmanifest"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log("Wrote site.webmanifest");
