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
const REVIEW_WINDOW_DAYS = 7;
const REVIEW_WINDOW_MS = REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
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
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const SEED_REVIEWS_FILE = path.join(ROOT_DIR, 'seed_reviews.json');
const DELETED_REVIEWS_FILE = path.join(DATA_DIR, 'deleted_reviews.json');
const SEED_DELETED_REVIEWS_FILE = path.join(ROOT_DIR, 'seed_deleted_reviews.json');

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
    FRIEND20: 79
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

function ensureDefaultPromoCodes(settingsObj) {
  if (!settingsObj || typeof settingsObj !== 'object') return settingsObj;
  const basePrice = Number(settingsObj.priceEgp) || 99;
  const friend20Price = Math.round(basePrice * 0.8);
  if (!settingsObj.activePromoCodes || typeof settingsObj.activePromoCodes !== 'object') {
    settingsObj.activePromoCodes = {};
  }
  if (settingsObj.activePromoCodes['TWEAK85']) {
    delete settingsObj.activePromoCodes['TWEAK85'];
  }
  if (
    !settingsObj.activePromoCodes['FRIEND20'] ||
    Number(settingsObj.activePromoCodes['FRIEND20']) <= 0 ||
    Number(settingsObj.activePromoCodes['FRIEND20']) >= basePrice
  ) {
    settingsObj.activePromoCodes['FRIEND20'] = friend20Price;
  }
  return settingsObj;
}

global.__TWEAKLAB_SETTINGS__ = global.__TWEAKLAB_SETTINGS__ || null;
global.__TWEAKLAB_ORDERS__ = global.__TWEAKLAB_ORDERS__ || null;
global.__TWEAKLAB_DELETED_ORDERS__ = global.__TWEAKLAB_DELETED_ORDERS__ || null;
global.__TWEAKLAB_REVIEWS__ = global.__TWEAKLAB_REVIEWS__ || null;
global.__TWEAKLAB_DELETED_REVIEWS__ = global.__TWEAKLAB_DELETED_REVIEWS__ || null;
global.__TWEAKLAB_LAST_SYNC__ = global.__TWEAKLAB_LAST_SYNC__ || 0;
global.__TWEAKLAB_LAST_CLOUD_KEY__ = global.__TWEAKLAB_LAST_CLOUD_KEY__ || '';

// --- Indestructible Telegram Cloud DB Engine (Zero-Notification Multi-Instance Persistence) ---
const PNG_CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function pngCrc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ PNG_CRC_TABLE[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

function makePngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(pngCrc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

let CACHED_EMPTY_IDAT = null;
function getEmpty512Idat() {
  if (CACHED_EMPTY_IDAT) return CACHED_EMPTY_IDAT;
  const rawScanlines = Buffer.alloc(512 * (1 + 512), 0);
  CACHED_EMPTY_IDAT = makePngChunk('IDAT', zlib.deflateSync(rawScanlines, { level: 9 }));
  return CACHED_EMPTY_IDAT;
}

function packChunkIntoPng(b64String) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(512, 0);
  ihdr.writeUInt32BE(512, 4);
  ihdr[8] = 8;
  ihdr[9] = 0;
  const textData = Buffer.concat([Buffer.from('db\0', 'ascii'), Buffer.from(b64String, 'ascii')]);
  return Buffer.concat([
    sig,
    makePngChunk('IHDR', ihdr),
    getEmpty512Idat(),
    makePngChunk('tEXt', textData),
    makePngChunk('IEND', Buffer.alloc(0))
  ]);
}

function unpackChunkFromPng(pngBuf) {
  let offset = 8;
  while (offset + 8 <= pngBuf.length) {
    const len = pngBuf.readUInt32BE(offset);
    const type = pngBuf.slice(offset + 4, offset + 8).toString('ascii');
    const data = pngBuf.slice(offset + 8, offset + 8 + len);
    if (type === 'tEXt' && data.slice(0, 3).toString('ascii') === 'db\0') {
      return data.slice(3).toString('ascii');
    }
    offset += 12 + len;
  }
  return null;
}

function getTelegramCloudCreds() {
  if (process.env.DISABLE_TELEGRAM_FOR_TEST === '1') {
    return { botToken: '', chatId: '' };
  }
  const s = global.__TWEAKLAB_SETTINGS__ || DEFAULT_SETTINGS;
  return {
    botToken: (s && s.telegramBotToken) || DEFAULT_SETTINGS.telegramBotToken,
    chatId: (s && s.telegramChatId) || DEFAULT_SETTINGS.telegramChatId
  };
}

async function uploadBufferToTelegramCloud(rawBuffer) {
  const { botToken, chatId } = getTelegramCloudCreds();
  if (!botToken || !chatId) return null;
  const compressedB64 = zlib.deflateRawSync(rawBuffer, { level: 9 }).toString('base64');
  const CHUNK_LEN = 360 * 1024; // Safe under 512KB static sticker PNG limit
  const fileIds = [];
  for (let i = 0; i < compressedB64.length || i === 0; i += CHUNK_LEN) {
    const slice = compressedB64.slice(i, i + CHUNK_LEN);
    const pngBuf = packChunkIntoPng(slice);
    const form = new FormData();
    form.append('user_id', String(chatId));
    form.append('sticker_format', 'static');
    form.append('sticker', new Blob([pngBuf], { type: 'image/png' }), 'db.png');
    const res = await fetch(`https://api.telegram.org/bot${botToken}/uploadStickerFile`, {
      method: 'POST',
      body: form
    });
    const j = await res.json();
    if (!j || !j.ok || !j.result || !j.result.file_id) {
      throw new Error('Telegram uploadStickerFile failed: ' + (j && j.description ? j.description : 'unknown'));
    }
    fileIds.push(j.result.file_id);
  }
  return fileIds;
}

async function downloadBufferFromTelegramCloud(fileIds) {
  const { botToken } = getTelegramCloudCreds();
  if (!botToken || !Array.isArray(fileIds) || fileIds.length === 0) return null;
  const b64Parts = [];
  for (const fid of fileIds) {
    const gfRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fid)}`, {
      cache: 'no-store'
    });
    const gf = await gfRes.json();
    if (!gf || !gf.ok || !gf.result || !gf.result.file_path) {
      throw new Error('Telegram getFile failed for ' + fid);
    }
    const dlRes = await fetch(`https://api.telegram.org/file/bot${botToken}/${gf.result.file_path}`, {
      cache: 'no-store'
    });
    if (!dlRes.ok) throw new Error('Telegram file download HTTP ' + dlRes.status);
    const pngBuf = Buffer.from(await dlRes.arrayBuffer());
    const part = unpackChunkFromPng(pngBuf);
    if (part === null) throw new Error('Invalid PNG DB container chunk');
    b64Parts.push(part);
  }
  return zlib.inflateRawSync(Buffer.from(b64Parts.join(''), 'base64'));
}

