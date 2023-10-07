import {
  Comparison,
  Country,
  Difference,
  Hint,
  HintThresholds,
  Hints,
} from './types';

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
  };
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

const EPSILON = 0.1;
const approxEqual = (n1: number, n2: number): boolean => {
  return Math.abs(n1 - n2) <= EPSILON;
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
