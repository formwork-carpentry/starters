/**
 * Storage configuration — file storage with media collections.
 */
import { StorageManager, MemoryStorageAdapter, LocalStorageAdapter } from '@formwork/storage';
import { MediaCollection } from '@formwork/media';

export function configureStorage(env: string): StorageManager {
  const manager = new StorageManager('local', {
    local: { driver: 'local', root: 'storage/app' },
    public: { driver: 'local', root: 'storage/app/public' },
    memory: { driver: 'memory' },
    // Uncomment for production S3:
    // s3: { driver: 's3', bucket: process.env.AWS_BUCKET, region: process.env.AWS_REGION },
  });

  return manager;
}

/** Media collection for post cover images. */
export function postMediaCollection(): MediaCollection {
  const collection = new MediaCollection('post-covers');
  return collection;
}

/** Media collection for user avatars. */
export function avatarMediaCollection(): MediaCollection {
  const collection = new MediaCollection('avatars');
  return collection;
}
