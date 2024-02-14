import { FilterOptions } from '../types/filter';
import { Country } from '@common/api';

export const isFilterEmpty = (filters: FilterOptions): boolean => {
  return (
    filters.shownSubregions.length === 0 &&
    filters.nameFilter.length === 0 &&
    !filters.area.minimum &&
    !filters.area.maximum &&
    !filters.population.minimum &&
    !filters.population.maximum
  );
};

export const passesFilters = (filters: FilterOptions, country: Country) => {
  const subregionPasses = (country: Country) => {
    if (filters.shownSubregions.length === 0) {
      return true;
    }

    return filters.shownSubregions.some(
      ({ subregion }) => subregion === country.subregion
    );
  };

  const namePasses = (country: Country) => {
    if (filters.nameFilter.length === 0) {
      return true;
    }

    const name = filters.nameFilter.trim().toLowerCase();
    return country.name.toLowerCase().includes(name);
  };

  const areaPasses = (country: Country) => {
    const largerThanMin = filters.area.minimum
      ? country.area >= filters.area.minimum
      : true;

    const smallerThanMax = filters.area.maximum
      ? country.area <= filters.area.maximum
      : true;

    return largerThanMin && smallerThanMax;
  };

  const populationPasses = (country: Country) => {
    const moreThanMin = filters.population.minimum
      ? country.population >= filters.population.minimum
      : true;

    const lessThanMax = filters.population.maximum
      ? country.population <= filters.population.maximum
      : true;

    return moreThanMin && lessThanMax;
  };

  return (
    areaPasses(country) &&
    populationPasses(country) &&
    subregionPasses(country) &&
    namePasses(country)
  );
};
