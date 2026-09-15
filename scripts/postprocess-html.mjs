import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = fileURLToPath(new URL("../_book/", import.meta.url));
async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectHtmlFiles(path) : entry.name.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
}

for (const path of await collectHtmlFiles(outputDir)) {
  const html = await readFile(path, "utf8");
  const fixed = html
    .replaceAll("&amp;#123;", "&#123;")
    .replaceAll("&amp;#125;", "&#125;")
    // HonKit leaves Markdown links written in page content as .md paths.
    // GitHub Pages serves the generated .html files instead.
    .replace(/href="([^"]+?)\.md(#[^"]*)?"/g, (_, path, hash = "") => `href="${path}.html${hash}"`);
  if (fixed !== html) await writeFile(path, fixed);
}
