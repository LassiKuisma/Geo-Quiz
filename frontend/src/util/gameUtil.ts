import { GameObject, GameStatus, GameStatusManager } from '../types/internal';

// widget to help manage game status
export const createStatusManager = (
  setGame: (newStatus: GameStatus) => void
): GameStatusManager => {
  const setLoading = () => {
    setGame({ k: 'loading' });
  };

  const setError = (message: string) => {
    setGame({
      k: 'error',
      message,
    });
  };

  const setGameObject = (game: GameObject) => {
    setGame({
      k: 'ok',
      game,
    });
  };

  const clear = () => {
    setGame(undefined);
  };

  return {
    setLoading,
    setError,
    setGameObject,
    clear,
  };
};
