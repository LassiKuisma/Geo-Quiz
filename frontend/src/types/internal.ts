import { Country, MoveResult, Hints } from './shared';

export type Err = { k: 'error'; message: string };
export type Ok<T> = { k: 'ok'; value: T };

export type Result<T> = Ok<T> | Err;

export interface Move {
  guessedCountry: Country;
  result: MoveResult;
}

export interface GameObject {
  gameId: number;
  countries: Array<Country>;
  guesses: Array<Move>;
  isSubmittingMove: boolean;
  hints: Hints;
  gameOver: boolean;
}

type GameLoading = { k: 'loading' };
type GameOk = { k: 'ok'; game: GameObject };
type GameLoadError = { k: 'error'; message: string };
export type GameStatus = undefined | GameLoading | GameOk | GameLoadError;

export type AppTheme = 'dark' | 'light';

export interface Page {
  name: string;
  to: string;
}
