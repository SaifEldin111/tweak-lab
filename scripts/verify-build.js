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

// 3. Verify store catalog (15 PSN + 5 Steam Wallet + 2 GTA VI Bundles = 22 products with discount metadata), dual portal, pc page, store page, GTA VI wallpapers, and guide HTML pages exist
const storeCatalog = require(path.join(root, 'data', 'storeProducts.js'));
assert(Array.isArray(storeCatalog.products) && storeCatalog.products.length === 22, 'data/storeProducts.js must contain 22 products (15 PSN + 5 Steam + 2 GTA VI Bundles)');
assert(storeCatalog.products.filter((p) => p.category === 'psn').length === 15, 'data/storeProducts.js must contain 15 PSN gift card products');
assert(storeCatalog.products.filter((p) => p.category === 'steam').length === 5, 'data/storeProducts.js must contain 5 Steam Wallet products');
assert(storeCatalog.products.filter((p) => p.category === 'gta6').length === 2, 'data/storeProducts.js must contain 2 GTA VI PS5 bundles');
assert(Array.isArray(storeCatalog.psnRegions) && storeCatalog.psnRegions.length === 4, 'data/storeProducts.js missing 4 PSN regions');
storeCatalog.products.forEach((p) => {
  assert(
    p.id && p.title && (p.category === 'psn' || p.category === 'steam' || p.category === 'gta6') && Number(p.priceEgp) > 0 && Number(p.originalPrice) > Number(p.priceEgp) && Number(p.discountPercent) > 0,
    `Invalid store product or discount metadata: ${JSON.stringify(p)}`
  );
});

[
  'data/storeProducts.js',
  'public/index.html',
  'public/pc/index.html',
  'public/store/index.html',
  'public/gta6-1.jpg',
  'public/gta6-2.jpg',
  'public/gta6-3.jpg',
  'public/gta6-4.jpg',
  'public/assets/guides.css',
  'public/guides/index.html',
  'public/guides/fix-fortnite-fps-drops/index.html',
  'public/guides/reduce-valorant-input-delay/index.html',
  'public/guides/best-windows-settings-gaming/index.html'
].forEach((rel) => {
  const fullPath = path.join(root, rel);
  assert(fs.existsSync(fullPath), `Missing required site file: ${rel}`);
  if (rel.endsWith('.jpg')) {
    const buf = fs.readFileSync(fullPath);
    assert(buf.length > 50000 && buf[0] === 0xff && buf[1] === 0xd8, `Invalid or corrupt JPEG asset: ${rel}`);
  }
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
