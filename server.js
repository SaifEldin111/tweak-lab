const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

function getProtectedFileBuffer(filename) {
  const directPath = path.join(PROTECTED_DIR, filename);
  if (fs.existsSync(directPath)) {
    return fs.readFileSync(directPath);
  }
  const zipPath = path.join(PROTECTED_DIR, 'Best_Optimization_for_2027_FPS_Plus.zip');
  if (!fs.existsSync(zipPath)) return null;
  const zipBuffer = fs.readFileSync(zipPath);
  let offset = 0;
  while (offset < zipBuffer.length - 4) {
    if (zipBuffer.readUInt32LE(offset) === 0x02014b50) {
      const compMethod = zipBuffer.readUInt16LE(offset + 10);
      const compSize = zipBuffer.readUInt32LE(offset + 20);
      const fnLen = zipBuffer.readUInt16LE(offset + 28);
      const extraLen = zipBuffer.readUInt16LE(offset + 30);
      const commentLen = zipBuffer.readUInt16LE(offset + 32);
      const localOffset = zipBuffer.readUInt32LE(offset + 42);
      const name = zipBuffer.slice(offset + 46, offset + 46 + fnLen).toString('utf8');
      if (name === filename) {
        const lFnLen = zipBuffer.readUInt16LE(localOffset + 26);
        const lExtraLen = zipBuffer.readUInt16LE(localOffset + 28);
        const dataStart = localOffset + 30 + lFnLen + lExtraLen;
        const compData = zipBuffer.slice(dataStart, dataStart + compSize);
        return compMethod === 0 ? compData : zlib.inflateRawSync(compData);
      }
      offset += 46 + fnLen + extraLen + commentLen;
    } else {
      offset++;
    }
  }
  return null;
}

const PORT = process.env.PORT || 3027;
const IS_VERCEL = !!process.env.VERCEL;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PROTECTED_DIR = path.join(ROOT_DIR, 'protected_product');
const DATA_DIR = IS_VERCEL ? '/tmp/tweaklab_data' : path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const SEED_ORDERS_FILE = path.join(ROOT_DIR, 'seed_orders.json');

// Ensure writable directories exist
[DATA_DIR, UPLOADS_DIR].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}
});

const DEFAULT_SETTINGS = {
  brandName: 'TWEAK LAB',
  productTitle: 'BEST OPTIMIZATION FOR 2027 FPS+',
  priceEgp: 99,
  originalPriceEgp: 350,
  discountedPriceEgp: 85,
  activePromoCodes: {
    'TWEAK85': 85
  },
  paymentPhone: '01020670418',
  instapayAddress: '01020670418',
  instapayLink: 'https://ipn.eg/S/saifelmasry2729/instapay/9kpkdW',
  deliveryMinutes: 5,
  videoUrl: 'https://youtu.be/siLX2H0Un6M?si=LnILe9bundoA2Pxt',
  videoTitle: 'فيديو الشرح العملي الكامل: إزاي تطبق كل التويكات بأمان وتضاعف الـ FPS',
  videoNotes: 'شاهد الفيديو بالكامل (5 دقائق) قبل تشغيل أداة best optimization for 2027 fps +.bat كمسؤول (Run as Administrator).',
  adminPin: '2027',
  appUrl: process.env.APP_URL || 'https://tweak-lab-a177.vercel.app',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '9181613967:AAFrDjGOgAO5QOIrnzuLDpsQM7rfhJVos98',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '6161881104',
  discordWebhookUrl: ''
};

global.__TWEAKLAB_SETTINGS__ = global.__TWEAKLAB_SETTINGS__ || null;
global.__TWEAKLAB_ORDERS__ = global.__TWEAKLAB_ORDERS__ || null;
global.__TWEAKLAB_LAST_SYNC__ = global.__TWEAKLAB_LAST_SYNC__ || 0;

function getBlobSdk() {
  if (global.__VERCEL_BLOB__) return global.__VERCEL_BLOB__;
  try {
    global.__VERCEL_BLOB__ = require('@vercel/blob');
    return global.__VERCEL_BLOB__;
  } catch (e) {
    return null;
  }
}

