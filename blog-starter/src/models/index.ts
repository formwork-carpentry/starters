import { BaseModel } from '@formwork/orm';

export class User extends BaseModel {
  static table = 'users';
  static fillable = ['name', 'email', 'password', 'bio'];
  static hidden = ['password'];
  static timestamps = true;
}

export class Post extends BaseModel {
  static table = 'posts';
  static fillable = ['title', 'body', 'slug', 'author_id', 'category', 'status'];
  static timestamps = true;
  static softDeletes = true;
}

export class Comment extends BaseModel {
  static table = 'comments';
  static fillable = ['post_id', 'author_id', 'body'];
  static timestamps = true;
}
