import { BaseModel } from '@formwork/orm';
/**
 * @module app/Models
 * @description ORM models following Active Record pattern.
 *
 * Each model maps to a database table and provides CRUD, relations,
 * soft deletes, timestamps, and query scoping.
 */


/**
 * User model - authentication subject.
 *
 * @property {number} id - Primary key
 * @property {string} name - Display name
 * @property {string} email - Unique login email
 * @property {string} password - Hashed password (hidden from serialization)
 * @property {string} role - 'admin' | 'user'
 * @property {string} [bio] - Optional profile bio
 */
export class User extends BaseModel {
  static table = 'users';
  static fillable = ['name', 'email', 'password', 'role', 'bio'];
  static hidden = ['password'];
  static timestamps = true;

  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare bio: string | null;
}

/**
 * Category model - groups posts by topic.
 *
 * @property {number} id - Primary key
 * @property {string} name - Category name (e.g., "Technology")
 * @property {string} slug - URL-friendly slug (e.g., "technology")
 */
export class Category extends BaseModel {
  static table = 'categories';
  static fillable = ['name', 'slug', 'description'];

  declare id: number;
  declare name: string;
  declare slug: string;
}

/**
 * Post model - blog content with soft deletes.
 *
 * @property {number} id - Primary key
 * @property {string} title - Post title
 * @property {string} body - Post content (markdown or HTML)
 * @property {number} author_id - Foreign key to User
 * @property {string} category - Category name
 * @property {string} status - 'draft' | 'published' | 'archived'
 */
export class Post extends BaseModel {
  static table = 'posts';
  static fillable = ['title', 'body', 'slug', 'author_id', 'category', 'status', 'cover_url', 'published_at'];
  static timestamps = true;
  static softDeletes = true;

  declare id: number;
  declare title: string;
  declare body: string;
  declare author_id: number;
  declare category: string;
  declare status: string;
}

/**
 * Comment model - user comments on posts.
 *
 * @property {number} id - Primary key
 * @property {number} post_id - Foreign key to Post
 * @property {number} author_id - Foreign key to User
 * @property {string} body - Comment text
 */
export class Comment extends BaseModel {
  static table = 'comments';
  static fillable = ['post_id', 'author_id', 'body'];
  static timestamps = true;

  declare id: number;
  declare post_id: number;
  declare author_id: number;
  declare body: string;
}
