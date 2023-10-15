import { UserModel } from '../models';
import { Result, User } from '../util/types';
import { error, ok } from '../util/utils';

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
    });
  } catch (err) {
    return error('Db error');
  }
};
