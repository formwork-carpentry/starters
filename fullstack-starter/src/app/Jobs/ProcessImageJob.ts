/**
 * ProcessImageJob — dispatched when a media image is uploaded.
 * Generates thumbnails and optimizes the original.
 */
import { BaseJob } from '@formwork/queue';

interface ProcessImagePayload {
  mediaId: string;
  path: string;
  transformations: string[];
}

export class ProcessImageJob extends BaseJob {
  constructor(private payload: ProcessImagePayload) {
    super();
  }

  async execute(): Promise<void> {
    console.log(`[Job:ProcessImage] Processing ${this.payload.path} with transformations: ${this.payload.transformations.join(', ')}`);
    // In production: read from storage, apply transformations, write back
  }

  static toQueuedJob(payload: ProcessImagePayload) {
    return {
      name: 'ProcessImageJob',
      payload,
      queue: 'media',
      retries: 2,
    };
  }
}
