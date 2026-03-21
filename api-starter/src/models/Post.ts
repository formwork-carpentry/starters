import { BaseModel } from '@formwork/orm';
/**
 * Post model - blog posts with categories, soft deletes, timestamps.
 */

export class Post extends BaseModel {
  static table = 'posts';
  static fillable = ['title', 'body', 'author_id', 'status', 'category'];
  static timestamps = true;
  static softDeletes = true;

  declare id: number;
  declare title: string;
  declare body: string;
  declare author_id: number;
  declare status: string;
  declare category: string;
}
