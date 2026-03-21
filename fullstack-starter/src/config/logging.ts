/**
 * Logging configuration — structured logging with audit trail.
 */
import { LogManager, ConsoleChannel, ArrayChannel } from '@formwork/log';

export function configureLogging(env: string = 'development'): LogManager {
  const manager = new LogManager(env === 'production' ? 'console' : 'array');

  manager.addChannel(new ConsoleChannel(env === 'production' ? 'info' : 'debug'));
  manager.addChannel(new ArrayChannel('array'));

  return manager;
}
