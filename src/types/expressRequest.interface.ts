import { Request } from 'express';
import { UserEntity } from '../user/entity/user.entity';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}
