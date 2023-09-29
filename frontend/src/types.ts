export type Err = { k: 'error'; message: string };
export type Ok<T> = { k: 'ok'; value: T };

export type Result<T> = Ok<T> | Err;

export interface Country {
  id: number;
  area: number;
  countryCode: string;
  landlocked: boolean;
  name: string;
  population: number;
  location_lat: number;
  location_lng: number;
  drivingSide: Side;

  capital: string | null;
  region: string;
  subregion: string;
  languages: Array<string>;
  continents: Array<string>;
  neighbours: Array<string>;
}

export type Side = 'left' | 'right';

export type Difference = 'more' | 'less' | 'equal';

export interface Comparison {
  areaDifference: Difference;
  landlockedEquality: boolean;
  populationDifference: Difference;
  locationLatDifference: Difference;
  locationLngDifference: Difference;
  drivingSideEqual: boolean;
  regionEqual: boolean;
  subregionEqual: boolean;

  sameContinents: Array<string>;
  sameLanguages: Array<string>;
  sameNeighbours: Array<string>;
}

export interface MoveResult {
  correct: boolean;
  comparison: Comparison;
}

export interface Move {
  guessedCountry: Country;
  result: MoveResult;
}

export interface NewGame {
  gameId: number;
  countries: Array<Country>;
}

export interface GameObject {
  gameId: number;
  countries: Array<Country>;
  guesses: Array<Move>;
  isSubmittingMove: boolean;
}
