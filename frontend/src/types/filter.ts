export type Subregion = { subregion: string; region: string };

export type Range = {
  minimum: number | undefined;
  maximum: number | undefined;
};

export interface FilterOptions {
  shownSubregions: Array<Subregion>;
  nameFilter: string;
  area: Range;
  population: Range;
}
