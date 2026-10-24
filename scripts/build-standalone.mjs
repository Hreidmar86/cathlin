import { build } from 'vite';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Bundle the game into one file that can run directly from Windows Explorer.
const project = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  root: project,
  publicDir: false,
  build: {
    write: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
if (Array.isArray(result)) throw new Error('Expected a single game bundle.');
const entries = result.output.filter(file => file.type === 'chunk');
if (entries.length !== 1 || entries[0].imports.length || entries[0].dynamicImports.length) {
  throw new Error('The standalone game must not require external JavaScript files.');
}
const css = result.output
  .filter(file => file.type === 'asset' && file.fileName.endsWith('.css'))
  .map(file => String(file.source))
  .join('\n')
  // Use system fonts so the downloadable edition works without Internet access.
  .replace(/@import\s*(?:url\([^)]*\)|"[^"]*"|'[^']*')\s*;?/g, '');
const javascript = entries[0].code.replace(/<\/script/gi, '<\\/script');
const html = `<!doctype html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Vildmarken – Resan Hem. Ett mysigt skogsäventyr att spela direkt i webbläsaren.">
  <title>Vildmarken – Resan Hem</title>
  <style>${css.replace(/<\/style/gi, '<\\/style')}</style>
</head>
<body>
  <div id="root"></div>
  <noscript>Aktivera JavaScript i webbläsaren för att spela Vildmarken.</noscript>
  <script type="module">${javascript}</script>
</body>
</html>
`;
const destination = new URL('../SPELA-VILDMARKEN.html', import.meta.url);
await writeFile(destination, html, 'utf8');
console.log(`Created ${fileURLToPath(destination)} (${Buffer.byteLength(html)} bytes).`);
