import { CURRENT_GAME_ID } from '../constants';
import { GameObject, GameStatus, GameStatusManager } from '../types/internal';

export const createStatusManager = (
  setGame: (newStatus: GameStatus) => void
): GameStatusManager => {
  const setLoading = () => {
    window.localStorage.removeItem(CURRENT_GAME_ID);
    setGame({ k: 'loading' });
  };

  const setError = (message: string) => {
    window.localStorage.removeItem(CURRENT_GAME_ID);
    setGame({
      k: 'error',
      message,
    });
  };

  const setGameObject = (game: GameObject) => {
    window.localStorage.setItem(CURRENT_GAME_ID, game.gameId.toString());
    setGame({
      k: 'ok',
      game,
    });
  };

  const clear = () => {
    window.localStorage.removeItem(CURRENT_GAME_ID);
    setGame(undefined);
  };

  const setLoadableFromId = (gameId: number) => {
    setGame({ k: 'load-from-id', gameId });
  };

  return {
    setLoading,
    setError,
    setGameObject,
    clear,
    setLoadableFromId,
  };
};
