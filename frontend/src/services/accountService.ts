import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';

import { Result, error, ok } from '../../../common/result';
import { UserWithToken } from '../../../common/api';

export const tryCreateAccount = async (
  username: string,
  password: string
): Promise<Result<UserWithToken>> => {
  try {
    const { data } = await axios.post<UserWithToken>(
      `${apiBaseUrl}/users/create`,
      {
        username,
        password,
      }
    );

    return ok(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ERR_NETWORK') {
        return error("Can't connect to server");
      } else {
        const msg = err.response?.data || err.message;
        return error(msg);
      }
    }
    return error('Unknown error');
  }
};
