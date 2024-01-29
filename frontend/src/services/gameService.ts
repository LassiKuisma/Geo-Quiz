import axios, { AxiosError } from 'axios';

import { apiBaseUrl } from '../constants';
import { error, ok } from '../util/utils';

import { Result } from '../types/internal';
import {
  Difficulty,
  GameLoaded,
  GameSummary,
  MoveResult,
} from '../../../common/api';

export const startNewGame = async (
  token: string | undefined,
  difficulty: Difficulty
): Promise<Result<GameLoaded>> => {
  try {
    const { data } = await axios.post<GameLoaded>(
      `${apiBaseUrl}/game/newgame`,
      { difficulty },
      config(token)
    );

    return ok(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ERR_NETWORK') {
        return error("Can't connect to server");
      } else {
        const msg = err.response?.data || err.message;
        return error(msg);
      }
    }
    return error('Unknown error');
  }
};

export const postMove = async (
  gameId: number,
  countryId: number,
  token?: string
): Promise<Result<MoveResult>> => {
  try {
    const { data } = await axios.post<MoveResult>(
      `${apiBaseUrl}/game/move`,
      {
        gameId,
        countryId,
      },
      config(token)
    );

    return ok(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ERR_NETWORK') {
        return error("Can't connect to server");
      } else {
        const msg = err.response?.data || err.message;
        return error(msg);
      }
    }
    return error('Unknown error');
  }
};

const config = (token?: string) => {
  return token
    ? {
        headers: { Authorization: `bearer ${token}` },
      }
    : undefined;
};

export const loadGame = async (gameId: number): Promise<Result<GameLoaded>> => {
  try {
    const { data } = await axios.get<GameLoaded>(
      `${apiBaseUrl}/game/load/${gameId}`
    );

    const game = data;

    game.countries.sort((a, b) => a.name.localeCompare(b.name));
    game.moves.sort((a, b) => {
      if (a.timestamp === undefined || b.timestamp === undefined) {
        return 0;
      }

      return b.timestamp - a.timestamp;
    });

    return ok(game);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ERR_NETWORK') {
        return error("Can't connect to server");
      } else {
        const msg = err.response?.data || err.message;
        return error(msg);
      }
    }
    return error('Unknown error');
  }
};

export const getUserGames = async (
  token: string
): Promise<Result<Array<GameSummary>>> => {
  try {
    const { data } = await axios.get<Array<GameSummary>>(
      `${apiBaseUrl}/game/mygames`,
      config(token)
    );

    return ok(data);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.code === 'ERR_NETWORK') {
        return error("Can't connect to server");
      } else {
        const msg = err.response?.data || err.message;
        return error(msg);
      }
    }
    return error('Unknown error');
  }
};
