import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { NewGame } from '../types';

export const startNewGame = async () => {
  const { data } = await axios.post<NewGame>(`${apiBaseUrl}/game/newgame`);

  return data;
};
