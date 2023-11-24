import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { getAllCountries } from '../../services/countryService';
import CountryFilter from './CountryFilter';
import CountryTable from './CountryTable';

import { FilterOptions, Subregion } from '../../types/internal';
import { Country } from '../../types/shared';

interface Props {
  countries: undefined | Array<Country>;
  setCountries: (countries: Array<Country>) => void;
  hasSmallDevice: boolean;
}

const CountryList = ({ countries, setCountries, hasSmallDevice }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const emptyOptions: FilterOptions = {
    shownSubregions: [],
    nameFilter: '',
    area: { minimum: undefined, maximum: undefined },
    population: { minimum: undefined, maximum: undefined },
  };

  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(emptyOptions);

  useEffect(() => {
    if (countries) {
      return;
    }

    const updateCountries = async () => {
      const result = await getAllCountries();
      if (result.k === 'error') {
        setError(result.message);
      } else {
        setCountries(result.value);
        setError(undefined);
      }
    };

    updateCountries();
  }, [countries]);

  if (error) {
    return (
      <Box>
        <Box>Error fetching country data: {error}</Box>
        Try again later
      </Box>
    );
  }

  if (!countries) {
    return <Box>Loading...</Box>;
  }

  const subregions = getSubregions(countries);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CountryFilter
        subregions={subregions}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        hasSmallDevice={hasSmallDevice}
      />
      <Box display="contents">
        <CountryTable countries={countries} filters={filterOptions} />
      </Box>
    </Box>
  );
};

const getSubregions = (countries: Array<Country>): Array<Subregion> => {
  const items = countries
    .map((country) => ({
      region: country.region,
      subregion: country.subregion,
    }))
    .reduce((result, { region, subregion }) => {
      const oldVal = result.get(region);
      if (oldVal) {
        oldVal.add(subregion);
      } else {
        const newSet = new Set<string>();
        newSet.add(subregion);
        result.set(region, newSet);
      }

      return result;
    }, new Map<string, Set<string>>());

  const asArray = Array.from(items).flatMap((item) =>
    Array.from(item[1]).map((subregion) => ({
      region: item[0],
      subregion: subregion,
    }))
  );

  asArray.sort((a, b) => {
    const regionComp = a.region.localeCompare(b.region);
    return regionComp === 0
      ? a.subregion.localeCompare(b.subregion)
      : regionComp;
  });

  return asArray;
};

export default CountryList;
