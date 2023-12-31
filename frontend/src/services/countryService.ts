import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';
import { error, ok } from '../util/utils';

import { Result } from '../types/internal';
import { Country } from '../types/shared';

export const getAllCountries = async (): Promise<Result<Country[]>> => {
  try {
    const { data } = await axios.get<Array<Country>>(`${apiBaseUrl}/countries`);

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
