import { Err, Ok } from '../types';

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

export const prefixNumber = (number: number, digits: number): string => {
  if (number > 1_000_000) {
    const m = (number / 1_000_000).toFixed(digits);
    return `${m} million`;
  }

  if (number > 1_000) {
    const k = (number / 1_000).toFixed(digits);
    return `${k} thousand`;
  }

  return number.toString();
};

export const locationToStr = (lat: number, lng: number): string => {
  const latStr = lat < 0 ? `${-lat.toFixed(0)}S` : `${lat.toFixed(0)}N`;
  const lngStr = lng < 0 ? `${-lng.toFixed(0)}W` : `${lng.toFixed(0)}E`;

  return `${latStr}, ${lngStr}`;
};
