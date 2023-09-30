import { Comparison, Country, Difference } from './types';

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
    areaDifference: getDifference(playerGuess.area, correctAnswer.area),
    populationDifference: getDifference(
      playerGuess.population,
      correctAnswer.population
    ),
    locationLatDifference: getDifference(
      playerGuess.location_lat,
      correctAnswer.location_lat
    ),
    locationLngDifference: getDifference(
      playerGuess.location_lng,
      correctAnswer.location_lng
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