async function syncFromCloudDb(force = false) {
  const blobSdk = getBlobSdk();
  if (!blobSdk || !process.env.BLOB_READ_WRITE_TOKEN) return;
  const now = Date.now();
  if (!force && global.__TWEAKLAB_ORDERS__ && now - global.__TWEAKLAB_LAST_SYNC__ < 1500) {
    return;
  }
  try {
    const { blobs } = await blobSdk.list({ prefix: 'tweaklab_db/' });
    const orderBlobs = blobs
      .filter((b) => b.pathname.startsWith('tweaklab_db/orders_'))
      .sort((a, b) => b.pathname.localeCompare(a.pathname));
    const settingBlobs = blobs
      .filter((b) => b.pathname.startsWith('tweaklab_db/settings_'))
      .sort((a, b) => b.pathname.localeCompare(a.pathname));

    if (orderBlobs.length > 0) {
      const r = await fetch(orderBlobs[0].url + '?t=' + now, { cache: 'no-store' });
      if (r.ok) {
        global.__TWEAKLAB_ORDERS__ = await r.json();
        try {
          fs.writeFileSync(ORDERS_FILE, JSON.stringify(global.__TWEAKLAB_ORDERS__, null, 2), 'utf8');
        } catch (e) {}
      }
    } else {
      // Very first run on Cloud DB: seed with existing local orders (e.g. TL-509761)
      let seedOrders = [];
      try {
        if (fs.existsSync(SEED_ORDERS_FILE)) {
          seedOrders = JSON.parse(fs.readFileSync(SEED_ORDERS_FILE, 'utf8'));
        }
      } catch (e) {}
      global.__TWEAKLAB_ORDERS__ = seedOrders;
      await saveOrders(seedOrders);
    }

    if (settingBlobs.length > 0) {
      const r = await fetch(settingBlobs[0].url + '?t=' + now, { cache: 'no-store' });
      if (r.ok) {
        const raw = await r.json();
        global.__TWEAKLAB_SETTINGS__ = { ...DEFAULT_SETTINGS, ...raw };
      }
    }
    global.__TWEAKLAB_LAST_SYNC__ = Date.now();
  } catch (err) {
    console.error('Cloud DB sync warning:', err.message);
  }
}

function loadSettings() {
  if (global.__TWEAKLAB_SETTINGS__) return global.__TWEAKLAB_SETTINGS__;
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      global.__TWEAKLAB_SETTINGS__ = { ...DEFAULT_SETTINGS, ...raw };
      return global.__TWEAKLAB_SETTINGS__;
    }
  } catch (e) {}
  global.__TWEAKLAB_SETTINGS__ = { ...DEFAULT_SETTINGS };
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(global.__TWEAKLAB_SETTINGS__, null, 2), 'utf8');
  } catch (e) {}
  return global.__TWEAKLAB_SETTINGS__;
}

async function saveSettings(newSettings) {
  const merged = { ...loadSettings(), ...newSettings };
  global.__TWEAKLAB_SETTINGS__ = merged;
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');
  } catch (e) {}
  const blobSdk = getBlobSdk();
  if (blobSdk && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const key = `tweaklab_db/settings_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.json`;
      await blobSdk.put(key, JSON.stringify(merged), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });
      global.__TWEAKLAB_LAST_SYNC__ = Date.now();
      const { blobs } = await blobSdk.list({ prefix: 'tweaklab_db/settings_' });
      const sorted = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
      if (sorted.length > 2) {
        await blobSdk.del(sorted.slice(2).map((b) => b.url));
      }
    } catch (e) {
      console.error('Cloud settings save error:', e.message);
    }
  }
  return merged;
}

function loadOrders() {
  if (global.__TWEAKLAB_ORDERS__) return global.__TWEAKLAB_ORDERS__;
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      global.__TWEAKLAB_ORDERS__ = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      return global.__TWEAKLAB_ORDERS__;
    }
    if (fs.existsSync(SEED_ORDERS_FILE)) {
      global.__TWEAKLAB_ORDERS__ = JSON.parse(fs.readFileSync(SEED_ORDERS_FILE, 'utf8'));
      return global.__TWEAKLAB_ORDERS__;
    }
  } catch (e) {}
  global.__TWEAKLAB_ORDERS__ = [];
  return global.__TWEAKLAB_ORDERS__;
}

async function saveOrders(orders) {
  global.__TWEAKLAB_ORDERS__ = orders;
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (e) {}
  const blobSdk = getBlobSdk();
  if (blobSdk && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const key = `tweaklab_db/orders_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.json`;
      await blobSdk.put(key, JSON.stringify(orders), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });
      global.__TWEAKLAB_LAST_SYNC__ = Date.now();
      const { blobs } = await blobSdk.list({ prefix: 'tweaklab_db/orders_' });
      const sorted = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
      if (sorted.length > 2) {
        await blobSdk.del(sorted.slice(2).map((b) => b.url));
      }
    } catch (e) {
      console.error('Cloud orders save error:', e.message);
    }
  }
}

