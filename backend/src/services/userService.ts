import { UserModel } from '../models';
import logger from '../util/logger';
import { error, getErrorMessage, ok } from '../util/utils';

import { Result, User } from '../types/internal';

export const createUser = async (
  username: string,
  hash: string
): Promise<Result<User>> => {
  try {
    const saved = await UserModel.create({
      username,
      passwordhash: hash,
    });

    return ok({
      username: saved.username,
      id: saved.id,
    });
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error(`error creating user '${username}':`, msg);

    return error('Db error');
  }
};

export const findUser = async (
  username: string
): Promise<Result<UserModel | null>> => {
  try {
    const user = await UserModel.findOne({
      where: {
        username,
      },
    });

    return ok(user);
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error(`error loading user ${username}:`, msg);

    return error('Db error');
  }
};
