import { Err, Hints, Ok } from '../types';

/**
 * Helper function for Result type.
 */
export const error = (message: string): Err => {
  return { k: 'error', message };
};

/**
 * Helper function for Result type.
 */
export const ok = <T>(value: T): Ok<T> => {
  return { k: 'ok', value };
};

export const emptyHintsObject = (): Hints => {
  return {
    landlocked: null,
    drivingSide: null,
    capital: null,
  };
};
