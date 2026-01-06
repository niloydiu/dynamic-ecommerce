// Optional BullMQ integration: attempt to load at runtime. If not available, fall back to immediate processing.
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let queueObj: any = null;

export async function initQueue() {
  try {
    // dynamic require to keep dependencies optional
    const IORedis = require('ioredis');
    const { Queue, QueueScheduler } = require('bullmq');
    const client = new IORedis(REDIS_URL);
    await client.ping();
    const scheduler = new QueueScheduler('notifications', { connection: client });
    await scheduler.waitUntilReady();
    const queue = new Queue('notifications', { connection: client });
    queueObj = { queue, client };
    return queueObj;
  } catch (err) {
    console.warn('Queue (BullMQ) not available — using immediate fallback:', err && err.message ? err.message : err);
    queueObj = null;
    return null;
  }
}

export async function enqueueJob(name: string, data: any, opts?: any) {
  if (queueObj && queueObj.queue) {
    return queueObj.queue.add(name, data, opts || {});
  }
  if ((global as any).__immediateJobHandler) {
    try { await (global as any).__immediateJobHandler(name, data); } catch(e){ console.error('Immediate handler failed', e); }
    return null;
  }
  // No queue and no handler — just log
  console.log('enqueueJob (no-queue):', name, data);
  return null;
}

export function registerImmediateHandler(fn: (name: string, data: any) => Promise<void>){
  (global as any).__immediateJobHandler = fn;
}
