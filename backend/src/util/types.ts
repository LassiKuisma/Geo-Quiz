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
  populationDifference: Difference;
  locationLatDifference: Difference;
  locationLngDifference: Difference;
  regionEqual: boolean;
  subregionEqual: boolean;

  sameContinents: Array<string>;
  sameLanguages: Array<string>;
  sameNeighbours: Array<string>;

  // angle in degrees, pointing towards the target, 0 being north, 90 east
  direction: number | undefined;
}

export interface MoveResult {
  correct: boolean;
  comparison: Comparison;
  hints: Hints;
}

export type Hint<T> =
  | { locked: true; unlocksIn: number }
  | { locked: false; value: T };

export interface Hints {
  landlocked: Hint<boolean>;
  drivingSide: Hint<Side>;
  capital: Hint<string | null>;
}

export interface NewGame {
  gameId: number;
  countries: Array<Country>;
  hints: Hints;
}

export interface HintThresholds {
  landlocked: number;
  drivingSide: number;
  capital: number;
}

export interface Game {
  gameId: number;
  answer: Country;
  guesses: number;
  owner?: User;
}

export interface User {
  username: string;
  id: number;
}
