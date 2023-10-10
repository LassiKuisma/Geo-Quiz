import {
  CountryModel,
  DrivingSide,
  Region,
  Subregion,
  Continent,
  Language,
} from '../models';
import {
  Comparison,
  Country,
  Difference,
  Hint,
  HintThresholds,
  Hints,
} from './types';
import { approxEqual, isSide, isString } from './utils';

export const compareCountries = (
  playerGuess: Country,
  correctAnswer: Country
): Comparison => {
  const sameContinents = correctAnswer.continents.filter((continent) =>
    playerGuess.continents.includes(continent)
  );

  const sameLanguages = correctAnswer.languages.filter((language) =>
    playerGuess.languages.includes(language)
  );

  const sameNeighbours = correctAnswer.neighbours.filter((neighbour) =>
    playerGuess.neighbours.includes(neighbour)
  );

  return {
    areaDifference: getDifference(correctAnswer.area, playerGuess.area),
    populationDifference: getDifference(
      correctAnswer.population,
      playerGuess.population
    ),
    locationLatDifference: getDifference(
      correctAnswer.location_lat,
      playerGuess.location_lat
    ),
    locationLngDifference: getDifference(
      correctAnswer.location_lng,
      playerGuess.location_lng
    ),
    regionEqual: playerGuess.region === correctAnswer.region,
    subregionEqual: playerGuess.subregion === correctAnswer.subregion,

    sameContinents,
    sameLanguages,
    sameNeighbours,

    direction: getDirection(
      { lat: playerGuess.location_lat, lng: playerGuess.location_lng },
      { lat: correctAnswer.location_lat, lng: correctAnswer.location_lng }
    ),
  };
};

const getDirection = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number | undefined => {
  const latDiff = to.lat - from.lat;

  let lngDiff = to.lng - from.lng;
  // wrap around if necessary
  if (lngDiff > 180) {
    lngDiff -= 360;
  } else if (lngDiff < -180) {
    lngDiff += 360;
  }

  if (approxEqual(lngDiff, 0) && approxEqual(latDiff, 0)) {
    return undefined;
  }

  const angle = (Math.atan2(lngDiff, latDiff) * 180) / Math.PI;
  const result = (angle + 360) % 360;
  return result;
};

const getDifference = (n1: number, n2: number): Difference => {
  if (approxEqual(n1, n2)) {
    return 'equal';
  } else if (n1 > n2) {
    return 'more';
  } else {
    return 'less';
  }
};

export const getHints = (
  guesses: number,
  country: Country,
  thresholds: HintThresholds
): Hints => {
  const hints = {
    landlocked: getHint(guesses, thresholds.landlocked, country.landlocked),
    drivingSide: getHint(guesses, thresholds.drivingSide, country.drivingSide),
    capital: getHint(guesses, thresholds.capital, country.capital),
  };

  return hints;
};

const getHint = <T>(guesses: number, threshold: number, answer: T): Hint<T> => {
  if (guesses < threshold) {
    return { locked: true, unlocksIn: threshold - guesses };
  }

  return { locked: false, value: answer };
};

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
