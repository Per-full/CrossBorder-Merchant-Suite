import express from 'express';
import { importQueue } from '../queues/importQueue';

const router = express.Router();

// Get job status and result
router.get('/import-job/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await importQueue.getJob(id);
    if (!job) return res.status(404).json({ error: 'job not found' });
    const state = await job.getState();
    const returnValue = job.returnvalue || null;
    return res.json({ id: job.id, state, result: returnValue, attemptsMade: job.attemptsMade });
  } catch (err: any) {
    console.error('get job error', err?.message || err);
    return res.status(500).json({ error: 'cannot fetch job', details: err?.message || String(err) });
  }
});

export default router;
