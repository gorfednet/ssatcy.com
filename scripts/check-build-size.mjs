/**
 * Enforce conservative production asset budgets after Vite builds.
 * Run: npm run check:size
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "dist", "assets");

const budgets = {
  maxJavaScriptChunk: 450 * 1024,
  maxJavaScriptGzipTotal: 150 * 1024,
  maxCssGzipTotal: 25 * 1024,
  maxImage: 300 * 1024,
  maxImageTotal: 2 * 1024 * 1024,
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(target)));
    } else {
      files.push(target);
    }
  }

  return files;
}

const files = await listFiles(assetsDir);
const javascript = files.filter((file) => file.endsWith(".js"));
const css = files.filter((file) => file.endsWith(".css"));
const images = files.filter((file) =>
  /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(file),
);

const sizes = new Map(
  await Promise.all(
    files.map(async (file) => [file, (await stat(file)).size]),
  ),
);

async function gzipTotal(targets) {
  let total = 0;
  for (const file of targets) {
    total += gzipSync(await readFile(file)).byteLength;
  }
  return total;
}

const jsGzipTotal = await gzipTotal(javascript);
const cssGzipTotal = await gzipTotal(css);
const imageTotal = images.reduce((total, file) => total + sizes.get(file), 0);
const failures = [];

for (const file of javascript) {
  if (sizes.get(file) > budgets.maxJavaScriptChunk) {
    failures.push(
      `${path.basename(file)} exceeds the ${budgets.maxJavaScriptChunk / 1024} kB JavaScript chunk budget`,
    );
  }
}

for (const file of images) {
  if (sizes.get(file) > budgets.maxImage) {
    failures.push(
      `${path.basename(file)} exceeds the ${budgets.maxImage / 1024} kB image budget`,
    );
  }
}

if (jsGzipTotal > budgets.maxJavaScriptGzipTotal) {
  failures.push("Aggregate gzipped JavaScript exceeds 150 kB");
}
if (cssGzipTotal > budgets.maxCssGzipTotal) {
  failures.push("Aggregate gzipped CSS exceeds 25 kB");
}
if (imageTotal > budgets.maxImageTotal) {
  failures.push("Aggregate built images exceed 2 MB");
}

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

console.log(`JavaScript: ${formatKb(jsGzipTotal)} gzip`);
console.log(`CSS: ${formatKb(cssGzipTotal)} gzip`);
console.log(`Images: ${formatKb(imageTotal)} total`);

if (failures.length > 0) {
  console.error("\nBuild size budget failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Build size budget passed.");
}
