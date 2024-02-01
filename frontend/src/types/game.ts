import {
  Country,
  MoveResult,
  GameMove,
  Hints,
  Difficulty,
} from '../../../common/api';

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
