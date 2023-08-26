import { type UserEntity } from '@libs/infrastructures';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
