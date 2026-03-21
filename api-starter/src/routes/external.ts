import { ExternalApiService } from '../services/ExternalApiService.js';
import { MemoryCacheStore } from '@formwork/cache';
import type { Container } from '@formwork/core/container';
import { CarpenterResponse } from '@formwork/http';
import type { Router } from '@formwork/http';

export function registerExternalRoutes(router: Router, container: Container): void {
  const cache = container.make<MemoryCacheStore>('cache');
  const api = new ExternalApiService(cache);

  router.get('/api/weather/:city', async (req) => {
    try { return CarpenterResponse.json({ data: await api.getWeather(req.param('city')) }); }
    catch (err) { return CarpenterResponse.json({ error: (err as Error).message, circuit: api.getCircuitState() }, 503); }
  });

  router.get('/api/exchange/:from/:to', async (req) => {
    try { return CarpenterResponse.json({ data: await api.getExchangeRate(req.param('from'), req.param('to')) }); }
    catch (err) { return CarpenterResponse.json({ error: (err as Error).message }, 503); }
  });
}
