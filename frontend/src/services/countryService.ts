import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';

import { Result, error, ok } from '../../../common/result';
import { Country } from '../../../common/api';

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
