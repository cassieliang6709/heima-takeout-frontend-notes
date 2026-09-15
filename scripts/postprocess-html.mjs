import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = fileURLToPath(new URL("../_book/", import.meta.url));
const files = await readdir(outputDir);

for (const file of files.filter((name) => name.endsWith(".html"))) {
  const path = join(outputDir, file);
  const html = await readFile(path, "utf8");
  const fixed = html
    .replaceAll("&amp;#123;", "&#123;")
    .replaceAll("&amp;#125;", "&#125;");
  if (fixed !== html) await writeFile(path, fixed);
}
