import express from 'express';
import { importQueue } from '../queues/importQueue';

const router = express.Router();

router.post('/import-by-url', async (req, res) => {
  const { url, usePuppeteer = false } = req.body;
  if (!url) return res.status(400).json({ error: 'missing url' });

  try {
    const job = await importQueue.add('import', { url, usePuppeteer }, { removeOnComplete: { age: 3600 }, removeOnFail: { age: 86400 } });
    return res.json({ jobId: job.id, status: 'queued' });
  } catch (err: any) {
    console.error('enqueue error', err?.message || err);
    return res.status(500).json({ error: 'enqueue failed', details: err?.message || String(err) });
  }
});

export default router;