function computeOrderSignature(orderId, pin) {
  return crypto
    .createHmac('sha256', 'tweaklab-secret-' + String(pin || '2027'))
    .update(String(orderId).trim().toUpperCase())
    .digest('hex')
    .slice(0, 12);
}

function buildDeliveryPayload(orderId, accessToken, settings) {
  const sig = computeOrderSignature(orderId, settings.adminPin);
  return {
    videoUrl: settings.videoUrl,
    videoTitle: settings.videoTitle,
    videoNotes: settings.videoNotes,
    downloads: {
      zip: `/api/download/${orderId}/zip?token=${accessToken}&sig=${sig}`,
      bat: `/api/download/${orderId}/bat?token=${accessToken}&sig=${sig}`,
      cleaner: `/api/download/${orderId}/cleaner?token=${accessToken}&sig=${sig}`,
      html: `/api/download/${orderId}/html?token=${accessToken}&sig=${sig}`,
      liveGuide: `/api/guide/${orderId}?token=${accessToken}&sig=${sig}`
    }
  };
}

function readJsonBody(req, maxBytes = 15 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    if (typeof req.body === 'string' && req.body.length > 0) {
      try {
        return resolve(JSON.parse(req.body));
      } catch (e) {}
    }
    let body = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      body += chunk.toString('utf8');
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  const data = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(data);
}

