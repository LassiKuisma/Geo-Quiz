import { CURRENT_GAME_ID } from '../constants';
import { GameObject, GameStatus, GameStatusManager } from '../types/internal';
import { Hints } from '../../../common/api';

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

export const hasUnlockedHints = (oldHints: Hints, newHints: Hints): boolean => {
  const previouslyLocked = new Set<string>();

  Object.entries(oldHints).forEach(([hintName, value]) => {
    if (
      'locked' in value &&
      typeof value.locked === 'boolean' &&
      value.locked === true
    ) {
      previouslyLocked.add(hintName);
    }
  });

  const hasUnlocked = Object.entries(newHints).some(([hintName, value]) => {
    if (!('locked' in value) || typeof value.locked !== 'boolean') {
      return false;
    }

    return value.locked === false && previouslyLocked.has(hintName);
  });

  return hasUnlocked;
};
