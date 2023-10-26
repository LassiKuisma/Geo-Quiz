import { Country } from './shared';

// types that are used internally by backend. These should not be sent across
// the API as they can contain secrets

export type Err = { k: 'error'; message: string };
export type Ok<T> = { k: 'ok'; value: T };

export type Result<T> = Ok<T> | Err;

export interface HintThresholds {
  landlocked: number;
  drivingSide: number;
  capital: number;
}

export interface Game {
  gameId: number;
  answer: Country;
  guesses: number;
  owner?: User;
}

export interface User {
  username: string;
  id: number;
}
