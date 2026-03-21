/** French translations keyed by namespace. */
export const fr: Record<string, Record<string, string>> = {
  nav: { home: 'Accueil', blog: 'Blog', login: 'Connexion', register: 'Inscription', dashboard: 'Tableau de bord', logout: 'Deconnexion' },
  auth: { welcome: 'Bienvenue, :name !', registered: 'Compte cree !', logout: 'Vous avez ete deconnecte.', invalid: 'Email ou mot de passe invalide.' },
  post: { created: 'Article publie !', updated: 'Article mis a jour.', deleted: 'Article supprime.' },
  comment: { added: 'Commentaire ajoute !', deleted: 'Commentaire supprime.' },
  posts: { count: '{0} Aucun article|{1} Un article|[2,*] :count articles' },
  validation: { required: 'Le champ :field est obligatoire.', email: 'Veuillez entrer un email valide.', min: 'Doit contenir au moins :min caracteres.' },
};
