export type Err = { k: 'error'; message: string };
export type Ok<T> = { k: 'ok'; value: T };

export type Result<T> = Ok<T> | Err;

export interface Country {
  id: number;
  area: number;
  countryCode: string;
  landlocked: boolean;
  name: string;
  population: number;
  location_lat: number;
  location_lng: number;
  drivingSide: Side;

  capital: string | null;
  region: string;
  subregion: string;
  languages: Array<string>;
  continents: Array<string>;
  neighbours: Array<string>;
}

export type Side = 'left' | 'right';