async function pushStateToTelegramCloud() {
  try {
    const { botToken } = getTelegramCloudCreds();
    if (!botToken) return false;
    const deletedArr = Array.from(loadDeletedOrderIds());
    const currentOrders = loadOrders();
    const compactOrders = currentOrders.map((o) => {
      const copy = { ...o };
      if (copy.screenshotUrl && copy.screenshotUrl.startsWith('data:') && copy.screenshotUrl.length > 20000) {
        copy.screenshotUrl = '/api/screenshot/' + copy.id;
      }
      return copy;
    });
    const payload = {
      v: 2,
      ts: Date.now(),
      orders: compactOrders,
      deletedOrderIds: deletedArr,
      reviews: loadReviews(),
      deletedReviewIds: Array.from(loadDeletedReviewIds()),
      settings: loadSettings()
    };
    const dbFileIds = await uploadBufferToTelegramCloud(Buffer.from(JSON.stringify(payload), 'utf8'));
    if (!dbFileIds || dbFileIds.length === 0) return false;
    const pointerStr = JSON.stringify({ v: 2, dbFileIds, ts: payload.ts });
    const descRes = await fetch(`https://api.telegram.org/bot${botToken}/setMyDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: pointerStr, language_code: 'eo' })
    });
    const descJson = await descRes.json();
    if (descJson && descJson.ok) {
      global.__TWEAKLAB_LAST_CLOUD_KEY__ = dbFileIds.join(',');
      global.__TWEAKLAB_LAST_SYNC__ = Date.now();
      return true;
    }
  } catch (e) {
    console.error('Telegram Cloud DB push warning:', e.message);
  }
  return false;
}

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

async function saveDeletedOrderIds(setOrArray, skipCloudPush = false) {
  const arr = Array.from(setOrArray || []).map((id) => String(id).trim().toUpperCase());
  const set = new Set(arr);
  global.__TWEAKLAB_DELETED_ORDERS__ = set;
  try {
    fs.writeFileSync(DELETED_ORDERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(SEED_DELETED_ORDERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
  if (!skipCloudPush) {
    await pushStateToTelegramCloud();
  }
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
        const newer = tItem >= tExisting ? item : existing;
        const older = tItem >= tExisting ? existing : item;
        const bestToken = (newer.accessToken && newer.accessToken !== 'RESTORED_FROM_TELEGRAM')
          ? newer.accessToken
          : ((older.accessToken && older.accessToken !== 'RESTORED_FROM_TELEGRAM') ? older.accessToken : newer.accessToken);
        map.set(id, {
          ...older,
          ...newer,
          accessToken: bestToken,
          screenshotFileIds: newer.screenshotFileIds || older.screenshotFileIds,
          screenshotMime: newer.screenshotMime || older.screenshotMime,
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
  const now = Date.now();
  if (!force && global.__TWEAKLAB_ORDERS__ && now - global.__TWEAKLAB_LAST_SYNC__ < 1200) {
    return;
  }

  // 1. Primary Cloud DB Sync via Telegram Cloud DB (works on all Vercel deployments without extra env vars)
  try {
    const { botToken } = getTelegramCloudCreds();
    if (botToken) {
      const descRes = await fetch(`https://api.telegram.org/bot${botToken}/getMyDescription?language_code=eo`, {
        cache: 'no-store'
      });
      const descJson = await descRes.json();
      const rawDesc = descJson && descJson.ok && descJson.result ? (descJson.result.description || '').trim() : '';
      if (rawDesc.startsWith('{')) {
        const pointer = JSON.parse(rawDesc);
        const fileIds = Array.isArray(pointer.dbFileIds)
          ? pointer.dbFileIds
          : (pointer.dbFileId ? [pointer.dbFileId] : []);
        const cloudKey = fileIds.join(',');
        if (fileIds.length > 0 && (force || cloudKey !== global.__TWEAKLAB_LAST_CLOUD_KEY__ || !global.__TWEAKLAB_ORDERS__)) {
          const stateBuf = await downloadBufferFromTelegramCloud(fileIds);
          if (stateBuf) {
            const cloudState = JSON.parse(stateBuf.toString('utf8'));
            if (cloudState && Array.isArray(cloudState.deletedOrderIds)) {
              const delSet = loadDeletedOrderIds();
              cloudState.deletedOrderIds.forEach((id) => delSet.add(String(id).trim().toUpperCase()));
              await saveDeletedOrderIds(delSet, true);
            }
            const cloudOrders = (cloudState && Array.isArray(cloudState.orders)) ? cloudState.orders : [];
            const localMaster = loadLocalDiskOrders();
            const mergedOrders = mergeOrderLists(localMaster, global.__TWEAKLAB_ORDERS__ || [], cloudOrders);
            global.__TWEAKLAB_ORDERS__ = mergedOrders;
            try {
              fs.writeFileSync(ORDERS_FILE, JSON.stringify(mergedOrders, null, 2), 'utf8');
            } catch (e) {}

            if (cloudState && Array.isArray(cloudState.deletedReviewIds)) {
              const delRevSet = loadDeletedReviewIds();
              cloudState.deletedReviewIds.forEach((id) => delRevSet.add(String(id).trim().toUpperCase()));
              await saveDeletedReviewIds(delRevSet, true);
            }
            const cloudReviews = (cloudState && Array.isArray(cloudState.reviews)) ? cloudState.reviews : [];
            const localReviews = loadLocalDiskReviews();
            const mergedReviews = mergeReviewLists(localReviews, global.__TWEAKLAB_REVIEWS__ || [], cloudReviews);
            global.__TWEAKLAB_REVIEWS__ = mergedReviews;
            try {
              fs.writeFileSync(REVIEWS_FILE, JSON.stringify(mergedReviews, null, 2), 'utf8');
            } catch (e) {}

            if (cloudState && cloudState.settings && typeof cloudState.settings === 'object') {
              const mergedSettings = { ...DEFAULT_SETTINGS, ...cloudState.settings };
              if (!mergedSettings.activePromoCodes || typeof mergedSettings.activePromoCodes !== 'object') {
                mergedSettings.activePromoCodes = {};
              }
              ensureDefaultPromoCodes(mergedSettings);
              global.__TWEAKLAB_SETTINGS__ = mergedSettings;
              try {
                fs.writeFileSync(SETTINGS_FILE, JSON.stringify(mergedSettings, null, 2), 'utf8');
              } catch (e) {}
            }

            global.__TWEAKLAB_LAST_CLOUD_KEY__ = cloudKey;
            global.__TWEAKLAB_LAST_SYNC__ = Date.now();

            // If local seed/disk had orders not yet in cloudState, push merged list back to cloud
            if (mergedOrders.length > cloudOrders.length) {
              await pushStateToTelegramCloud();
            }
          }
        } else {
          global.__TWEAKLAB_ORDERS__ = mergeOrderLists(loadLocalDiskOrders(), global.__TWEAKLAB_ORDERS__ || []);
          global.__TWEAKLAB_LAST_SYNC__ = Date.now();
        }
      } else {
        // No valid v2 pointer in Telegram Cloud yet -> initialize cloud with local orders
        global.__TWEAKLAB_ORDERS__ = mergeOrderLists(loadLocalDiskOrders(), global.__TWEAKLAB_ORDERS__ || []);
        await pushStateToTelegramCloud();
      }
    }
  } catch (e) {
    console.error('Telegram Cloud DB sync warning:', e.message);
    global.__TWEAKLAB_ORDERS__ = mergeOrderLists(loadLocalDiskOrders(), global.__TWEAKLAB_ORDERS__ || []);
  }

  // 2. Secondary Cloud DB Sync via @vercel/blob if BLOB_READ_WRITE_TOKEN is configured
  const blobSdk = getBlobSdk();
  if (!blobSdk || !process.env.BLOB_READ_WRITE_TOKEN) {
    global.__TWEAKLAB_ORDERS__ = mergeOrderLists(loadLocalDiskOrders(), global.__TWEAKLAB_ORDERS__ || []);
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
            await saveDeletedOrderIds(currentDeleted, true);
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
        ensureDefaultPromoCodes(merged);
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
    ensureDefaultPromoCodes(global.__TWEAKLAB_SETTINGS__);
    return global.__TWEAKLAB_SETTINGS__;
  }
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      const merged = ensureDefaultPromoCodes({ ...DEFAULT_SETTINGS, ...raw });
      global.__TWEAKLAB_SETTINGS__ = merged;
      return global.__TWEAKLAB_SETTINGS__;
    }
  } catch (e) {}
  global.__TWEAKLAB_SETTINGS__ = ensureDefaultPromoCodes({ ...DEFAULT_SETTINGS });
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(global.__TWEAKLAB_SETTINGS__, null, 2), 'utf8');
  } catch (e) {}
  return global.__TWEAKLAB_SETTINGS__;
}

