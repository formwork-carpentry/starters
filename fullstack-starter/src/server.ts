import { createApp } from './app.js';
import { serve } from '@formwork/http';

async function main() {
  const { kernel, config } = await createApp({ skipEnv: true });
  serve(kernel, {
    port: parseInt(process.env['APP_PORT'] ?? '3003', 10),
    onReady: ({ port }) => {
      console.log('  ' + config.get('app.name', 'Fullstack') + ' on http://localhost:' + port);
      console.log('  Try: curl http://localhost:' + port + '/health');
    },
  });
}
main().catch(console.error);
