import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from '../constants';
import { Result } from '../types';
import { error, ok } from '../util/utils';

type NewUser = { username: string };

export const tryCreateAccount = async (
  username: string,
  password: string
): Promise<Result<NewUser>> => {
  try {
    const { data } = await axios.post<NewUser>(`${apiBaseUrl}/users/create`, {
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
