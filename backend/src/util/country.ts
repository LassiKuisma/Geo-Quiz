import { approxEqual } from './utils';

import { HintThresholds } from '../types/internal';
import {
  Comparison,
  Country,
  Difference,
  Difficulty,
  Hint,
  Hints,
} from '../../../common/api';

export const compareCountries = (
  playerGuess: Country,
  correctAnswer: Country,
  difficulty: Difficulty
): Comparison => {
  const sameContinents = correctAnswer.continents.filter((continent) =>
    playerGuess.continents.includes(continent)
  );

  const sameLanguages = correctAnswer.languages.filter((language) =>
    playerGuess.languages.includes(language)
  );

  const sameNeighbours = correctAnswer.neighbours.filter((neighbour) =>
    playerGuess.neighbours.some((p) => p.countryCode === neighbour.countryCode)
  );

  const regionEqual = playerGuess.region === correctAnswer.region;

  const showDirection = shouldShowDirection(difficulty, regionEqual);

  const direction = showDirection
    ? getDirection(
        { lat: playerGuess.location_lat, lng: playerGuess.location_lng },
        { lat: correctAnswer.location_lat, lng: correctAnswer.location_lng }
      )
    : undefined;

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
    regionEqual,
    subregionEqual: playerGuess.subregion === correctAnswer.subregion,

    sameContinents,
    sameLanguages,
    sameNeighbours,

    direction,
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
  const hints: Hints = {
    landlocked: getHint(guesses, thresholds.landlocked, country.landlocked),
    drivingSide: getHint(guesses, thresholds.drivingSide, country.drivingSide),
    capital: getHint(guesses, thresholds.capital, country.capital),
    neighbourCount: getHint(
      guesses,
      thresholds.neighbourCount,
      country.neighbours.length
    ),
    languageCount: getHint(
      guesses,
      thresholds.languageCount,
      country.languages.length
    ),
  };

  return hints;
};

const getHint = <T>(guesses: number, threshold: number, answer: T): Hint<T> => {
  if (guesses < threshold) {
    return { locked: true, unlocksIn: threshold - guesses };
  }

  return { locked: false, value: answer };
};

const shouldShowDirection = (
  difficulty: Difficulty,
  correctRegion: boolean
) => {
  if (difficulty === 'hard') {
    return false;
  }

  if (difficulty === 'medium') {
    // show direction on medium only when region is correct
    return correctRegion;
  }

  return true;
};
