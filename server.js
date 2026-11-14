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
const TIME_BOMB_MINUTES = 60;
const TIME_BOMB_MS = TIME_BOMB_MINUTES * 60 * 1000;
const IS_VERCEL = !!process.env.VERCEL;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PROTECTED_DIR = path.join(ROOT_DIR, 'protected_product');
const DATA_DIR = IS_VERCEL ? '/tmp/tweaklab_data' : path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const SEED_ORDERS_FILE = path.join(ROOT_DIR, 'seed_orders.json');
const DELETED_ORDERS_FILE = path.join(DATA_DIR, 'deleted_orders.json');
const SEED_DELETED_ORDERS_FILE = path.join(ROOT_DIR, 'seed_deleted_orders.json');

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
  activePromoCodes: {},
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
global.__TWEAKLAB_DELETED_ORDERS__ = global.__TWEAKLAB_DELETED_ORDERS__ || null;
global.__TWEAKLAB_LAST_SYNC__ = global.__TWEAKLAB_LAST_SYNC__ || 0;

function loadDeletedOrderIds() {
  if (global.__TWEAKLAB_DELETED_ORDERS__ instanceof Set) {
    return global.__TWEAKLAB_DELETED_ORDERS__;
  }
  const set = new Set();
  try {
    if (fs.existsSync(DELETED_ORDERS_FILE)) {
      const arr = JSON.parse(fs.readFileSync(DELETED_ORDERS_FILE, 'utf8'));
      if (Array.isArray(arr)) arr.forEach((id) => set.add(String(id).trim().toUpperCase()));
    }
  } catch (e) {}
  try {
    if (fs.existsSync(SEED_DELETED_ORDERS_FILE)) {
      const arr = JSON.parse(fs.readFileSync(SEED_DELETED_ORDERS_FILE, 'utf8'));
      if (Array.isArray(arr)) arr.forEach((id) => set.add(String(id).trim().toUpperCase()));
    }
  } catch (e) {}
  global.__TWEAKLAB_DELETED_ORDERS__ = set;
  return set;
}

