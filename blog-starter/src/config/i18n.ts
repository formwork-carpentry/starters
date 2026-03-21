import { Translator, ObjectLoader, Pluralizer } from '@formwork/i18n';

export async function createTranslator(): Promise<Translator> {
  const translator = new Translator(
    new ObjectLoader({
      en: {
        nav: { home: 'Home', blog: 'Blog', login: 'Login' },
        post: { created: 'Post created!', deleted: 'Post deleted.' },
        auth: { welcome: 'Welcome back, :name!', registered: 'Account created!' },
        comment: { added: 'Comment posted!' },
        posts: { count: '{0} No posts|{1} One post|[2,*] :count posts' },
      },
      fr: {
        nav: { home: 'Accueil', blog: 'Blog', login: 'Connexion' },
        post: { created: 'Article cree!', deleted: 'Article supprime.' },
        auth: { welcome: 'Bienvenue, :name!', registered: 'Compte cree!' },
        comment: { added: 'Commentaire ajoute!' },
        posts: { count: '{0} Aucun article|{1} Un article|[2,*] :count articles' },
      },
    }),
    new Pluralizer(), 'en',
  );

  // Pre-load all namespaces so get() works synchronously
  await translator.loadAll('en');
  await translator.loadAll('fr');

  return translator;
}
