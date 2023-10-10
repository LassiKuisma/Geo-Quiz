import {
  CountryModel,
  DrivingSide,
  Region,
  Subregion,
  Continent,
  Language,
} from '../models';
import { Country } from './types';
import { isSide, isString } from './utils';

// country model with all fields joined. Use with countryOptions in queries
export type CountryJoined = CountryModel & { driving_side: DrivingSide } & {
  region: Region;
} & { subregion: Subregion } & { continents: Array<Continent> } & {
  languages: Array<Language>;
} & { neighbours: Array<CountryModel> };

// options for querying countries, use with CountryJoined
export const countryOptions = {
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
    {
      model: CountryModel,
      attributes: ['name'],
      as: 'neighbours',
      through: { attributes: [] },
    },
  ],
};

export const modelToCountry = (model: CountryJoined): Country | null => {
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
  const neighbours = model.neighbours.map((n) => n.name);

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
    neighbours,
  };
};