async function saveDeletedOrderIds(setOrArray) {
  const arr = Array.from(setOrArray || []).map((id) => String(id).trim().toUpperCase());
  const set = new Set(arr);
  global.__TWEAKLAB_DELETED_ORDERS__ = set;
  try {
    fs.writeFileSync(DELETED_ORDERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(SEED_DELETED_ORDERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
  const blobSdk = getBlobSdk();
  if (blobSdk && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await blobSdk.put('tweaklab_db/deleted_orders.json', JSON.stringify(arr), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });
    } catch (e) {
      console.error('Cloud deleted orders save error:', e.message);
    }
  }
  return set;
}

const CORE_BASELINE_ORDERS = [];

function mergeOrderLists(...lists) {
  const deletedIds = loadDeletedOrderIds();
  const map = new Map();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const raw of list) {
      if (!raw || !raw.id) continue;
      const id = String(raw.id).trim().toUpperCase();
      if (deletedIds.has(id)) continue;
      const item = { ...raw, id };
      if (!map.has(id)) {
        map.set(id, item);
      } else {
        const existing = map.get(id);
        const tExisting = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
        const tItem = new Date(item.updatedAt || item.createdAt || 0).getTime();
        const preferredStatus = tItem >= tExisting ? (item.status || existing.status) : existing.status;
        map.set(id, {
          ...existing,
          ...item,
          status: preferredStatus,
          updatedAt: Math.max(tExisting, tItem) ? new Date(Math.max(tExisting, tItem)).toISOString() : new Date().toISOString()
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const tA = new Date(a.createdAt || 0).getTime();
    const tB = new Date(b.createdAt || 0).getTime();
    return tB - tA;
  });
}

function loadLocalDiskOrders() {
  const deletedIds = loadDeletedOrderIds();
  let diskOrders = [];
  let seedOrders = [];
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      if (Array.isArray(parsed)) diskOrders = parsed.filter((o) => !deletedIds.has(String(o.id).trim().toUpperCase()));
    }
  } catch (e) {}
  try {
    if (fs.existsSync(SEED_ORDERS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SEED_ORDERS_FILE, 'utf8'));
      if (Array.isArray(parsed)) seedOrders = parsed.filter((o) => !deletedIds.has(String(o.id).trim().toUpperCase()));
    }
  } catch (e) {}
  const baseline = CORE_BASELINE_ORDERS.filter((o) => !deletedIds.has(String(o.id).trim().toUpperCase()));
  return mergeOrderLists(baseline, seedOrders, diskOrders);
}

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
  if (!blobSdk || !process.env.BLOB_READ_WRITE_TOKEN) {
    global.__TWEAKLAB_ORDERS__ = mergeOrderLists(loadLocalDiskOrders(), global.__TWEAKLAB_ORDERS__ || []);
    return;
  }
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

    // Sync deleted orders from Cloud Blob
    try {
      const delBlob = blobs.find((b) => b.pathname === 'tweaklab_db/deleted_orders.json');
      if (delBlob) {
        const r = await fetch(delBlob.url + '?t=' + now, { cache: 'no-store' });
        if (r.ok) {
          const arr = await r.json();
          if (Array.isArray(arr)) {
            const currentDeleted = loadDeletedOrderIds();
            arr.forEach((id) => currentDeleted.add(String(id).trim().toUpperCase()));
            await saveDeletedOrderIds(currentDeleted);
          }
        }
      }
    } catch (e) {
      console.error('Cloud deleted orders sync warning:', e.message);
    }

    let cloudOrders = [];
    if (orderBlobs.length > 0) {
      try {
        const r = await fetch(orderBlobs[0].url + '?t=' + now, { cache: 'no-store' });
        if (r.ok) {
          const parsed = await r.json();
          if (Array.isArray(parsed)) cloudOrders = parsed;
        }
      } catch (e) {
        console.error('Failed reading order blob:', e.message);
      }
    }

    const localMaster = loadLocalDiskOrders();
    const masterOrders = mergeOrderLists(localMaster, global.__TWEAKLAB_ORDERS__ || [], cloudOrders);
    global.__TWEAKLAB_ORDERS__ = masterOrders;

    if (masterOrders.length > cloudOrders.length || orderBlobs.length === 0) {
      await saveOrders(masterOrders);
    } else {
      try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(masterOrders, null, 2), 'utf8');
      } catch (e) {}
    }

    if (settingBlobs.length > 0) {
      const r = await fetch(settingBlobs[0].url + '?t=' + now, { cache: 'no-store' });
      if (r.ok) {
        const raw = await r.json();
        const merged = { ...DEFAULT_SETTINGS, ...raw };
        let needSave = false;
        if (!merged.activePromoCodes || typeof merged.activePromoCodes !== 'object') {
          merged.activePromoCodes = {};
          needSave = true;
        }
        if (merged.activePromoCodes && merged.activePromoCodes['TWEAK85']) {
          delete merged.activePromoCodes['TWEAK85'];
          needSave = true;
        }
        global.__TWEAKLAB_SETTINGS__ = merged;
        if (needSave) {
          saveSettings(merged).catch(() => {});
        }
      }
    }
    global.__TWEAKLAB_LAST_SYNC__ = Date.now();
  } catch (err) {
    console.error('Cloud DB sync warning:', err.message);
    global.__TWEAKLAB_ORDERS__ = mergeOrderLists(loadLocalDiskOrders(), global.__TWEAKLAB_ORDERS__ || []);
  }
}

