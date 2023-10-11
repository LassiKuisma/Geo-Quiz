import { CountryModel } from '../models';
import { Country, Result } from '../util/types';
import { error, ok } from '../util/utils';
import { countryOptions, CountryJoined, modelToCountry } from '../util/models';

export const getAllCountries = async (): Promise<Result<Country[]>> => {
  try {
    const models = (await CountryModel.findAll(
      countryOptions
    )) as Array<CountryJoined>;

    const countries = models.reduce((list, current) => {
      const asCountry = modelToCountry(current);
      if (asCountry) {
        list.push(asCountry);
      }
      return list;
    }, new Array<Country>());

    return ok(countries);
  } catch (err) {
    return error('error fetching data');
  }
};

export const getCountry = async (
  id: number
): Promise<Result<Country | null>> => {
  try {
    const country = (await CountryModel.findByPk(
      id,
      countryOptions
    )) as CountryJoined | null;

    if (!country) {
      return ok(null);
    }

    return ok(modelToCountry(country));
  } catch (err) {
    return error('error fetching data');
  }
};
