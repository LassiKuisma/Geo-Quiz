import { Box } from '@mui/material';
import { Country } from '../../types';
import { useEffect, useState } from 'react';
import { getAllCountries } from '../../services/countryService';
import CountryTable from './CountryTable';

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

  return <CountryTable countries={countries} />;
};

export default CountryList;
