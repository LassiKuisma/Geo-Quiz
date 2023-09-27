import { FindOptions, InferAttributes } from 'sequelize';
import {
  CountryModel,
  DrivingSide,
  Region,
  Subregion,
  Continent,
  Language,
} from '../models';
import { Country, Result } from '../util/types';
import { error, isSide, isString, ok } from '../util/utils';

type CountryJoined = CountryModel & { driving_side: DrivingSide } & {
  region: Region;
} & { subregion: Subregion } & { continents: Array<Continent> } & {
  languages: Array<Language>;
};

const countryOptions: FindOptions<InferAttributes<CountryModel>> = {
  attributes: {
    exclude: ['drivingSideId', 'regionId', 'subregionId'],
  },
  include: [
    { model: DrivingSide, attributes: ['side'] },
    { model: Region, attributes: ['regionName'] },
    { model: Subregion, attributes: ['subregionName'] },
    {
      model: Continent,
      attributes: ['continentName'],
      through: { attributes: [] },
    },
    {
      model: Language,
      attributes: ['languageName'],
      through: { attributes: [] },
    },
  ],
};

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
    if (err instanceof Error) {
      return error(err.message);
    } else {
      return error('Unknown error fetching data.');
    }
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
    if (err instanceof Error) {
      return error(err.message);
    } else {
      return error('Unknown error fetching data.');
    }
  }
};

const modelToCountry = (model: CountryJoined): Country | null => {
  const capital =
    'capital' in model && isString(model.capital) ? model.capital : null;

  const drivingSide = model.driving_side.side;
  if (!isSide(drivingSide)) {
    return null;
  }

  const region = model.region.regionName;
  const subregion = model.subregion.subregionName;
  const continents = model.continents.map((c) => c.continentName);
  const languages = model.languages.map((l) => l.languageName);

  return {
    id: model.id,
    area: model.area,
    countryCode: model.countryCode,
    landlocked: model.landlocked,
    name: model.name,
    population: model.population,
    location_lat: model.location_lat,
    location_lng: model.location_lng,

    capital,

    drivingSide,
    region,
    subregion,
    languages,
    continents,
    neighbours: new Array<string>(), // TODO: neighbours not yet implemented
  };
};
