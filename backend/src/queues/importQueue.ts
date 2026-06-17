import { Queue, QueueScheduler } from 'bullmq';
import { Worker } from 'bullmq';
import { importProductFromUrl } from '../lib/importer';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const connection = { host: REDIS_HOST, port: REDIS_PORT };

export const importQueue = new Queue('import-by-url', { connection });
export const importQueueScheduler = new QueueScheduler('import-by-url', { connection });

// Worker will be started separately (in worker.ts) to avoid blocking API server
export function createWorker() {
  // concurrency 2 by default
  const worker = new Worker(
    'import-by-url',
    async (job) => {
      const { url, usePuppeteer } = job.data as { url: string; usePuppeteer?: boolean };
      const result = await importProductFromUrl(url, !!usePuppeteer);
      return result;
    },
    { connection, concurrency: 2 }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });
  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed`, err?.message || err);
  });

  return worker;
}
