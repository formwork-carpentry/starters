import { createApp } from './app.js';
import { serve } from '@formwork/http';

async function main() {
  const { kernel } = await createApp({ skipEnv: true });
  serve(kernel, {
    port: parseInt(process.env['APP_PORT'] ?? '3000', 10),
    onReady: ({ port }) => {
      console.log('  API Starter on http://localhost:' + port);
      console.log('  Try: curl http://localhost:' + port + '/health');
    },
  });
}
main().catch(console.error);
