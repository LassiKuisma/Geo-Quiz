import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { getAllCountries } from '../../services/countryService';
import CountryTable from './CountryTable';
import Filter from './Filter';

import { Regions } from '../../types/internal';
import { Country } from '../../types/shared';

interface Props {
  countries: undefined | Array<Country>;
  setCountries: (countries: Array<Country>) => void;
}

const CountryList = ({ countries, setCountries }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

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

  const regions = getRegionsAndSubregions(countries);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Filter regions={regions} />
      <Box display="contents">
        <CountryTable countries={countries} />
      </Box>
    </Box>
  );
};

const getRegionsAndSubregions = (countries: Array<Country>): Array<Regions> => {
  const items = countries
    .map((country) => ({
      region: country.region,
      subregion: country.subregion,
    }))
    .reduce((result, { region, subregion }) => {
      const subregions = result.get(region);
      if (subregions) {
        subregions.add(subregion);
      } else {
        const s = new Set<string>();
        s.add(subregion);
        result.set(region, s);
      }

      return result;
    }, new Map<string, Set<string>>());

  const asArray = Array.from(items).map((item) => {
    const subregionArray = Array.from(item[1]);
    subregionArray.sort();

    return {
      region: item[0],
      subregions: subregionArray,
    };
  });

  asArray.sort((a, b) => a.region.localeCompare(b.region));

  return asArray;
};

export default CountryList;
