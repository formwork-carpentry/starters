import { BaseModel } from '@formwork/orm';
/**
 * User model - authentication subject with profile fields.
 */

export class User extends BaseModel {
  static table = 'users';
  static fillable = ['name', 'email', 'password', 'role'];
  static hidden = ['password'];
  static timestamps = true;

  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: string;
}