async function saveSettings(newSettings) {
  const merged = ensureDefaultPromoCodes({ ...loadSettings(), ...newSettings });
  global.__TWEAKLAB_SETTINGS__ = merged;
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');
  } catch (e) {}
  await pushStateToTelegramCloud();
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
  await pushStateToTelegramCloud();
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

function loadDeletedReviewIds() {
  if (global.__TWEAKLAB_DELETED_REVIEWS__ instanceof Set) {
    return global.__TWEAKLAB_DELETED_REVIEWS__;
  }
  const set = new Set();
  try {
    if (fs.existsSync(DELETED_REVIEWS_FILE)) {
      const arr = JSON.parse(fs.readFileSync(DELETED_REVIEWS_FILE, 'utf8'));
      if (Array.isArray(arr)) arr.forEach((id) => set.add(String(id).trim().toUpperCase()));
    }
  } catch (e) {}
  try {
    if (fs.existsSync(SEED_DELETED_REVIEWS_FILE)) {
      const arr = JSON.parse(fs.readFileSync(SEED_DELETED_REVIEWS_FILE, 'utf8'));
      if (Array.isArray(arr)) arr.forEach((id) => set.add(String(id).trim().toUpperCase()));
    }
  } catch (e) {}
  global.__TWEAKLAB_DELETED_REVIEWS__ = set;
  return set;
}

async function saveDeletedReviewIds(setOrArray, skipCloudPush = false) {
  const arr = Array.from(setOrArray || []).map((id) => String(id).trim().toUpperCase());
  const set = new Set(arr);
  global.__TWEAKLAB_DELETED_REVIEWS__ = set;
  try {
    fs.writeFileSync(DELETED_REVIEWS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(SEED_DELETED_REVIEWS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
  if (!skipCloudPush) {
    await pushStateToTelegramCloud();
  }
  return set;
}

function mergeReviewLists(...lists) {
  const deletedIds = loadDeletedReviewIds();
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
        const newer = tItem >= tExisting ? item : existing;
        const older = tItem >= tExisting ? existing : item;
        map.set(id, { ...older, ...newer });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const tA = new Date(a.createdAt || 0).getTime();
    const tB = new Date(b.createdAt || 0).getTime();
    return tB - tA;
  });
}

function loadLocalDiskReviews() {
  const deletedIds = loadDeletedReviewIds();
  let diskReviews = [];
  let seedReviews = [];
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
      if (Array.isArray(parsed)) diskReviews = parsed.filter((r) => !deletedIds.has(String(r.id).trim().toUpperCase()));
    }
  } catch (e) {}
  try {
    if (fs.existsSync(SEED_REVIEWS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SEED_REVIEWS_FILE, 'utf8'));
      if (Array.isArray(parsed)) seedReviews = parsed.filter((r) => !deletedIds.has(String(r.id).trim().toUpperCase()));
    }
  } catch (e) {}
  return mergeReviewLists(seedReviews, diskReviews);
}

function loadReviews() {
  const local = loadLocalDiskReviews();
  const merged = mergeReviewLists(local, global.__TWEAKLAB_REVIEWS__ || []);
  global.__TWEAKLAB_REVIEWS__ = merged;
  return merged;
}

