import { Request } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { JWT_SECRET } from './config';
import { error, isNumber, ok } from './utils';
import { Err, Ok } from './types';
import { UserModel } from '../models';

type TokenMissing = { k: 'token-missing' };
type InvalidToken = { k: 'invalid-token' };
type UserNotFound = { k: 'user-not-found' };

type UserResult =
  | Ok<UserModel>
  | TokenMissing
  | InvalidToken
  | UserNotFound
  | Err;

export const extractUser = async (request: Request): Promise<UserResult> => {
  const authorization = request.get('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return { k: 'token-missing' };
  }

  try {
    const token = authorization.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== 'object' ||
      !('id' in decoded) ||
      !isNumber(decoded.id)
    ) {
      return { k: 'invalid-token' };
    }

    const id = decoded.id;
    const user = await UserModel.findByPk(id);
    if (!user) {
      return { k: 'user-not-found' };
    } else {
      return ok(user);
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return { k: 'invalid-token' };
    }
    return error('Unknown error');
  }
};
