/**
 * Storage configuration for SaaS — tenant-scoped file storage.
 */
import { StorageManager } from '@formwork/storage';
import { MediaCollection } from '@formwork/media';

export function configureStorage(env: string): StorageManager {
  return new StorageManager('local', {
    local: { driver: 'local', root: 'storage/app' },
    public: { driver: 'local', root: 'storage/app/public' },
    memory: { driver: 'memory' },
  });
}

/** Media collection for organization logos. */
export function orgLogoCollection(): MediaCollection {
  return new MediaCollection('org-logos');
}

/** Media collection for team assets. */
export function teamAssetCollection(): MediaCollection {
  return new MediaCollection('team-assets');
}
