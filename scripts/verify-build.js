const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');

// 1. Verify vercel.json
const vercelCfg = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
assert(Array.isArray(vercelCfg.rewrites), 'vercel.json missing rewrites array');

// 2. Verify SEO files exist and contain required URLs/rules
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const robotsPath = path.join(root, 'public', 'robots.txt');
assert(fs.existsSync(sitemapPath), 'public/sitemap.xml missing');
assert(fs.existsSync(robotsPath), 'public/robots.txt missing');

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const requiredUrls = [
  'https://tweak-lab-a177.vercel.app/',
  'https://tweak-lab-a177.vercel.app/pc',
  'https://tweak-lab-a177.vercel.app/store',
  'https://tweak-lab-a177.vercel.app/guides',
  'https://tweak-lab-a177.vercel.app/guides/fix-fortnite-fps-drops',
  'https://tweak-lab-a177.vercel.app/guides/reduce-valorant-input-delay',
  'https://tweak-lab-a177.vercel.app/guides/best-windows-settings-gaming'
];
requiredUrls.forEach((url) => {
  assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml missing ${url}`);
});

const robots = fs.readFileSync(robotsPath, 'utf8');
assert(robots.includes('Disallow: /admin'), 'robots.txt missing Disallow: /admin');
assert(robots.includes('Sitemap: https://tweak-lab-a177.vercel.app/sitemap.xml'), 'robots.txt missing Sitemap directive');

// 3. Verify store catalog, dual portal, pc page, store page, and guide HTML pages exist
const storeCatalog = require(path.join(root, 'data', 'storeProducts.js'));
assert(Array.isArray(storeCatalog.products) && storeCatalog.products.length === 15, 'data/storeProducts.js must contain 15 PSN gift card products');
assert(Array.isArray(storeCatalog.psnRegions) && storeCatalog.psnRegions.length === 4, 'data/storeProducts.js missing 4 PSN regions');
storeCatalog.products.forEach((p) => {
  assert(p.id && p.title && p.category === 'psn' && Number(p.priceEgp) > 0, `Invalid PSN store product: ${JSON.stringify(p)}`);
});

[
  'data/storeProducts.js',
  'public/index.html',
  'public/pc/index.html',
  'public/store/index.html',
  'public/assets/guides.css',
  'public/guides/index.html',
  'public/guides/fix-fortnite-fps-drops/index.html',
  'public/guides/reduce-valorant-input-delay/index.html',
  'public/guides/best-windows-settings-gaming/index.html'
].forEach((rel) => {
  assert(fs.existsSync(path.join(root, rel)), `Missing required site file: ${rel}`);
});

// 4. Validate server.js and inline scripts in index.html, pc/index.html, store/index.html & admin.html
new vm.Script(fs.readFileSync(path.join(root, 'server.js'), 'utf8'), { filename: 'server.js' });
['public/index.html', 'public/pc/index.html', 'public/store/index.html', 'public/admin.html'].forEach((rel) => {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    if (m[1].trim()) new vm.Script(m[1], { filename: rel });
  }
});

console.log('✅ Tweak Lab build verification passed (Dual-Portal /, /pc, /store, catalog, SEO sitemap, robots, guides, vercel.json, JS syntax).');
