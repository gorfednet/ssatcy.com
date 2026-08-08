/**
 * Generate responsive WebP variants from the original site artwork.
 * Run: npm run images
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "src", "assets", "images");
const outputDir = path.join(sourceDir, "generated");

const images = [
  {
    source: "905a87e3a953527b690448dc7f96e3c3c0084d12.png",
    name: "hero",
    widths: [480, 768],
  },
  {
    source: "9e419ee32b8903e8fa15cc163610381b02a3dfdc.jpg",
    name: "studio-console",
    widths: [640, 960],
  },
  {
    source: "b78e566ee55cc388d3a670e9c395fcd4dd706bf3.jpg",
    name: "studio-overhead",
    widths: [640, 960],
  },
  {
    source: "52f6c1ed18b31900c07429e3394a1d7fb800c9ec.jpg",
    name: "studio-room",
    widths: [640, 960],
  },
  {
    source: "a809402786d6acbe4e6000f008ff37edfa1c446b.jpg",
    name: "synth-wall",
    widths: [640, 960],
  },
  {
    source: "85e2cb36f2ea69b70ef34514d6958f2e4194276d.jpg",
    name: "turntables",
    widths: [640, 960],
  },
  {
    source: "nite-comfort-10-handlebar-2014.jpg",
    name: "nite-comfort-live",
    widths: [640, 960],
  },
  {
    source: "5cb832c12d1b9d3307272010eb5a651c5164a8f8.png",
    name: "garage",
    widths: [640, 1280],
  },
  {
    source: "tapped-poster.png",
    name: "tapped-poster",
    widths: [640, 1200],
  },
  {
    source: "unit5-comic.png",
    name: "unit5-comic",
    widths: [640, 1200],
  },
  {
    source: "knickknack-poster.png",
    name: "knickknack-poster",
    widths: [640, 1200],
  },
  {
    source: "nite-comfort-10-flyer.jpg",
    name: "nite-comfort-flyer",
    widths: [640, 1200],
  },
];

await mkdir(outputDir, { recursive: true });

for (const image of images) {
  const input = path.join(sourceDir, image.source);
  const metadata = await sharp(input).metadata();

  for (const width of image.widths) {
    const outputWidth = Math.min(width, metadata.width ?? width);
    const output = path.join(outputDir, `${image.name}-${outputWidth}.webp`);

    await sharp(input)
      .rotate()
      .resize({ width: outputWidth, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(output);

    console.log(`Wrote ${path.relative(root, output)}`);
  }
}