function loadSettings() {
  if (global.__TWEAKLAB_SETTINGS__) {
    if (!global.__TWEAKLAB_SETTINGS__.activePromoCodes || typeof global.__TWEAKLAB_SETTINGS__.activePromoCodes !== 'object') {
      global.__TWEAKLAB_SETTINGS__.activePromoCodes = {};
    }
    if (global.__TWEAKLAB_SETTINGS__.activePromoCodes && global.__TWEAKLAB_SETTINGS__.activePromoCodes['TWEAK85']) {
      delete global.__TWEAKLAB_SETTINGS__.activePromoCodes['TWEAK85'];
    }
    return global.__TWEAKLAB_SETTINGS__;
  }
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      const merged = { ...DEFAULT_SETTINGS, ...raw };
      if (!merged.activePromoCodes || typeof merged.activePromoCodes !== 'object') {
        merged.activePromoCodes = {};
      }
      if (merged.activePromoCodes && merged.activePromoCodes['TWEAK85']) {
        delete merged.activePromoCodes['TWEAK85'];
      }
      global.__TWEAKLAB_SETTINGS__ = merged;
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
  const local = loadLocalDiskOrders();
  const merged = mergeOrderLists(local, global.__TWEAKLAB_ORDERS__ || []);
  global.__TWEAKLAB_ORDERS__ = merged;
  return merged;
}

async function saveOrders(orders) {
  const deletedIds = loadDeletedOrderIds();
  const cleanIncoming = (orders || []).filter((o) => !deletedIds.has(String(o.id).trim().toUpperCase()));
  global.__TWEAKLAB_ORDERS__ = cleanIncoming;
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(cleanIncoming, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(SEED_ORDERS_FILE, JSON.stringify(cleanIncoming, null, 2), 'utf8');
  } catch (e) {}
  const blobSdk = getBlobSdk();
  if (blobSdk && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const key = `tweaklab_db/orders_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.json`;
      await blobSdk.put(key, JSON.stringify(cleanIncoming), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json'
      });
      global.__TWEAKLAB_LAST_SYNC__ = Date.now();
      const { blobs } = await blobSdk.list({ prefix: 'tweaklab_db/orders_' });
      const sorted = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
      if (sorted.length > 5) {
        await blobSdk.del(sorted.slice(5).map((b) => b.url));
      }
    } catch (e) {
      console.error('Cloud orders save error:', e.message);
    }
  }
  return cleanIncoming;
}

function computeOrderSignature(orderId, pin) {
  return crypto
    .createHmac('sha256', 'tweaklab-secret-' + String(pin || '2027'))
    .update(String(orderId).trim().toUpperCase())
    .digest('hex')
    .slice(0, 12);
}

function buildDeliveryPayload(orderId, accessToken, settings, timeBombInfo = null) {
  const sig = computeOrderSignature(orderId, settings.adminPin);
  return {
    videoUrl: settings.videoUrl,
    videoTitle: settings.videoTitle,
    videoNotes: settings.videoNotes,
    timeBomb: timeBombInfo,
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

function escapeTelegramHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function postHttpsJson(hostname, pathUrl, payloadObj, timeoutMs = 4500) {
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify(payloadObj);
      const req = https.request(
        {
          hostname,
          path: pathUrl,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          timeout: timeoutMs
        },
        (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, body }));
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'timeout' });
      });
      req.on('error', (err) => resolve({ ok: false, error: err.message }));
      req.write(payload);
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

