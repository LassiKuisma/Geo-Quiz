import { Country, Difficulty } from '../../../common/api';

export interface HintThresholds {
  landlocked: number;
  drivingSide: number;
  capital: number;
  neighbourCount: number;
  languageCount: number;
}

export interface Game {
  gameId: number;
  answer: Country;
  guesses: number;
  owner?: User;
  difficulty: Difficulty;
}

export interface User {
  username: string;
  id: number;
}

export type LoggingLevel = 'info' | 'error';
