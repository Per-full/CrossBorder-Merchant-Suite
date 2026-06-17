import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function downloadImageToUploads(url: string): Promise<string> {
  try {
    ensureUploadsDir();
    if (!url || url.startsWith('data:') || url.startsWith('javascript:')) return url;

    const resp = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 20000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      maxContentLength: 5 * 1024 * 1024,
    });
    if (!resp || !resp.data) return url;

    let parsedExt = '.jpg';
    try {
      const parsed = new URL(url);
      const ext = path.extname(parsed.pathname) || '';
      if (ext && ext.length <= 6) parsedExt = ext;
    } catch (e) {
      // ignore
    }

    const filename = `${uuidv4()}${parsedExt}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(resp.data));
    return `/uploads/${filename}`;
  } catch (err: any) {
    console.warn('downloadImageToUploads error', err?.message || err);
    return url;
  }
}

async function fetchHtmlWithPuppeteer(url: string): Promise<string> {
  // dynamic import to avoid requiring puppeteer when not installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const content = await page.content();
    await page.close();
    return content;
  } finally {
    await browser.close();
  }
}

export async function importProductFromUrl(url: string, usePuppeteer = false) {
  if (!url) throw new Error('missing url');

  // fetch HTML (axios first, fallback to puppeteer if requested)
  let html: string | null = null;
  try {
    const resp = await axios.get(url, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/115.0 Safari/537.36' },
    });
    html = resp.data;
  } catch (err) {
    if (usePuppeteer) html = await fetchHtmlWithPuppeteer(url);
    else throw err;
  }

  if (!html && usePuppeteer) html = await fetchHtmlWithPuppeteer(url);
  const $ = cheerio.load(html || '');

  const title =
    ($('meta[property="og:title"]').attr('content') as string) ||
    ($('meta[name="title"]').attr('content') as string) ||
    ($('title').text() || '').trim() ||
    ($('h1').first().text() || '').trim() ||
    '';

  const description =
    ($('meta[property="og:description"]').attr('content') as string) ||
    ($('meta[name="description"]').attr('content') as string) ||
    ($('meta[name="Description"]').attr('content') as string) ||
    ($('p').first().text() || '').trim() ||
    '';

  let price: string | null =
    ($('meta[itemprop="price"]').attr('content') as string) ||
    ($('[class*=price]').first().text() || '').replace(/\s+/g, '') ||
    null;
  if (typeof price === 'string') {
    const m = price.match(/[\d,.]+/);
    price = m ? m[0].replace(/,/g, '') : price;
  }

  const images: string[] = [];
  const ogImage = ($('meta[property="og:image"]').attr('content') as string) || '';
  if (ogImage) {
    try {
      images.push(new URL(ogImage, url).toString());
    } catch (e) {
      // skip
    }
  }

  $('img').each((i, el) => {
    if (images.length >= 12) return;
    const src = ($(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || '') as string;
    if (src && typeof src === 'string') {
      if (src.startsWith('data:') || src.startsWith('javascript:')) return;
      try {
        const abs = new URL(src, url).toString();
        if (!images.includes(abs)) images.push(abs);
      } catch (e) {
        // skip invalid
      }
    }
  });

  // download up to 5 images
  const downloaded: string[] = [];
  for (let i = 0; i < Math.min(images.length, 5); i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const local = await downloadImageToUploads(images[i]);
      downloaded.push(local);
    } catch (e) {
      downloaded.push(images[i]);
    }
  }

  return {
    platform: '1688',
    sourceUrl: url,
    data: {
      title,
      description,
      price,
      images: downloaded.length ? downloaded : images,
      attributes: {},
    },
  };
}
