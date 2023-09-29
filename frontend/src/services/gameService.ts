import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { MoveResult, NewGame } from '../types';

export const startNewGame = async () => {
  const { data } = await axios.post<NewGame>(`${apiBaseUrl}/game/newgame`);

  return data;
};

export const postMove = async (gameId: number, countryId: number) => {
  const { data } = await axios.post<MoveResult>(`${apiBaseUrl}/game/move`, {
    gameId,
    countryId,
  });

  return data;
};
