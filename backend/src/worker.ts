import { createWorker } from './queues/importQueue';

console.log('Starting import worker...');
createWorker();

// keep process alive
process.on('SIGINT', () => {
  console.log('Worker exiting');
  process.exit(0);
});
