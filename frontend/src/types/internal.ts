import { Country, Difficulty, GameMove, Hints, MoveResult } from './shared';

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
  guesses: Array<GameMove>;
  isSubmittingMove: boolean;
  hints: Hints;
  gameOver: boolean;
  difficulty: Difficulty;
}

type GameLoading = { k: 'loading' };
type GameOk = { k: 'ok'; game: GameObject };
type GameLoadError = { k: 'error'; message: string };
type LoadFromId = { k: 'load-from-id'; gameId: number };
export type GameStatus =
  | undefined
  | GameLoading
  | GameOk
  | GameLoadError
  | LoadFromId;

export type AppTheme = 'dark' | 'light';

export interface Page {
  name: string;
  to: string;
  loginRequired?: boolean;
}

export interface GameStatusManager {
  setLoading: () => void;
  setError: (message: string) => void;
  setGameObject: (game: GameObject) => void;
  clear: () => void;
  /**
   * When the page is loaded, if there is game id saved to local storage then
   * the game status can be set to this value. Basically "load this game next time
   * you open the game view".
   */
  setLoadableFromId: (id: number) => void;
}

export type Subregion = { subregion: string; region: string };

export interface FilterOptions {
  shownSubregions: Array<Subregion>;
  nameFilter: string;
}
