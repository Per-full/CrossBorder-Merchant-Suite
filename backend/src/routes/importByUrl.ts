import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImageToUploads(url: string): Promise<string> {
  try {
    ensureUploadsDir();
    const resp = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp || !resp.data) return url;
    const parsed = new URL(url);
    let ext = path.extname(parsed.pathname).split('?')[0] || '.jpg';
    if (!ext || ext.length > 5) ext = '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(resp.data));
    return `/uploads/${filename}`;
  } catch (err) {
    console.warn('downloadImageToUploads error', err);
    return url;
  }
}

async function fetchHtmlWithPuppeteer(url: string): Promise<string> {
  // 延迟导入 puppeteer，避免未安装时抛错
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

router.post('/import-by-url', async (req, res) => {
  const { url, usePuppeteer = false } = req.body;
  if (!url) return res.status(400).json({ error: 'missing url' });

  try {
    let html: string | null = null;
    try {
      const resp = await axios.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/115.0 Safari/537.36' } });
      html = resp.data;
    } catch (err) {
      if (usePuppeteer) {
        html = await fetchHtmlWithPuppeteer(url);
      } else {
        throw err;
      }
    }

    if (!html && usePuppeteer) {
      html = await fetchHtmlWithPuppeteer(url);
    }

    const $ = cheerio.load(html || '');

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('title').text().trim() ||
      $('h1').first().text().trim() ||
      '';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="Description"]').attr('content') ||
      $('p').first().text().trim() ||
      '';

    let price =
      $('meta[itemprop="price"]').attr('content') ||
      $('[class*=price]').first().text().replace(/\s+/g, '') ||
      null;
    if (typeof price === 'string') {
      const m = price.match(/[\d,.]+/);
      price = m ? m[0].replace(/,/g, '') : price;
    }

    const images: string[] = [];
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(new URL(ogImage, url).toString());

    $('img').each((i, el) => {
      if (images.length >= 20) return;
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
      if (src) {
        try {
          const abs = new URL(src, url).toString();
          if (!images.includes(abs)) images.push(abs);
        } catch (e) {
          // skip invalid URLs
        }
      }
    });

    const attributes: Record<string, string> = {};
    $('table').first().find('tr').each((i, tr) => {
      const tds = $(tr).find('td,th');
      if (tds.length >= 2) {
        const k = $(tds[0]).text().trim();
        const v = $(tds[1]).text().trim();
        if (k) attributes[k] = v;
      }
    });

    if (Object.keys(attributes).length === 0) {
      $('ul li').each((i, li) => {
        const text = $(li).text().trim();
        const parts = text.split(/[:：]/);
        if (parts.length >= 2) {
          const k = parts[0].trim();
          const v = parts.slice(1).join(':').trim();
          if (k) attributes[k] = v;
        }
      });
    }

    const downloaded: string[] = [];
    for (let i = 0; i < Math.min(images.length, 5); i++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const local = await downloadImageToUploads(images[i]);
        downloaded.push(local);
      } catch (err) {
        downloaded.push(images[i]);
      }
    }

    return res.json({
      platform: '1688',
      sourceUrl: url,
      data: {
        title,
        description,
        price,
        images: downloaded.length ? downloaded : images,
        attributes,
      },
    });
  } catch (err: any) {
    console.error('import-by-url error', err?.message || err);
    return res.status(500).json({ error: '抓取失败', details: err?.message || String(err) });
  }
});

export default router;
