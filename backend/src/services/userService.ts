import { UserModel } from '../models';
import { Result, User } from '../types/internal';
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
      id: saved.id,
    });
  } catch (err) {
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
    return error('Db error');
  }
};
