// shared types between front and back (such as data sent via API)

export type Side = 'left' | 'right';

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

export type Hint<T> =
  | { locked: true; unlocksIn: number }
  | { locked: false; value: T };

export interface Hints {
  landlocked: Hint<boolean>;
  drivingSide: Hint<Side>;
  capital: Hint<string | null>;
}

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

export interface NewGame {
  gameId: number;
  countries: Array<Country>;
  hints: Hints;
}

export interface UserWithToken {
  username: string;
  token: string;
}