async function saveReviews(reviews, skipCloudPush = false) {
  const deletedIds = loadDeletedReviewIds();
  const cleanIncoming = (reviews || []).filter((r) => !deletedIds.has(String(r.id).trim().toUpperCase()));
  global.__TWEAKLAB_REVIEWS__ = cleanIncoming;
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(cleanIncoming, null, 2), 'utf8');
  } catch (e) {}
  try {
    fs.writeFileSync(SEED_REVIEWS_FILE, JSON.stringify(cleanIncoming, null, 2), 'utf8');
  } catch (e) {}
  if (!skipCloudPush) {
    await pushStateToTelegramCloud();
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
      const approvedReviews = loadReviews().filter((r) => r.status === 'approved');
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
        deliveryMinutes: s.deliveryMinutes,
        approvedReviews
      });
    }

    // 1b. Public Verified Reviews API (GET approved reviews / POST new verified buyer review)
    if (req.method === 'GET' && pathname === '/api/reviews') {
      const approvedReviews = loadReviews().filter((r) => r.status === 'approved');
      return sendJson(res, 200, {
        ok: true,
        count: approvedReviews.length,
        showMarquee: approvedReviews.length >= 3,
        reviews: approvedReviews
      });
    }

    if (req.method === 'POST' && pathname === '/api/reviews') {
      await syncFromCloudDb(true);
      const body = await readJsonBody(req);
      const { orderId, token, sig, customerName, game, beforeFps, afterFps, rating, comment } = body || {};

      const cleanOrderId = String(orderId || '').trim().toUpperCase();
      const cleanToken = String(token || '').trim();
      const cleanSig = String(sig || '').trim();
      const settings = loadSettings();
      const expectedSig = cleanOrderId ? computeOrderSignature(cleanOrderId, settings.adminPin) : '';
      const hasValidSig = Boolean(cleanOrderId && cleanSig && cleanSig === expectedSig);

      const orders = loadOrders();
      const order = orders.find((o) => String(o.id).toUpperCase() === cleanOrderId && (o.accessToken === cleanToken || hasValidSig || o.accessToken === 'RESTORED_FROM_TELEGRAM'));
      const isVerifiedOrder = (order && (order.status === 'approved' || order.status === 'expired')) || hasValidSig;

      if (!isVerifiedOrder) {
        return sendJson(res, 403, { error: 'إضافة التقييم متاحة فقط للمشترين المؤكدين بعد الموافقة على الطلب.' });
      }

      // Check 7-day review expiration window
      const nowMs = Date.now();
      if (order) {
        const baseMs = order.firstAccessedAt
          ? new Date(order.firstAccessedAt).getTime()
          : (order.updatedAt ? new Date(order.updatedAt).getTime() : new Date(order.createdAt).getTime());
        const revExpMs = order.reviewExpiresAt ? new Date(order.reviewExpiresAt).getTime() : (baseMs + REVIEW_WINDOW_MS);
        if (nowMs > revExpMs) {
          return sendJson(res, 410, { error: 'انتهت مهلة إرسال التقييم لهذا الطلب (7 أيام).' });
        }
      }

      const existingReviews = loadReviews();
      if ((order && order.reviewSubmitted) || existingReviews.some((r) => String(r.orderId || '').toUpperCase() === cleanOrderId)) {
        return sendJson(res, 200, {
          ok: true,
          alreadyReviewed: true,
          rewardCode: 'FRIEND20'
        });
      }

      if (!comment || !String(comment).trim()) {
        return sendJson(res, 400, { error: 'يرجى كتابة تعليق قصير عن تجربتك.' });
      }

      const allowedGames = ['Fortnite', 'Valorant', 'Warzone', 'CS2', 'Other'];
      const chosenGame = allowedGames.includes(game) ? game : 'Other';
      const bFps = Math.max(1, Math.min(2000, Math.round(Number(beforeFps) || 90)));
      const aFps = Math.max(1, Math.min(3000, Math.round(Number(afterFps) || 210)));
      const stars = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));

      const newReview = {
        id: 'RV-' + Math.floor(100000 + Math.random() * 900000),
        orderId: cleanOrderId || 'VERIFIED',
        customerName: String(customerName || (order && order.customerName) || 'Gamer').trim().slice(0, 60),
        game: chosenGame,
        beforeFps: bFps,
        afterFps: aFps,
        rating: stars,
        comment: String(comment).trim().slice(0, 400),
        verifiedBuyer: true,
        status: 'pending',
        rewardCode: 'FRIEND20',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const reviews = existingReviews;
      reviews.unshift(newReview);
      if (reviews.length > 2000) reviews.length = 2000;
      await saveReviews(reviews);

      if (order) {
        order.reviewSubmitted = true;
        order.updatedAt = new Date().toISOString();
        await saveOrders(orders);
      }

      // Notify Admin on Telegram (non-blocking)
      if (process.env.DISABLE_TELEGRAM_FOR_TEST !== '1' && settings.telegramBotToken && settings.telegramChatId) {
        const hostUrl = settings.appUrl || 'https://tweak-lab-a177.vercel.app';
        const starStr = '⭐'.repeat(newReview.rating);
        postHttpsJson('api.telegram.org', `/bot${settings.telegramBotToken}/sendMessage`, {
          chat_id: settings.telegramChatId,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          text:
            `🌟 <b>تقييم جديد (Verified Review) بانتظار موافقتك!</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `👤 <b>العميل:</b> ${escapeTelegramHtml(newReview.customerName)} (<code>#${escapeTelegramHtml(newReview.orderId)}</code>)\n` +
            `🎮 <b>اللعبة:</b> <b>${escapeTelegramHtml(newReview.game)}</b>\n` +
            `🚀 <b>الفريمات:</b> <code>${newReview.beforeFps} FPS ➔ ${newReview.afterFps} FPS</code>\n` +
            `⭐ <b>التقييم:</b> ${starStr} (${newReview.rating}/5)\n` +
            `💬 <b>التعليق:</b> ${escapeTelegramHtml(newReview.comment)}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `🖥️ <a href="${escapeTelegramHtml(hostUrl)}/admin">افتح لوحة الأدمن (/admin) للضغط على Approve أو Delete</a>`
        }).catch(() => {});
      }

      return sendJson(res, 201, {
        ok: true,
        review: newReview,
        rewardCode: 'FRIEND20'
      });
    }

    // 2. Create New Order + Screenshot Upload
    if (req.method === 'POST' && pathname === '/api/orders') {
      await syncFromCloudDb(true);
      const body = await readJsonBody(req);
      const { customerName, senderPhone, discountCode, paymentMethod, notes, screenshotDataUrl, paidAmountEgp, packageName } = body;

      if (!customerName || !senderPhone || !screenshotDataUrl) {
        return sendJson(res, 400, { error: 'يرجى إدخال الاسم ورقم الموبايل ورفع صورة سكرين شوت التحويل.' });
      }

      const trimmedName = String(customerName).trim();
      if (!trimmedName || !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(trimmedName)) {
        return sendJson(res, 400, { error: 'الاسم لازم يكون حروف بس من غير أرقام' });
      }

      const normalizedPhone = String(senderPhone).trim().replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
      if (/[^0-9]/.test(normalizedPhone)) {
        return sendJson(res, 400, { error: 'لازم تكتب أرقام فقط، رقم تليفون صحيح' });
      }
      if (normalizedPhone.length < 11) {
        return sendJson(res, 400, { error: 'رقم التليفون لازم يكون 11 رقم' });
      }
      if (!/^01[0-9]{9}$/.test(normalizedPhone)) {
        return sendJson(res, 400, { error: 'لازم تكتب أرقام فقط، رقم تليفون صحيح' });
      }

      const match = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i.exec(screenshotDataUrl);
      if (!match) {
        return sendJson(res, 400, { error: 'صيغة صورة السكرين شوت غير صحيحة. يرجى رفع صورة PNG أو JPG.' });
      }

      const extRaw = match[1].toLowerCase();
      const screenshotMime = 'image/' + (extRaw === 'jpg' ? 'jpeg' : extRaw);
      const imgBuffer = Buffer.from(match[2], 'base64');

      const orderId = 'TL-' + Math.floor(100000 + Math.random() * 900000);
      const accessToken = crypto.randomBytes(16).toString('hex');
      const settings = loadSettings();

      try {
        fs.writeFileSync(path.join(UPLOADS_DIR, orderId + '.bin'), imgBuffer);
      } catch (e) {}

      let screenshotFileIds = null;
      try {
        screenshotFileIds = await uploadBufferToTelegramCloud(imgBuffer);
      } catch (e) {
        console.error('Screenshot cloud upload warning:', e.message);
      }

      // Determine exact charged/paid amount based on active promo code or configured price
      const codeKey = String(discountCode || '').trim().toUpperCase();
      const basePrice = Number(settings.priceEgp) || 99;
      const activePromoCodes = ensureDefaultPromoCodes(settings).activePromoCodes || {};
      let finalAmount = basePrice;
      let isDiscountApplied = false;
      let discountPercent = 0;

      if (codeKey === 'FRIEND20' && (!activePromoCodes[codeKey] || Number(activePromoCodes[codeKey]) >= basePrice)) {
        activePromoCodes[codeKey] = Math.round(basePrice * 0.8);
      }

      if (codeKey && activePromoCodes[codeKey]) {
        const promoVal = Number(activePromoCodes[codeKey]);
        if (!isNaN(promoVal) && promoVal > 0 && promoVal < basePrice) {
          finalAmount = promoVal;
          isDiscountApplied = true;
          discountPercent = Math.round(((basePrice - finalAmount) / basePrice) * 100);
        }
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
        discountPercent,
        isCreatorCode: Boolean(codeKey && !isDiscountApplied),
        paymentMethod: paymentMethod === 'vodafone' ? 'vodafone' : 'instapay',
        basePriceEgp: basePrice,
        amountEgp: finalAmount,
        notes: String(notes || '').trim().slice(0, 300),
        screenshotMime,
        screenshotFileIds: screenshotFileIds || undefined,
        screenshotUrl: (screenshotFileIds && screenshotFileIds.length > 0) ? ('/api/screenshot/' + orderId) : screenshotDataUrl,
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

    // 2b. Serve Order Screenshot (from Local Cache, Telegram Cloud DB, or Restored Receipt SVG)
    if (req.method === 'GET' && pathname.startsWith('/api/screenshot/')) {
      const orderId = pathname.replace('/api/screenshot/', '').trim().toUpperCase();
      const orders = loadOrders();
      const order = orders.find((o) => String(o.id).toUpperCase() === orderId);
      const localBinPath = path.join(UPLOADS_DIR, orderId + '.bin');

      if (fs.existsSync(localBinPath)) {
        try {
          const buf = fs.readFileSync(localBinPath);
          res.writeHead(200, {
            'Content-Type': (order && order.screenshotMime) || 'image/jpeg',
            'Content-Length': buf.length,
            'Cache-Control': 'public, max-age=31536000, immutable'
          });
          return res.end(buf);
        } catch (e) {}
      }

      if (order && Array.isArray(order.screenshotFileIds) && order.screenshotFileIds.length > 0) {
        try {
          const buf = await downloadBufferFromTelegramCloud(order.screenshotFileIds);
          if (buf) {
            try {
              fs.writeFileSync(localBinPath, buf);
            } catch (e) {}
            res.writeHead(200, {
              'Content-Type': order.screenshotMime || 'image/jpeg',
              'Content-Length': buf.length,
              'Cache-Control': 'public, max-age=31536000, immutable'
            });
            return res.end(buf);
          }
        } catch (e) {
          console.error('Screenshot cloud fetch error:', e.message);
        }
      }

      if (order && order.screenshotUrl && order.screenshotUrl.startsWith('data:image/')) {
        const m = /^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i.exec(order.screenshotUrl);
        if (m) {
          const buf = Buffer.from(m[2], 'base64');
          res.writeHead(200, {
            'Content-Type': m[1],
            'Content-Length': buf.length,
            'Cache-Control': 'public, max-age=31536000, immutable'
          });
          return res.end(buf);
        }
      }

      const safeId = escapeTelegramHtml(order ? order.id : orderId);
      const safeName = escapeTelegramHtml(order ? order.customerName : '');
      const safePhone = escapeTelegramHtml(order ? order.senderPhone : '');
      const safeAmount = escapeTelegramHtml(order ? order.amountEgp : 99);
      const safeMethod = order && order.paymentMethod === 'vodafone' ? 'Vodafone Cash' : 'InstaPay';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="320" viewBox="0 0 520 320">
        <rect width="520" height="320" rx="16" fill="#0b111e" stroke="#00ff88" stroke-width="2"/>
        <text x="260" y="52" text-anchor="middle" fill="#00ff88" font-family="system-ui,sans-serif" font-size="20" font-weight="800">⚡ TWEAK LAB — إيصال طلب مسجل</text>
        <line x1="40" y1="72" x2="480" y2="72" stroke="#1e2c46" stroke-width="1.5"/>
        <text x="260" y="112" text-anchor="middle" fill="#00f0ff" font-family="monospace" font-size="22" font-weight="800">#${safeId}</text>
        <text x="260" y="152" text-anchor="middle" fill="#f0f6fc" font-family="system-ui,sans-serif" font-size="16" font-weight="700">العميل: ${safeName}</text>
        <text x="260" y="186" text-anchor="middle" fill="#8b9bb4" font-family="monospace" font-size="16">رقم المحول: ${safePhone}</text>
        <text x="260" y="222" text-anchor="middle" fill="#00ff88" font-family="system-ui,sans-serif" font-size="18" font-weight="800">${safeMethod} — ${safeAmount} EGP</text>
        <rect x="90" y="248" width="340" height="36" rx="8" fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.4)"/>
        <text x="260" y="271" text-anchor="middle" fill="#00ff88" font-family="system-ui,sans-serif" font-size="13" font-weight="700">✅ تم استرجاع وحفظ بيانات الطلب في السحابة الدائمة</text>
      </svg>`;
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      return res.end(svg);
    }

    // 3. Lookup Order by Order ID or Phone Number (for "متابعة طلب سابق" & 7-day Review Return)
    if (req.method === 'GET' && pathname === '/api/orders-lookup') {
      const rawQuery = (parsedUrl.searchParams.get('q') || '').trim();
      const normalizedDigits = rawQuery.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
      const cleanQuery = normalizedDigits.replace(/^#/, '').trim();
      if (!cleanQuery) {
        return sendJson(res, 400, { error: 'يرجى إدخال رقم الطلب أو رقم الموبايل.' });
      }

      const upperQuery = cleanQuery.toUpperCase();
      const digitsOnly = cleanQuery.replace(/[^0-9]/g, '');
      const orders = loadOrders();
      const settings = loadSettings();

      const matchedOrder = orders.find((o) => {
        const oid = String(o.id || '').trim().toUpperCase();
        if (oid === upperQuery || oid === 'TL-' + upperQuery) return true;
        const oPhone = String(o.senderPhone || '').replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[^0-9]/g, '');
        if (digitsOnly.length >= 10 && oPhone && oPhone === digitsOnly) return true;
        return false;
      });

      if (!matchedOrder) {
        return sendJson(res, 404, { error: 'لم يتم العثور على طلب بهذا الرقم. تأكد من رقم الطلب (مثال: TL-123456) أو رقم التليفون المحول منه.' });
      }

      const now = Date.now();
      const allReviews = loadReviews();
      const hasSubmittedReview = Boolean(
        matchedOrder.reviewSubmitted ||
        allReviews.some((r) => String(r.orderId || '').toUpperCase() === String(matchedOrder.id).toUpperCase())
      );

      if (matchedOrder.status === 'approved' || matchedOrder.status === 'expired') {
        if (!matchedOrder.firstAccessedAt) {
          matchedOrder.firstAccessedAt = new Date(now).toISOString();
          matchedOrder.accessExpiresAt = new Date(now + TIME_BOMB_MS).toISOString();
          matchedOrder.reviewExpiresAt = new Date(now + REVIEW_WINDOW_MS).toISOString();
          matchedOrder.isBurned = false;
          matchedOrder.updatedAt = new Date(now).toISOString();
          await saveOrders(orders);
        } else if (!matchedOrder.reviewExpiresAt) {
          const baseMs = new Date(matchedOrder.firstAccessedAt).getTime();
          matchedOrder.reviewExpiresAt = new Date(baseMs + REVIEW_WINDOW_MS).toISOString();
          await saveOrders(orders);
        }

        const expMs = matchedOrder.accessExpiresAt ? new Date(matchedOrder.accessExpiresAt).getTime() : (now - 1000);
        const revExpMs = matchedOrder.reviewExpiresAt ? new Date(matchedOrder.reviewExpiresAt).getTime() : (expMs + REVIEW_WINDOW_MS);
        const isDownloadExpired = Boolean(matchedOrder.isBurned || now > expMs);
        const isReviewWindowOpen = now <= revExpMs;

        if (isDownloadExpired && (!matchedOrder.isBurned || matchedOrder.status !== 'expired')) {
          matchedOrder.isBurned = true;
          matchedOrder.status = 'expired';
          matchedOrder.updatedAt = new Date(now).toISOString();
          await saveOrders(orders);
        }

        const remainingSeconds = isDownloadExpired ? 0 : Math.max(0, Math.floor((expMs - now) / 1000));
        const timeBombInfo = {
          firstAccessedAt: matchedOrder.firstAccessedAt,
          expiresAt: matchedOrder.accessExpiresAt,
          reviewExpiresAt: matchedOrder.reviewExpiresAt,
          remainingSeconds,
          isBurned: isDownloadExpired
        };

        const sig = computeOrderSignature(matchedOrder.id, settings.adminPin);
        const deliveryPayload = isDownloadExpired
          ? {
              videoTitle: settings.videoTitle,
              videoUrl: settings.videoUrl,
              videoNotes: settings.videoNotes,
              timeBomb: timeBombInfo,
              downloadsExpired: true,
              downloads: null
            }
          : buildDeliveryPayload(matchedOrder.id, matchedOrder.accessToken, settings, timeBombInfo);

        return sendJson(res, 200, {
          ok: true,
          id: matchedOrder.id,
          accessToken: matchedOrder.accessToken,
          sig,
          customerName: matchedOrder.customerName,
          discountCode: matchedOrder.discountCode || '',
          paymentMethod: matchedOrder.paymentMethod,
          amountEgp: matchedOrder.amountEgp,
          status: isDownloadExpired ? 'expired' : 'approved',
          paymentStatus: 'approved',
          downloadsExpired: isDownloadExpired,
          isBurned: isDownloadExpired,
          reviewWindowOpen: isReviewWindowOpen,
          reviewExpiresAt: matchedOrder.reviewExpiresAt,
          reviewSubmitted: hasSubmittedReview,
          firstAccessedAt: matchedOrder.firstAccessedAt,
          expiresAt: matchedOrder.accessExpiresAt,
          createdAt: matchedOrder.createdAt,
          updatedAt: matchedOrder.updatedAt,
          timeBomb: timeBombInfo,
          delivery: deliveryPayload
        });
      }

      return sendJson(res, 200, {
        ok: true,
        id: matchedOrder.id,
        accessToken: matchedOrder.accessToken,
        customerName: matchedOrder.customerName,
        discountCode: matchedOrder.discountCode || '',
        paymentMethod: matchedOrder.paymentMethod,
        amountEgp: matchedOrder.amountEgp,
        status: matchedOrder.status,
        paymentStatus: matchedOrder.status,
        createdAt: matchedOrder.createdAt,
        updatedAt: matchedOrder.updatedAt
      });
    }

    // 3b. Poll Order Status
    if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      const orderId = pathname.replace('/api/orders/', '').trim();
      const token = parsedUrl.searchParams.get('token') || '';
      const sigParam = parsedUrl.searchParams.get('sig') || '';
      const settings = loadSettings();
      const expectedSig = computeOrderSignature(orderId, settings.adminPin);
      const hasValidSig = Boolean(sigParam && sigParam === expectedSig);

      const orders = loadOrders();
      let order = orders.find((o) => o.id === orderId && (o.accessToken === token || hasValidSig));
      if (!order && token && /^[a-f0-9]{16,64}$/i.test(token)) {
        const restored = orders.find((o) => o.id === orderId && o.accessToken === 'RESTORED_FROM_TELEGRAM');
        if (restored) {
          restored.accessToken = token;
          delete restored.isRestoredFromTelegram;
          restored.updatedAt = new Date().toISOString();
          await saveOrders(orders);
          order = restored;
        }
      }

      if (!order) {
        return sendJson(res, 404, { error: 'لم يتم العثور على الطلب.' });
      }

      const allReviews = loadReviews();
      const hasSubmittedReview = Boolean(
        order.reviewSubmitted ||
        allReviews.some((r) => String(r.orderId || '').toUpperCase() === String(order.id).toUpperCase())
      );

      // ONLY if admin manually clicked Accept in /admin will order.status be 'approved' (or 'expired' after 60m)
      if (order.status === 'approved' || order.status === 'expired') {
        const now = Date.now();

        // First time customer accesses the approved order: start the 60-minute download timer AND 7-day review timer!
        if (!order.firstAccessedAt) {
          order.firstAccessedAt = new Date(now).toISOString();
          order.accessExpiresAt = new Date(now + TIME_BOMB_MS).toISOString();
          order.reviewExpiresAt = new Date(now + REVIEW_WINDOW_MS).toISOString();
          order.isBurned = false;
          order.updatedAt = new Date().toISOString();
          await saveOrders(orders);
        } else if (!order.reviewExpiresAt) {
          const baseMs = new Date(order.firstAccessedAt).getTime();
          order.reviewExpiresAt = new Date(baseMs + REVIEW_WINDOW_MS).toISOString();
          await saveOrders(orders);
        }

        const expMs = order.accessExpiresAt ? new Date(order.accessExpiresAt).getTime() : (now - 1000);
        const revExpMs = order.reviewExpiresAt ? new Date(order.reviewExpiresAt).getTime() : (expMs + REVIEW_WINDOW_MS);
        const isExpired = Boolean(order.isBurned || now > expMs);
        const isReviewWindowOpen = now <= revExpMs;

        if (isExpired) {
          if (!order.isBurned || order.status !== 'expired') {
            order.isBurned = true;
            order.status = 'expired';
            order.updatedAt = new Date().toISOString();
            await saveOrders(orders);
          }
          const timeBombExpiredInfo = {
            firstAccessedAt: order.firstAccessedAt,
            expiresAt: order.accessExpiresAt,
            reviewExpiresAt: order.reviewExpiresAt,
            remainingSeconds: 0,
            isBurned: true
          };
          return sendJson(res, 200, {
            id: order.id,
            customerName: order.customerName,
            discountCode: order.discountCode || '',
            paymentMethod: order.paymentMethod,
            amountEgp: order.amountEgp,
            status: 'expired',
            paymentStatus: 'approved',
            downloadsExpired: true,
            isBurned: true,
            reviewWindowOpen: isReviewWindowOpen,
            reviewExpiresAt: order.reviewExpiresAt,
            reviewSubmitted: hasSubmittedReview,
            firstAccessedAt: order.firstAccessedAt,
            expiresAt: order.accessExpiresAt,
            sig: expectedSig,
            timeBomb: timeBombExpiredInfo,
            delivery: {
              videoTitle: settings.videoTitle,
              videoUrl: settings.videoUrl,
              videoNotes: settings.videoNotes,
              timeBomb: timeBombExpiredInfo,
              downloadsExpired: true,
              downloads: null
            },
            message: 'انتهت مهلة تحميل الملفات (60 دقيقة) لحماية المحتوى'
          });
        }

        const remainingSeconds = Math.max(0, Math.floor((expMs - now) / 1000));
        const timeBombInfo = {
          firstAccessedAt: order.firstAccessedAt,
          expiresAt: order.accessExpiresAt,
          reviewExpiresAt: order.reviewExpiresAt,
          remainingSeconds,
          isBurned: false
        };

        const responseData = {
          id: order.id,
          customerName: order.customerName,
          discountCode: order.discountCode || '',
          paymentMethod: order.paymentMethod,
          amountEgp: order.amountEgp,
          status: 'approved',
          paymentStatus: 'approved',
          downloadsExpired: false,
          isBurned: false,
          reviewWindowOpen: isReviewWindowOpen,
          reviewExpiresAt: order.reviewExpiresAt,
          reviewSubmitted: hasSubmittedReview,
          firstAccessedAt: order.firstAccessedAt,
          expiresAt: order.accessExpiresAt,
          sig: expectedSig,
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
      const sig = parsedUrl.searchParams.get('sig') || '';
      const settings = loadSettings();
      const expectedSig = computeOrderSignature(orderId, settings.adminPin);
      const hasValidSig = Boolean(sig && sig === expectedSig);

      const orders = loadOrders();
      let order = orders.find((o) => o.id === orderId && (o.accessToken === token || hasValidSig));
      if (!order && token && /^[a-f0-9]{16,64}$/i.test(token)) {
        const restored = orders.find((o) => o.id === orderId && o.accessToken === 'RESTORED_FROM_TELEGRAM');
        if (restored) {
          restored.accessToken = token;
          delete restored.isRestoredFromTelegram;
          restored.updatedAt = new Date().toISOString();
          await saveOrders(orders);
          order = restored;
        }
      }
      const isAuthorized = (order && (order.status === 'approved' || (order.status === 'expired' && hasValidSig))) || (!order && hasValidSig);

      if (!isAuthorized) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('⛔ غير مسموح بالتحميل قبل تأكيد وقبول عملية الدفع يدوياً من الإدارة.');
      }

      // Time-Bomb Expiration Check for Downloads (only after full 60 minutes from firstAccessedAt)
      const now = Date.now();
      if (order && !order.firstAccessedAt && order.status === 'approved') {
        order.firstAccessedAt = new Date(now).toISOString();
        order.accessExpiresAt = new Date(now + TIME_BOMB_MS).toISOString();
        order.isBurned = false;
        order.updatedAt = new Date(now).toISOString();
        await saveOrders(orders);
      }
      const isBurnedOrExpired = order && (order.accessExpiresAt && now > new Date(order.accessExpiresAt).getTime() + 60000);
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
      const sig = parsedUrl.searchParams.get('sig') || '';
      const settings = loadSettings();
      const expectedSig = computeOrderSignature(orderId, settings.adminPin);
      const hasValidSig = Boolean(sig && sig === expectedSig);

      const orders = loadOrders();
      let order = orders.find((o) => o.id === orderId && (o.accessToken === token || hasValidSig));
      if (!order && token && /^[a-f0-9]{16,64}$/i.test(token)) {
        const restored = orders.find((o) => o.id === orderId && o.accessToken === 'RESTORED_FROM_TELEGRAM');
        if (restored) {
          restored.accessToken = token;
          delete restored.isRestoredFromTelegram;
          restored.updatedAt = new Date().toISOString();
          await saveOrders(orders);
          order = restored;
        }
      }
      const isAuthorized = (order && (order.status === 'approved' || (order.status === 'expired' && hasValidSig))) || (!order && hasValidSig);

      if (!isAuthorized) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('⛔ غير مسموح بفتح الدليل قبل قبول وتأكيد الطلب يدوياً من الإدارة.');
      }

      // Time-Bomb Expiration Check for Interactive Guide
      const now = Date.now();
      if (order && !order.firstAccessedAt && order.status === 'approved') {
        order.firstAccessedAt = new Date(now).toISOString();
        order.accessExpiresAt = new Date(now + TIME_BOMB_MS).toISOString();
        order.isBurned = false;
        order.updatedAt = new Date(now).toISOString();
        await saveOrders(orders);
      }
      const isBurnedOrExpired = order && (order.accessExpiresAt && now > new Date(order.accessExpiresAt).getTime() + 60000);
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

    // 7. Admin API: List Orders, Reviews & Settings
    if (req.method === 'GET' && pathname === '/api/admin/data') {
      const pin = req.headers['x-admin-pin'] || parsedUrl.searchParams.get('pin') || '';
      const settings = ensureDefaultPromoCodes(loadSettings());
      if (pin !== settings.adminPin) {
        return sendJson(res, 401, { error: 'كلمة مرور لوحة التحكم غير صحيحة' });
      }
      const orders = loadOrders();
      const basePrice = Number(settings.priceEgp) || 99;
      const activePromoCodes = settings.activePromoCodes || {};
      const statsMap = {};

      Object.keys(activePromoCodes).forEach((rawCode) => {
        const code = String(rawCode || '').trim().toUpperCase();
        if (!code) return;
        const priceAfter = Number(activePromoCodes[rawCode]) || basePrice;
        const discountPct = priceAfter < basePrice ? Math.round(((basePrice - priceAfter) / basePrice) * 100) : 0;
        statsMap[code] = {
          code,
          isPromoDiscount: priceAfter < basePrice,
          isRewardCode: code === 'FRIEND20',
          priceAfterDiscountEgp: priceAfter,
          basePriceEgp: basePrice,
          discountPercent: discountPct,
          totalUses: 0,
          approvedUses: 0,
          pendingUses: 0,
          rejectedUses: 0,
          totalRevenueEgp: 0,
          confirmedRevenueEgp: 0,
          lastUsedAt: null
        };
      });

      (Array.isArray(orders) ? orders : []).forEach((order) => {
        const rawCode = String(order.discountCode || order.creatorCode || '').trim().toUpperCase();
        if (!rawCode) return;
        const orderAmount = Number(order.amountEgp) || basePrice;
        const orderBase = Number(order.basePriceEgp) || basePrice;
        if (!statsMap[rawCode]) {
          const isDisc = Boolean(order.isDiscountApplied) || orderAmount < orderBase;
          const pct = isDisc && orderBase > 0 ? Math.round(((orderBase - orderAmount) / orderBase) * 100) : 0;
          statsMap[rawCode] = {
            code: rawCode,
            isPromoDiscount: isDisc,
            isRewardCode: rawCode === 'FRIEND20',
            priceAfterDiscountEgp: orderAmount,
            basePriceEgp: orderBase,
            discountPercent: pct,
            totalUses: 0,
            approvedUses: 0,
            pendingUses: 0,
            rejectedUses: 0,
            totalRevenueEgp: 0,
            confirmedRevenueEgp: 0,
            lastUsedAt: null
          };
        }
        const entry = statsMap[rawCode];
        entry.totalUses += 1;
        entry.totalRevenueEgp += orderAmount;
        if (order.status === 'approved') {
          entry.approvedUses += 1;
          entry.confirmedRevenueEgp += orderAmount;
        } else if (order.status === 'rejected') {
          entry.rejectedUses += 1;
        } else {
          entry.pendingUses += 1;
        }
        if (order.createdAt && (!entry.lastUsedAt || new Date(order.createdAt) > new Date(entry.lastUsedAt))) {
          entry.lastUsedAt = order.createdAt;
        }
      });

      const promoCodeStats = Object.values(statsMap).sort((a, b) => {
        if (a.code === 'FRIEND20') return -1;
        if (b.code === 'FRIEND20') return 1;
        if (b.totalUses !== a.totalUses) return b.totalUses - a.totalUses;
        return a.code.localeCompare(b.code);
      });

      return sendJson(res, 200, {
        orders,
        reviews: loadReviews(),
        settings,
        promoCodeStats
      });
    }

    // 7b. Admin API: Approve / Delete Review
    if (req.method === 'POST' && pathname === '/api/admin/review-action') {
      await syncFromCloudDb(true);
      const pin = req.headers['x-admin-pin'] || '';
      const settings = loadSettings();
      if (pin !== settings.adminPin) {
        return sendJson(res, 401, { error: 'غير مصرح' });
      }
      const { reviewId, action } = await readJsonBody(req);
      const reviews = loadReviews();
      const cleanId = String(reviewId || '').trim().toUpperCase();
      const idx = reviews.findIndex((r) => String(r.id).trim().toUpperCase() === cleanId);

      if (action === 'delete') {
        const deletedRevIds = loadDeletedReviewIds();
        deletedRevIds.add(cleanId);
        await saveDeletedReviewIds(deletedRevIds, true);
        if (idx !== -1) {
          reviews.splice(idx, 1);
        }
        const remaining = reviews.filter((r) => !deletedRevIds.has(String(r.id).trim().toUpperCase()));
        const updatedReviews = await saveReviews(remaining);
        return sendJson(res, 200, { ok: true, reviews: updatedReviews });
      }

      if (idx === -1) return sendJson(res, 404, { error: 'التقييم غير موجود' });

      if (action === 'approve' || action === 'pending') {
        reviews[idx].status = action === 'approve' ? 'approved' : 'pending';
        reviews[idx].updatedAt = new Date().toISOString();
      }
      const updatedReviews = await saveReviews(reviews);
      return sendJson(res, 200, { ok: true, reviews: updatedReviews });
    }

    // 8. Admin API: Approve / Reject / Delete Order
    if (req.method === 'POST' && pathname === '/api/admin/order-action') {
      await syncFromCloudDb(true);
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
        await saveDeletedOrderIds(deletedIds, true);
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
      await syncFromCloudDb(true);
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
