import { AxiosError } from 'axios';
import { Err, Ok } from '../types/internal';
import { Difficulty, Side } from '../types/shared';

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

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isNumber = (param: unknown): param is number => {
  return typeof param === 'number' || param instanceof Number;
};

export const isStringArray = (param: unknown): param is Array<string> => {
  return Array.isArray(param) && param.every((item) => isString(item));
};

export const isNumberArray = (param: unknown): param is Array<number> => {
  return Array.isArray(param) && param.every((item) => isNumber(item));
};

export const isSide = (param: unknown): param is Side => {
  if (!param || !isString(param)) {
    return false;
  }

  return param === 'left' || param === 'right';
};

const EPSILON = 0.1;
export const approxEqual = (n1: number, n2: number): boolean => {
  return Math.abs(n1 - n2) <= EPSILON;
};

export const isDifficulty = (param: unknown): param is Difficulty => {
  if (!param || !isString(param)) {
    return false;
  }

  return param === 'easy' || param === 'medium' || param === 'hard';
};

export const difficultyAsNumber = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 0;
    case 'medium':
      return 1;
    case 'hard':
      return 2;
  }
};

export const difficultyFromNumber = (num: number): Difficulty | undefined => {
  switch (num) {
    case 0:
      return 'easy';
    case 1:
      return 'medium';
    case 2:
      return 'hard';
  }
  return undefined;
};

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError || err instanceof Error) {
    return err.message;
  }
  return 'unknown error';
};