async function sendWebhookNotifications(order, settings, hostUrl) {
  const basePrice = Number(order.basePriceEgp || settings.priceEgp || 99);
  const paidAmount = Number(order.amountEgp || basePrice);
  const pkgName = order.packageName || 'Best Optimization for 2027 FPS+ (النسخة الكاملة Pro)';
  const payMethodLabel = order.paymentMethod === 'instapay' ? 'InstaPay (إنستاباي)' : 'Vodafone Cash (فودافون كاش)';
  const rawCode = String(order.discountCode || '').trim();

  let codeStatusPlain = '❌ لا يوجد (لم يُدخل كود خصم أو كود صانع محتوى)';
  let codeStatusHtml = '❌ <b>لا يوجد</b> (لم يُدخل كود خصم أو كود صانع محتوى)';
  if (rawCode) {
    if (order.isDiscountApplied) {
      const saved = Math.max(0, basePrice - paidAmount);
      codeStatusPlain = `🔥 نعم — كود خصم مفعّل (${rawCode.toUpperCase()}) • تم تطبيق الخصم ودفع ${paidAmount} ج.م بدلاً من ${basePrice} ج.م`;
      codeStatusHtml = `🔥 <b>نعم — كود خصم مفعّل:</b> <code>${escapeTelegramHtml(rawCode.toUpperCase())}</code> (خصم ${saved} ج.م مطبّق • دفع <b>${paidAmount} ج.م</b> بدلاً من ${basePrice} ج.م)`;
    } else {
      codeStatusPlain = `👤 نعم — كود صانع محتوى (${rawCode.toUpperCase()}) • تتبع لصانع المحتوى بدون خصم (دفع ${paidAmount} ج.م)`;
      codeStatusHtml = `👤 <b>نعم — كود صانع محتوى:</b> <code>${escapeTelegramHtml(rawCode.toUpperCase())}</code> (تتبع لصانع المحتوى فقط • بدون خصم، دفع <b>${paidAmount} ج.م</b>)`;
    }
  }

  let paidAmountDetailHtml = `<b>${paidAmount} ج.م</b>`;
  if (order.isDiscountApplied && paidAmount < basePrice) {
    paidAmountDetailHtml = `<b>${paidAmount} ج.م</b> (بسعر الخصم بدلاً من ${basePrice} ج.م 🎉)`;
  } else {
    paidAmountDetailHtml = `<b>${paidAmount} ج.م</b> (السعر الأساسي المعتمد)`;
  }

  const tasks = [];

  if (settings.discordWebhookUrl && settings.discordWebhookUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(settings.discordWebhookUrl);
      tasks.push(
        postHttpsJson(urlObj.hostname, urlObj.pathname + urlObj.search, {
          username: 'Tweak Lab Order Bot',
          embeds: [
            {
              title: `🚨 طلب شراء جديد #${order.id} — دفع ${paidAmount} ج.م`,
              color: 65416,
              fields: [
                { name: '👤 اسم العميل', value: order.customerName || 'غير محدد', inline: true },
                { name: '📱 رقم الموبايل المحول منه', value: order.senderPhone || 'غير محدد', inline: true },
                { name: '📦 الباقة المختارة', value: pkgName, inline: false },
                { name: '💳 طريقة الدفع', value: payMethodLabel, inline: true },
                { name: '💰 المبلغ المدفوع بالضبط', value: `${paidAmount} ج.م`, inline: true },
                { name: '🎟️ كود الخصم / صانع المحتوى', value: codeStatusPlain, inline: false },
                { name: '🖥️ لوحة التحكم (القبول/الرفض اليدوي)', value: `${hostUrl}/admin` }
              ],
              timestamp: new Date().toISOString()
            }
          ]
        })
      );
    } catch (e) {}
  }

  if (settings.telegramBotToken && settings.telegramChatId) {
    const htmlText =
      `🚨 <b>طلب شراء جديد في TWEAK LAB ⚡</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🆔 <b>رقم الطلب:</b> <code>#${escapeTelegramHtml(order.id)}</code>\n` +
      `👤 <b>اسم العميل:</b> ${escapeTelegramHtml(order.customerName)}\n` +
      `📱 <b>رقم التليفون المحول منه:</b> <code>${escapeTelegramHtml(order.senderPhone)}</code>\n` +
      `📦 <b>الباقة المختارة:</b> ${escapeTelegramHtml(pkgName)}\n` +
      `💳 <b>طريقة الدفع:</b> ${escapeTelegramHtml(payMethodLabel)}\n` +
      `💰 <b>المبلغ المدفوع بالضبط:</b> ${paidAmountDetailHtml}\n` +
      `🎟️ <b>كود صانع المحتوى / الخصم:</b> ${codeStatusHtml}\n` +
      `📝 <b>ملاحظات العميل:</b> ${escapeTelegramHtml(order.notes || 'لا يوجد')}\n` +
      `⏱️ <b>حماية الرابط (Time-Bomb):</b> ساعة كاملة (60 دقيقة) من أول فتح\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⚠️ <b>الطلب الآن قيد المراجعة (Pending) بانتظار قبولك اليدوي:</b>\n` +
      `🖥️ <a href="${escapeTelegramHtml(hostUrl)}/admin">فتح لوحة تحكم الأدمن لمراجعة الإيصال والقبول (/admin)</a>`;

    tasks.push(
      postHttpsJson('api.telegram.org', `/bot${settings.telegramBotToken}/sendMessage`, {
        chat_id: settings.telegramChatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    );
  }

  await Promise.allSettled(tasks);
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
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
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
        priceEgp: Number(s.priceEgp) || 99,
        originalPriceEgp: s.originalPriceEgp || 350,
        discountedPriceEgp: s.discountedPriceEgp || 85,
        activePromoCodes: (s.activePromoCodes && typeof s.activePromoCodes === 'object') ? s.activePromoCodes : {},
        paymentPhone: s.paymentPhone,
        instapayAddress: s.instapayAddress,
        instapayLink: s.instapayLink,
        deliveryMinutes: s.deliveryMinutes
      });
    }

    // 2. Create New Order + Screenshot Upload
    if (req.method === 'POST' && pathname === '/api/orders') {
      const body = await readJsonBody(req);
      const { customerName, senderPhone, discountCode, paymentMethod, notes, screenshotDataUrl, paidAmountEgp, packageName } = body;

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

      // Determine exact charged/paid amount based on active promo code or configured price
      const codeKey = String(discountCode || '').trim().toUpperCase();
      const basePrice = Number(settings.priceEgp) || 99;
      let finalAmount = basePrice;
      let isDiscountApplied = false;

      if (codeKey && settings.activePromoCodes && typeof settings.activePromoCodes === 'object' && settings.activePromoCodes[codeKey]) {
        finalAmount = Number(settings.activePromoCodes[codeKey]);
        isDiscountApplied = true;
      } else if (paidAmountEgp !== undefined && Number(paidAmountEgp) > 0 && Number(paidAmountEgp) === basePrice) {
        finalAmount = Number(paidAmountEgp);
      }

      const newOrder = {
        id: orderId,
        accessToken,
        customerName: String(customerName).trim().slice(0, 80),
        senderPhone: String(senderPhone).trim().slice(0, 40),
        packageName: String(packageName || 'Best Optimization for 2027 FPS+ (النسخة الكاملة Pro)').trim().slice(0, 120),
        discountCode: String(discountCode || '').trim().slice(0, 60),
        isDiscountApplied,
        isCreatorCode: Boolean(codeKey && !isDiscountApplied),
        paymentMethod: paymentMethod === 'vodafone' ? 'vodafone' : 'instapay',
        basePriceEgp: basePrice,
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
      await sendWebhookNotifications(newOrder, settings, hostUrl);

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
            `الباقة: ${newOrder.packageName}\n` +
            `رقم الطلب: ${newOrder.id}\n` +
            `الاسم: ${newOrder.customerName}\n` +
            `الرقم المحول منه: ${newOrder.senderPhone}\n` +
            (newOrder.discountCode
              ? `كود صانع المحتوى / الخصم: ${newOrder.discountCode}${newOrder.isDiscountApplied ? ` (خصم مفعل • دفع ${newOrder.amountEgp} ج.م 🎉)` : ' (كود صانع محتوى 👤)'}\n`
              : '') +
            `برجاء قبول الطلب لتفعيل التحميل!`
        }
      });
    }

    // 3. Poll Order Status
    if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      const orderId = pathname.replace('/api/orders/', '').trim();
      const token = parsedUrl.searchParams.get('token') || '';
      const settings = loadSettings();

      const orders = loadOrders();
      const order = orders.find((o) => o.id === orderId && o.accessToken === token);

      if (!order) {
        return sendJson(res, 404, { error: 'لم يتم العثور على الطلب.' });
      }

      // ONLY if admin manually clicked Accept in /admin will order.status be 'approved'
      if (order.status === 'approved' || order.status === 'expired') {
        const now = Date.now();
        const isExpired = order.isBurned || (order.accessExpiresAt && now > new Date(order.accessExpiresAt).getTime());

        if (isExpired) {
          if (!order.isBurned || order.status !== 'expired') {
            order.isBurned = true;
            order.status = 'expired';
            order.updatedAt = new Date().toISOString();
            await saveOrders(orders);
          }
          return sendJson(res, 410, {
            id: order.id,
            status: 'expired',
            isBurned: true,
            error: 'Link Expired',
            message: 'انتهت صلاحية هذا الرابط وتم إتلافه لحماية الملفات من التسريب.'
          });
        }

        // First time customer accesses the approved order: start the 1-hour (60-minute) countdown!
        if (!order.firstAccessedAt) {
          order.firstAccessedAt = new Date(now).toISOString();
          order.accessExpiresAt = new Date(now + TIME_BOMB_MS).toISOString();
          order.isBurned = false;
          order.updatedAt = new Date().toISOString();
          await saveOrders(orders);
        }

        const remainingSeconds = Math.max(0, Math.floor((new Date(order.accessExpiresAt).getTime() - now) / 1000));
        const timeBombInfo = {
          firstAccessedAt: order.firstAccessedAt,
          expiresAt: order.accessExpiresAt,
          remainingSeconds,
          isBurned: false
        };

        const responseData = {
          id: order.id,
          customerName: order.customerName,
          discountCode: order.discountCode || '',
          paymentMethod: order.paymentMethod,
          amountEgp: order.amountEgp,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          timeBomb: timeBombInfo,
          delivery: buildDeliveryPayload(order.id, order.accessToken, settings, timeBombInfo)
        };
        return sendJson(res, 200, responseData);
      }

      // Order is still pending (awaiting manual admin accept) or rejected: NEVER send delivery details!
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

      return sendJson(res, 200, responseData);
    }

    // 4. Protected Product File Download
    if (req.method === 'GET' && pathname.startsWith('/api/download/')) {
      const parts = pathname.replace('/api/download/', '').split('/');
      const [orderId, fileKey] = parts;
      const token = parsedUrl.searchParams.get('token') || '';

      const orders = loadOrders();
      const order = orders.find((o) => o.id === orderId && o.accessToken === token);
      const isAuthorized = order && order.status === 'approved';

      if (!isAuthorized) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('⛔ غير مسموح بالتحميل قبل تأكيد وقبول عملية الدفع يدوياً من الإدارة.');
      }

      // Time-Bomb Expiration Check for Downloads
      const now = Date.now();
      const isBurnedOrExpired = order && (order.isBurned || (order.accessExpiresAt && now > new Date(order.accessExpiresAt).getTime()));
      if (isBurnedOrExpired) {
        if (!order.isBurned || order.status !== 'expired') {
          order.isBurned = true;
          order.status = 'expired';
          order.updatedAt = new Date().toISOString();
          await saveOrders(orders);
        }
        res.writeHead(410, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
          <!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Link Expired | TWEAK LAB</title>
          <style>body{background:#070a10;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:50px 20px;}
          .box{max-width:540px;margin:0 auto;background:#0e1420;border:1px solid #ff4757;border-radius:16px;padding:32px;box-shadow:0 0 30px rgba(255,71,87,0.3);}
          h1{color:#ff4757;font-size:1.8rem;margin:12px 0;}p{color:#8b9bb4;line-height:1.7;font-size:1rem;margin-bottom:20px;}
          .btn-wa{display:inline-block;padding:12px 24px;background:#25d366;color:#000;text-decoration:none;font-weight:800;border-radius:8px;}
          </style></head><body><div class="box"><div style="font-size:3.5rem;">💣</div>
          <h1>انتهت صلاحية الرابط (Link Expired)</h1>
          <p>تم إتلاف هذا الرابط تلقائياً بنظام Time-Bomb بعد مرور ساعة واحدة (60 دقيقة) لحماية ملفات Tweak Lab من النسخ والتداول غير المصرح به.</p>
          <p style="color:#fff;">رقم طلبك: <strong style="color:#00f0ff;">#${orderId}</strong></p>
          <a class="btn-wa" href="https://wa.me/201021464317?text=${encodeURIComponent('مرحباً Tweak Lab، رقم طلبي هو ' + orderId + ' وانتهت مهلة الساعة (60 دقيقة)، برجاء إعادة تفعيل الرابط.')}" target="_blank">تواصل مع الدعم الفني عبر واتساب</a>
          </div></body></html>
        `);
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

      const orders = loadOrders();
      const order = orders.find((o) => o.id === orderId && o.accessToken === token);
      const isAuthorized = order && order.status === 'approved';

      if (!isAuthorized) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('⛔ غير مسموح بفتح الدليل قبل قبول وتأكيد الطلب يدوياً من الإدارة.');
      }

      // Time-Bomb Expiration Check for Interactive Guide
      const now = Date.now();
      const isBurnedOrExpired = order && (order.isBurned || (order.accessExpiresAt && now > new Date(order.accessExpiresAt).getTime()));
      if (isBurnedOrExpired) {
        if (!order.isBurned || order.status !== 'expired') {
          order.isBurned = true;
          order.status = 'expired';
          order.updatedAt = new Date().toISOString();
          await saveOrders(orders);
        }
        res.writeHead(410, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`
          <!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Link Expired | TWEAK LAB</title>
          <style>body{background:#070a10;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:50px 20px;}
          .box{max-width:540px;margin:0 auto;background:#0e1420;border:1px solid #ff4757;border-radius:16px;padding:32px;box-shadow:0 0 30px rgba(255,71,87,0.3);}
          h1{color:#ff4757;font-size:1.8rem;margin:12px 0;}p{color:#8b9bb4;line-height:1.7;font-size:1rem;margin-bottom:20px;}
          .btn-wa{display:inline-block;padding:12px 24px;background:#25d366;color:#000;text-decoration:none;font-weight:800;border-radius:8px;}
          </style></head><body><div class="box"><div style="font-size:3.5rem;">💣</div>
          <h1>انتهت صلاحية الرابط (Link Expired)</h1>
          <p>تم إتلاف هذا الرابط تلقائياً بنظام Time-Bomb بعد مرور ساعة واحدة (60 دقيقة) لحماية ملفات Tweak Lab من النسخ والتداول غير المصرح به.</p>
          <p style="color:#fff;">رقم طلبك: <strong style="color:#00f0ff;">#${orderId}</strong></p>
          <a class="btn-wa" href="https://wa.me/201021464317?text=${encodeURIComponent('مرحباً Tweak Lab، رقم طلبي هو ' + orderId + ' وانتهت مهلة الساعة (60 دقيقة)، برجاء إعادة تفعيل الرابط.')}" target="_blank">تواصل مع الدعم الفني عبر واتساب</a>
          </div></body></html>
        `);
      }

      const htmlBuf = getProtectedFileBuffer('best optimization for 2027 fps +.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(htmlBuf || '');
    }

    // 6. Quick Action Notice (Directs to /admin for secure manual approval)
    if (req.method === 'GET' && pathname === '/api/quick-action') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>لوحة التحكم | TWEAK LAB</title></head>
        <body style="background:#070a10;color:#00f0ff;font-family:system-ui,sans-serif;text-align:center;padding:60px 20px;">
        <div style="max-width:550px;margin:0 auto;background:#0e1420;border:1px solid #1e2c46;padding:32px;border-radius:16px;">
          <h2 style="color:#00ff88;margin-bottom:12px;">🔒 نظام الأمان: القبول اليدوي الإلزامي</h2>
          <p style="color:#8b9bb4;font-size:15px;line-height:1.7;margin-bottom:24px;">
            لحماية المتجر والتأكد من صحة إيصال الدفع، يجب مراجعة صورة السكرين شوت والضغط على Accept يدوياً من داخل لوحة التحكم.
          </p>
          <a href="/admin" style="display:inline-block;padding:12px 28px;background:linear-gradient(90deg,#00f0ff,#00ff88);color:#000;text-decoration:none;border-radius:8px;font-weight:900;font-size:16px;">
            الانتقال للوحة التحكم الآن (/admin)
          </a>
        </div>
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

      if (action === 'delete') {
        const deletedIds = loadDeletedOrderIds();
        deletedIds.add(String(orderId).trim().toUpperCase());
        await saveDeletedOrderIds(deletedIds);
        if (idx !== -1) {
          orders.splice(idx, 1);
        }
        const remaining = orders.filter((o) => !deletedIds.has(String(o.id).trim().toUpperCase()));
        const updatedOrders = await saveOrders(remaining);
        return sendJson(res, 200, { ok: true, orders: updatedOrders });
      }

      if (idx === -1) return sendJson(res, 404, { error: 'الطلب غير موجود' });

      if (action === 'reset-timer') {
        const now = Date.now();
        orders[idx].firstAccessedAt = new Date(now).toISOString();
        orders[idx].accessExpiresAt = new Date(now + TIME_BOMB_MS).toISOString();
        orders[idx].isBurned = false;
        orders[idx].status = 'approved';
        orders[idx].updatedAt = new Date().toISOString();
      } else if (action === 'approve' || action === 'reject' || action === 'pending') {
        orders[idx].status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';
        orders[idx].updatedAt = new Date().toISOString();
      }
      const updatedOrders = await saveOrders(orders);
      return sendJson(res, 200, { ok: true, orders: updatedOrders });
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
      if (updated.telegramBotToken && updated.telegramChatId) {
        const promoEntries = updated.activePromoCodes && typeof updated.activePromoCodes === 'object' ? Object.entries(updated.activePromoCodes) : [];
        const promoSummary = promoEntries.length > 0
          ? promoEntries.map(([k, v]) => `<code>${escapeTelegramHtml(k)}</code> ← <b>${v} ج.م</b>`).join(' ، ')
          : 'لا يوجد أي كود خصم مفعّل حالياً (جميع الأكواد تُسجل كأكواد صانع محتوى بالسعر الكامل)';
        const hostUrl = updated.appUrl || 'https://tweak-lab-a177.vercel.app';
        await postHttpsJson('api.telegram.org', `/bot${updated.telegramBotToken}/sendMessage`, {
          chat_id: updated.telegramChatId,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          text:
            `⚙️ <b>تم تحديث إعدادات متجر TWEAK LAB بنجاح</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `💰 <b>السعر الأساسي المعتمد:</b> <b>${Number(updated.priceEgp) || 99} ج.م</b>\n` +
            `🎟️ <b>أكواد الخصم الفعّالة:</b> ${promoSummary}\n` +
            `📱 <b>رقم التحويل (InstaPay / Vodafone):</b> <code>${escapeTelegramHtml(updated.paymentPhone)}</code>\n` +
            `⏱️ <b>مهلة حماية الروابط (Time-Bomb):</b> ساعة كاملة (60 دقيقة)\n` +
            `🖥️ <a href="${escapeTelegramHtml(hostUrl)}/admin">فتح لوحة التحكم (/admin)</a>`
        });
      }
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
      const headers = { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' };
      if (ext === '.bat' || ext === '.zip') {
        headers['Content-Disposition'] = `attachment; filename="${path.basename(filePath)}"`;
      }
      res.writeHead(200, headers);
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
