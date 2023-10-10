import {
  Comparison,
  Country,
  Difference,
  Hint,
  HintThresholds,
  Hints,
} from './types';
import { approxEqual } from './utils';

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
