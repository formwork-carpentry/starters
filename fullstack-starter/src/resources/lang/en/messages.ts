/** English translations keyed by namespace. */
export const en: Record<string, Record<string, string>> = {
  nav: { home: 'Home', blog: 'Blog', login: 'Login', register: 'Register', dashboard: 'Dashboard', logout: 'Logout' },
  auth: { welcome: 'Welcome back, :name!', registered: 'Account created!', logout: 'You have been logged out.', invalid: 'Invalid email or password.' },
  post: { created: 'Post published!', updated: 'Post updated.', deleted: 'Post moved to trash.' },
  comment: { added: 'Comment posted!', deleted: 'Comment removed.' },
  posts: { count: '{0} No posts yet|{1} One post|[2,*] :count posts' },
  validation: { required: 'The :field field is required.', email: 'Please enter a valid email.', min: 'Must be at least :min characters.' },
};
