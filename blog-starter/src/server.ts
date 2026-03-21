import { createApp } from './app.js';
import { serve } from '@formwork/http';

async function main() {
  const { kernel } = await createApp();
  serve(kernel, {
    port: parseInt(process.env['APP_PORT'] ?? '3001', 10),
    onReady: ({ port }) => {
      console.log('  Carpenter Blog on http://localhost:' + port);
      console.log('  Try: curl http://localhost:' + port + '/health');
    },
  });
}
main().catch(console.error);