function sendWebhookNotifications(order, settings, hostUrl) {
  if (settings.discordWebhookUrl && settings.discordWebhookUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(settings.discordWebhookUrl);
      const payload = JSON.stringify({
        username: 'Tweak Lab Order Bot',
        embeds: [
          {
            title: `🚨 طلب شراء جديد #${order.id} (${order.amountEgp} ج.م)`,
            color: 65416,
            fields: [
              { name: '👤 العميل', value: order.customerName || 'غير محدد', inline: true },
              { name: '📱 رقم المحول / التواصل', value: order.senderPhone || 'غير محدد', inline: true },
              { name: '💳 طريقة الدفع', value: order.paymentMethod === 'instapay' ? 'InstaPay (إنستاباي)' : 'Vodafone Cash (فودافون كاش)', inline: true },
              { name: '💰 المبلغ المطلوب', value: `${order.amountEgp} ج.م`, inline: true },
              ...(order.discountCode ? [{ name: '🎟️ كود الخصم (صانع المحتوى)', value: `${order.discountCode}${order.isDiscountApplied ? ' (خصم 85 ج.م مُطبّق 🎉)' : ''}`, inline: true }] : []),
              { name: '⚡ رابط القبول الفوري (1-Click Accept)', value: `${hostUrl}/api/quick-action?id=${order.id}&action=approve&pin=${encodeURIComponent(settings.adminPin)}` },
              { name: '🖥️ لوحة التحكم', value: `${hostUrl}/admin` }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      });
      const req = https.request(
        {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
        },
        () => {}
      );
      req.on('error', () => {});
      req.write(payload);
      req.end();
    } catch (e) {}
  }

  if (settings.telegramBotToken && settings.telegramChatId) {
    try {
      const text =
        `🚨 *طلب جديد في TWEAK LAB (2027 FPS+)*\n\n` +
        `🆔 *رقم الطلب:* \`${order.id}\`\n` +
        `👤 *الاسم:* ${order.customerName}\n` +
        `📱 *رقم الموبايل:* \`${order.senderPhone}\`\n` +
        (order.discountCode ? `🎟️ *كود الخصم:* \`${order.discountCode}\`${order.isDiscountApplied ? ' (خصم 85 ج.م مفعل 🎉)' : ''}\n` : '') +
        `💳 *طريقة الدفع:* ${order.paymentMethod === 'instapay' ? 'InstaPay (إنستاباي)' : 'Vodafone Cash (فودافون كاش)'}\n` +
        `💰 *المبلغ:* ${order.amountEgp} جنيه مصري\n` +
        `📝 *ملاحظات:* ${order.notes || 'لا يوجد'}\n\n` +
        `⚡ [اضغط هنا لقبول وتفعيل الطلب فوراً](${hostUrl}/api/quick-action?id=${order.id}&action=approve&pin=${encodeURIComponent(settings.adminPin)})\n\n` +
        `🖥️ [فتح لوحة تحكم المتجر](${hostUrl}/admin)`;

      const payload = JSON.stringify({
        chat_id: settings.telegramChatId,
        text,
        parse_mode: 'Markdown'
      });

      const req = https.request(
        {
          hostname: 'api.telegram.org',
          path: `/bot${settings.telegramBotToken}/sendMessage`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
        },
        () => {}
      );
      req.on('error', () => {});
      req.write(payload);
      req.end();
    } catch (e) {}
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const PROTECTED_FILES = {
  zip: {
    filename: 'Best_Optimization_for_2027_FPS_Plus.zip',
    downloadName: 'Best_Optimization_for_2027_FPS_Plus.zip',
    mime: 'application/zip'
  },
  bat: {
    filename: 'best optimization for 2027 fps +.bat',
    downloadName: 'best optimization for 2027 fps +.bat',
    mime: 'application/octet-stream'
  },
  cleaner: {
    filename: 'Tweak_Lab_Cleaner_RAM_Optimizer.bat',
    downloadName: 'Tweak_Lab_Cleaner_RAM_Optimizer.bat',
    mime: 'application/octet-stream'
  },
  html: {
    filename: 'best optimization for 2027 fps +.html',
    downloadName: 'best optimization for 2027 fps +.html',
    mime: 'text/html; charset=utf-8'
  }
};

async function handleRequest(req, res) {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith('/api/')) {
      await syncFromCloudDb();
    }

    // 1. Public Config API
    if (req.method === 'GET' && pathname === '/api/config') {
      const s = loadSettings();
      return sendJson(res, 200, {
        brandName: s.brandName,
        productTitle: s.productTitle,
        priceEgp: s.priceEgp || 99,
        originalPriceEgp: s.originalPriceEgp || 350,
        discountedPriceEgp: s.discountedPriceEgp || 85,
        activePromoCodes: s.activePromoCodes || {},
        paymentPhone: s.paymentPhone,
        instapayAddress: s.instapayAddress,
        instapayLink: s.instapayLink,
        deliveryMinutes: s.deliveryMinutes
      });
    }

    // 2. Create New Order + Screenshot Upload
    if (req.method === 'POST' && pathname === '/api/orders') {
      const body = await readJsonBody(req);
      const { customerName, senderPhone, discountCode, paymentMethod, notes, screenshotDataUrl } = body;

      if (!customerName || !senderPhone || !screenshotDataUrl) {
        return sendJson(res, 400, { error: 'يرجى إدخال الاسم ورقم الموبايل ورفع صورة سكرين شوت التحويل.' });
      }

      const match = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i.exec(screenshotDataUrl);
      if (!match) {
        return sendJson(res, 400, { error: 'صيغة صورة السكرين شوت غير صحيحة. يرجى رفع صورة PNG أو JPG.' });
      }

      const orderId = 'TL-' + Math.floor(100000 + Math.random() * 900000);
      const accessToken = crypto.randomBytes(16).toString('hex');
      const settings = loadSettings();

      // Check if discount code matches active authorized promo code
      const codeKey = String(discountCode || '').trim().toUpperCase();
      let finalAmount = Number(settings.priceEgp || 99);
      let isDiscountApplied = false;

      if (settings.activePromoCodes && typeof settings.activePromoCodes === 'object' && settings.activePromoCodes[codeKey]) {
        finalAmount = Number(settings.activePromoCodes[codeKey]);
        isDiscountApplied = true;
      }

      const newOrder = {
        id: orderId,
        accessToken,
        customerName: String(customerName).trim().slice(0, 80),
        senderPhone: String(senderPhone).trim().slice(0, 40),
        discountCode: String(discountCode || '').trim().slice(0, 60),
        isDiscountApplied,
        paymentMethod: paymentMethod === 'vodafone' ? 'vodafone' : 'instapay',
        amountEgp: finalAmount,
        notes: String(notes || '').trim().slice(0, 300),
        screenshotUrl: screenshotDataUrl, // Stored inline as Data URL so it works 100% across serverless & local!
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orders = loadOrders();
      orders.unshift(newOrder);
      if (orders.length > 5000) orders.length = 5000;
      await saveOrders(orders);

      const defaultAppUrl = settings.appUrl || 'https://tweak-lab-a177.vercel.app';
      let hostUrl = defaultAppUrl;
      if (req.headers && req.headers.host) {
        const proto = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host;
        hostUrl = (!host.includes('localhost') && !host.includes('127.0.0.1')) ? `${proto}://${host}` : defaultAppUrl;
      }
      sendWebhookNotifications(newOrder, settings, hostUrl);

      return sendJson(res, 201, {
        ok: true,
        order: {
          id: newOrder.id,
          accessToken: newOrder.accessToken,
          status: newOrder.status,
          createdAt: newOrder.createdAt,
          deliveryMinutes: settings.deliveryMinutes,
          quickApproveWhatsappText:
            `مرحباً Tweak Lab ⚡\n` +
            `قمت بدفع ${newOrder.amountEgp} ج.م عبر (${newOrder.paymentMethod === 'instapay' ? 'InstaPay' : 'Vodafone Cash'})\n` +
            `رقم الطلب: ${newOrder.id}\n` +
            `الاسم: ${newOrder.customerName}\n` +
            `الرقم المحول منه: ${newOrder.senderPhone}\n` +
            (newOrder.discountCode ? `كود الخصم: ${newOrder.discountCode}${newOrder.isDiscountApplied ? ' (خصم 85 ج.م مفعل 🎉)' : ''}\n` : '') +
            `برجاء قبول الطلب لتفعيل التحميل!`
        }
      });
    }

    // 3. Poll Order Status
    if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      const orderId = pathname.replace('/api/orders/', '').trim();
      const token = parsedUrl.searchParams.get('token') || '';
      const sig = parsedUrl.searchParams.get('sig') || '';
      const settings = loadSettings();
      const expectedSig = computeOrderSignature(orderId, settings.adminPin);

      const orders = loadOrders();
      const order = orders.find((o) => o.id === orderId && o.accessToken === token);

      // Also allow stateless unlock via signature if approved via direct link
      if (sig && sig === expectedSig) {
        return sendJson(res, 200, {
          id: orderId,
          status: 'approved',
          delivery: buildDeliveryPayload(orderId, token || 'direct', settings)
        });
      }

      if (!order) {
        return sendJson(res, 404, { error: 'لم يتم العثور على الطلب.' });
      }

      const responseData = {
        id: order.id,
        customerName: order.customerName,
        discountCode: order.discountCode || '',
        paymentMethod: order.paymentMethod,
        amountEgp: order.amountEgp,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };

      if (order.status === 'approved') {
        responseData.delivery = buildDeliveryPayload(order.id, order.accessToken, settings);
      }

      return sendJson(res, 200, responseData);
    }

    // 4. Protected Product File Download
    if (req.method === 'GET' && pathname.startsWith('/api/download/')) {
      const parts = pathname.replace('/api/download/', '').split('/');
      const [orderId, fileKey] = parts;
      const token = parsedUrl.searchParams.get('token') || '';
      const sig = parsedUrl.searchParams.get('sig') || '';
      const settings = loadSettings();
      const expectedSig = computeOrderSignature(orderId, settings.adminPin);

      const orders = loadOrders();
      const order = orders.find((o) => o.id === orderId && o.accessToken === token);
      const isAuthorized = (order && order.status === 'approved') || (sig && sig === expectedSig);

      if (!isAuthorized) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('⛔ غير مسموح بالتحميل قبل تأكيد وقبول عملية الدفع من الإدارة.');
      }

      const fileInfo = PROTECTED_FILES[fileKey];
      if (!fileInfo) {
        res.writeHead(404);
        return res.end('File not found');
      }

      const fileBuf = getProtectedFileBuffer(fileInfo.filename);
      if (!fileBuf) {
        res.writeHead(404);
        return res.end('File missing on server');
      }

      res.writeHead(200, {
        'Content-Type': fileInfo.mime,
        'Content-Length': fileBuf.length,
        'Content-Disposition': `attachment; filename="${fileInfo.downloadName}"`
      });
      return res.end(fileBuf);
    }

    // 5. Protected Live Interactive HTML Guide View
    if (req.method === 'GET' && pathname.startsWith('/api/guide/')) {
      const orderId = pathname.replace('/api/guide/', '').trim();
      const token = parsedUrl.searchParams.get('token') || '';
      const sig = parsedUrl.searchParams.get('sig') || '';
      const settings = loadSettings();
      const expectedSig = computeOrderSignature(orderId, settings.adminPin);

      const orders = loadOrders();
      const order = orders.find((o) => o.id === orderId && o.accessToken === token);
      const isAuthorized = (order && order.status === 'approved') || (sig && sig === expectedSig);

      if (!isAuthorized) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('⛔ غير مسموح بفتح الدليل قبل قبول الطلب.');
      }

      const htmlBuf = getProtectedFileBuffer('best optimization for 2027 fps +.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(htmlBuf || '');
    }

    // 6. Quick 1-Click Link Approval
    if (req.method === 'GET' && pathname === '/api/quick-action') {
      const id = parsedUrl.searchParams.get('id');
      const action = parsedUrl.searchParams.get('action');
      const pin = parsedUrl.searchParams.get('pin');
      const settings = loadSettings();

      if (pin !== settings.adminPin) {
        res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h2>❌ رمز الحماية غير صحيح</h2>');
      }

      const orders = loadOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx].status = action === 'approve' ? 'approved' : 'rejected';
        orders[idx].updatedAt = new Date().toISOString();
        await saveOrders(orders);
      }

      const sig = computeOrderSignature(id, settings.adminPin);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html><html lang="ar" dir="rtl"><body style="background:#070a10;color:#00ff88;font-family:sans-serif;text-align:center;padding:60px;">
        <h1>${action === 'approve' ? '✅ تم قبول الطلب وتفعيل التحميل للعميل فوراً!' : '❌ تم رفض الطلب'}</h1>
        <p style="color:#fff;font-size:18px;">رقم الطلب: ${id}</p>
        <p style="color:#8b9bb4;font-size:14px;">رابط التحميل المباشر للعميل (في حال أردت إرساله له على واتساب):<br/>
        <code style="color:#00f0ff;">/?order=${id}&token=direct&sig=${sig}</code></p>
        <a href="/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#00f0ff;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">العودة للوحة التحكم</a>
        </body></html>
      `);
    }

    // 7. Admin API: List Orders & Settings
    if (req.method === 'GET' && pathname === '/api/admin/data') {
      const pin = req.headers['x-admin-pin'] || parsedUrl.searchParams.get('pin') || '';
      const settings = loadSettings();
      if (pin !== settings.adminPin) {
        return sendJson(res, 401, { error: 'كلمة مرور لوحة التحكم غير صحيحة' });
      }
      return sendJson(res, 200, {
        orders: loadOrders(),
        settings
      });
    }

    // 8. Admin API: Approve / Reject / Delete Order
    if (req.method === 'POST' && pathname === '/api/admin/order-action') {
      const pin = req.headers['x-admin-pin'] || '';
      const settings = loadSettings();
      if (pin !== settings.adminPin) {
        return sendJson(res, 401, { error: 'غير مصرح' });
      }
      const { orderId, action } = await readJsonBody(req);
      const orders = loadOrders();
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx === -1) return sendJson(res, 404, { error: 'الطلب غير موجود' });

      if (action === 'delete') {
        orders.splice(idx, 1);
      } else if (action === 'approve' || action === 'reject' || action === 'pending') {
        orders[idx].status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';
        orders[idx].updatedAt = new Date().toISOString();
      }
      await saveOrders(orders);
      return sendJson(res, 200, { ok: true, orders });
    }

    // 9. Admin API: Update Settings
    if (req.method === 'POST' && pathname === '/api/admin/settings') {
      const pin = req.headers['x-admin-pin'] || '';
      const settings = loadSettings();
      if (pin !== settings.adminPin) {
        return sendJson(res, 401, { error: 'غير مصرح' });
      }
      const body = await readJsonBody(req);
      const updated = await saveSettings(body);
      return sendJson(res, 200, { ok: true, settings: updated });
    }

    // 10. Page Routes
    if (req.method === 'GET' && (pathname === '/admin' || pathname === '/admin/')) {
      const adminHtml = path.join(PUBLIC_DIR, 'admin.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(adminHtml).pipe(res);
    }

    let safePath = path.normalize(pathname === '/' ? '/index.html' : pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      return fs.createReadStream(filePath).pipe(res);
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(PUBLIC_DIR, 'index.html')).pipe(res);
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: 'حدث خطأ داخلي في الخادم: ' + err.message });
  }
}

if (require.main === module) {
  const server = http.createServer(handleRequest);
  server.listen(PORT, () => {
    console.log('========================================================================');
    console.log(`  ⚡ TWEAK LAB - 2027 FPS+ STORE RUNNING ON: http://localhost:${PORT}`);
    console.log(`  🛒 Customer Checkout Page : http://localhost:${PORT}/`);
    console.log(`  🛡️ Seller Admin Dashboard : http://localhost:${PORT}/admin  (PIN: 2027)`);
    console.log('========================================================================');
  });
}

module.exports = handleRequest;
