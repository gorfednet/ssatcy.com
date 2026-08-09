/**
 * Verify that a deployment's bundles, assets, and deep links are available.
 *
 * Usage:
 *   node scripts/verify-production.mjs
 *   node scripts/verify-production.mjs --assets-only
 *   node scripts/verify-production.mjs --base-url https://example.com --dist dist
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const execFileAsync = promisify(execFile);

const getOption = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};

const baseUrl = getOption(
  "--base-url",
  process.env.PRODUCTION_URL ?? "https://ssatcy.com",
).replace(/\/+$/, "");
const distDir = path.resolve(getOption("--dist", path.join(root, "dist")));
const assetsOnly = args.includes("--assets-only");
const routes = ["/", "/bio", "/music", "/film", "/games", "/live", "/gallery", "/contact"];
const verificationId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const requestTimeoutMs = Number(process.env.VERIFY_TIMEOUT_MS ?? 45_000);
const verificationWorkers = Number(process.env.VERIFY_WORKERS ?? 2);

const addCacheBuster = (url) => {
  const target = new URL(url);
  target.searchParams.set("__deploy_verify", verificationId);
  return target.toString();
};

async function request(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const { stdout } = await execFileAsync(
        "curl",
        [
          "--fail",
          "--silent",
          "--show-error",
          "--location",
          "--connect-timeout",
          "10",
          "--max-time",
          String(Math.ceil(requestTimeoutMs / 1_000)),
          "--user-agent",
          "Mozilla/5.0 SSATCY deployment verifier",
          "--header",
          "Cache-Control: no-cache",
          addCacheBuster(url),
        ],
        {
          encoding: "buffer",
          maxBuffer: 5 * 1024 * 1024,
        },
      );

      return stdout;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
      }
    }
  }

  throw new Error(`${url}: ${lastError?.message ?? "request failed"}`);
}

async function verifyUrls(urls, label) {
  const failures = [];
  let nextIndex = 0;
  const workerCount = Math.min(verificationWorkers, urls.length);

  async function worker() {
    while (nextIndex < urls.length) {
      const index = nextIndex;
      nextIndex += 1;
      const url = urls[index];

      try {
        await request(url);
      } catch (error) {
        failures.push(error.message);
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  if (failures.length > 0) {
    throw new Error(`${label} verification failed:\n- ${failures.join("\n- ")}`);
  }

  console.log(`${label}: ${urls.length} passed`);
}

const assetNames = (await readdir(path.join(distDir, "assets"), {
  withFileTypes: true,
}))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();
const assetUrls = assetNames.map(
  (assetName) => `${baseUrl}/assets/${encodeURIComponent(assetName)}`,
);

await verifyUrls(assetUrls, "Assets");

if (!assetsOnly) {
  const localHtml = await readFile(path.join(distDir, "index.html"), "utf8");
  const productionHtml = (await request(`${baseUrl}/`)).toString("utf8");
  const bundlePattern = /\/assets\/index-[^"' ]+\.(?:js|css)/g;
  const localBundles = [...new Set(localHtml.match(bundlePattern) ?? [])].sort();
  const productionBundles = [
    ...new Set(productionHtml.match(bundlePattern) ?? []),
  ].sort();

  if (
    localBundles.length === 0 ||
    JSON.stringify(localBundles) !== JSON.stringify(productionBundles)
  ) {
    throw new Error(
      `Production bundle mismatch.\nExpected: ${localBundles.join(", ")}\nReceived: ${productionBundles.join(", ")}`,
    );
  }

  console.log(`Bundles: ${productionBundles.join(", ")}`);
  await verifyUrls(
    routes.map((route) => `${baseUrl}${route}`),
    "Deep links",
  );
}

console.log(
  assetsOnly
    ? "Pre-publish asset verification passed."
    : "Production deployment verification passed.",
);
