import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const blocks = [
  ["hero", "Hero"],
  ["brand-intro", "Brand intro"],
  ["brand-intro-full", "Brand intro full"],
  ["track-mounting-switcher", "CSS switcher"],
  ["benefits", "Benefits"],
  ["catalog-cta", "Catalog CTA"],
  ["consultation-cta", "Consultation CTA"],
  ["client-mounting-benefits", "Client benefits"],
];

const fragments = [];

for (const [slug, title] of blocks) {
  let fragment = await readFile(join(root, "blocks", slug, "index.html"), "utf8");

  fragment = fragment
    .replaceAll(
      "https://cdn.championled.ru/https://cdn.championled.ru/assets/",
      `blocks/${slug}/assets/`,
    )
    .replace(/(["'(])assets\//g, `$1blocks/${slug}/assets/`);

  fragments.push(`
    <!-- ${title} -->
    <div class="preview-block" id="${slug}">
${fragment}
    </div>`);
}

const navigation = blocks
  .map(([slug, title]) => `<a href="#${slug}">${title}</a>`)
  .join("\n      ");

const page = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#111111">
  <title>Чемпион LED — превью блоков</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; background: #fff; }
    body { margin: 0; overflow-x: hidden; background: #fff; }
    .preview-nav {
      position: sticky;
      z-index: 10000;
      top: 0;
      display: flex;
      gap: 8px;
      padding: 9px max(12px, env(safe-area-inset-left));
      overflow-x: auto;
      background: rgba(17, 17, 17, .92);
      backdrop-filter: blur(12px);
      scrollbar-width: none;
    }
    .preview-nav::-webkit-scrollbar { display: none; }
    .preview-nav a {
      flex: 0 0 auto;
      padding: 7px 10px;
      border: 1px solid #555;
      border-radius: 999px;
      color: #fff;
      font: 11px/1 Arial, Helvetica, sans-serif;
      text-decoration: none;
    }
    .preview-block { width: 100%; margin: 0; overflow: visible; background: #fff; }
    .preview-block + .preview-block { margin-top: 100px; }
    .preview-block:last-child { margin-bottom: 100px; }
    .preview-block > section { margin-inline: auto; }
  </style>
</head>
<body>
  <nav class="preview-nav" aria-label="Навигация по блокам">
      ${navigation}
  </nav>
  <main>${fragments.join("\n")}
  </main>
</body>
</html>
`;

await writeFile(join(root, "index.html"), page);
console.log(`Built index.html from ${blocks.length} blocks without iframes.`);
