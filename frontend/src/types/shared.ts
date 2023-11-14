// shared types between front and back (such as data sent via API)

export type Side = 'left' | 'right';

export interface Neighbour {
  name: string;
  countryCode: string;
}

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
  neighbours: Array<Neighbour>;
}

export type Hint<T> =
  | { locked: true; unlocksIn: number }
  | { locked: false; value: T };

export interface Hints {
  landlocked: Hint<boolean>;
  drivingSide: Hint<Side>;
  capital: Hint<string | null>;
  neighbourCount: Hint<number>;
  languageCount: Hint<number>;
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
  sameNeighbours: Array<Neighbour>;

  // angle in degrees, pointing towards the target, 0 being north, 90 east
  direction: number | undefined;
}

export interface MoveResult {
  move: GameMove;
  hints: Hints;
}

export interface UserWithToken {
  username: string;
  token: string;
}

export interface GameMove {
  guessedCountry: Country;
  correct: boolean;
  comparison: Comparison;
  // date as epoch time
  timestamp: number | undefined;
}

export interface GameLoaded {
  gameId: number;
  moves: Array<GameMove>;
  isGameOver: boolean;
  hints: Hints;
  countries: Array<Country>;
  result: GameResult;
  difficulty: Difficulty;
}

export interface GameSummary {
  gameId: number;
  guessCount: number;
  // date as epoch time
  createdAt: number | undefined;
  latestGuess: Country | undefined;
  result: GameResult;
  difficulty: Difficulty;
}

export type GameResult = 'unknown' | 'ongoing' | 'completed';

export type Difficulty = 'easy' | 'medium' | 'hard';
