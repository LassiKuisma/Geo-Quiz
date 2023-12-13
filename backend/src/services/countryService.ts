import { CountryModel } from '../models';
import logger from '../util/logger';
import { CountryJoined, countryOptions, modelToCountry } from '../util/models';
import { error, getErrorMessage, ok } from '../util/utils';

import { Result } from '../types/internal';
import { Country } from '../types/shared';

export const getAllCountries = async (): Promise<Result<Country[]>> => {
  try {
    const models = (await CountryModel.findAll({
      ...countryOptions(),
    })) as Array<CountryJoined>;

    const countries = models.reduce((list, current) => {
      const asCountry = modelToCountry(current);
      if (asCountry) {
        list.push(asCountry);
      }
      return list;
    }, new Array<Country>());

    return ok(countries);
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error('error loading countries:', msg);

    return error('error fetching data');
  }
};

export const getCountry = async (
  id: number
): Promise<Result<Country | null>> => {
  try {
    const country = (await CountryModel.findByPk(id, {
      ...countryOptions(),
    })) as CountryJoined | null;

    if (!country) {
      return ok(null);
    }

    return ok(modelToCountry(country));
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error(`error fetching country ${id}:`, msg);

    return error('error fetching data');
  }
};
