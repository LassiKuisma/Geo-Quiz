import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Country } from '../types';

export const getAllCountries = async () => {
  const { data } = await axios.get<Array<Country>>(`${apiBaseUrl}/countries`);

  return data;
};
