import { User } from "./user";

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
