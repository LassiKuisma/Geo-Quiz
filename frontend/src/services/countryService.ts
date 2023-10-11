import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from '../constants';
import { Country, Result } from '../types';
import { error, ok } from '../util/utils';

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
