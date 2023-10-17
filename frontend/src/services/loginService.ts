import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from '../constants';
import { Result } from '../types';
import { error, ok } from '../util/utils';

type UserWithToken = { username: string; token: string };

export const tryLogin = async (
  username: string,
  password: string
): Promise<Result<UserWithToken>> => {
  try {
    const { data } = await axios.post<UserWithToken>(`${apiBaseUrl}/login`, {
      username,
      password,
    });

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
