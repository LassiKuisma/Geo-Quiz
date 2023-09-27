import { Err, Ok, Side } from './types';

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
