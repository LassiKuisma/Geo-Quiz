import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from '../constants';
import { MoveResult, NewGame, Result } from '../types';
import { error, ok } from '../util/utils';

export const startNewGame = async (): Promise<Result<NewGame>> => {
  try {
    const { data } = await axios.post<NewGame>(`${apiBaseUrl}/game/newgame`);

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
  countryId: number
): Promise<Result<MoveResult>> => {
  try {
    const { data } = await axios.post<MoveResult>(`${apiBaseUrl}/game/move`, {
      gameId,
      countryId,
    });

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
