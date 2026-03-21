/**
 * @module config
 * @description i18n configuration - creates and pre-loads the Translator.
 *
 * @returns {Promise<Translator>} Pre-loaded translator instance
 */

import { en } from '../resources/lang/en/messages.js';
import { fr } from '../resources/lang/fr/messages.js';
import { Translator, ObjectLoader, Pluralizer } from '@formwork/i18n';

/**
 * Create a Translator with all locales pre-loaded.
 *
 * @returns {Promise<Translator>} Ready-to-use translator
 *
 * @example
 * ```ts
 * const t = await createTranslator();
 * t.get('nav.home');                    // "Home"
 * t.get('auth.welcome', { name: 'Alice' }); // "Welcome back, Alice!"
 * t.choice('posts.count', 5, { count: '5' }); // "5 posts"
 * ```
 */
export async function createTranslator(): Promise<Translator> {
  const translator = new Translator(
    new ObjectLoader({ en, fr }),
    new Pluralizer(),
    'en',
  );
  await translator.loadAll('en');
  await translator.loadAll('fr');
  return translator;
}
