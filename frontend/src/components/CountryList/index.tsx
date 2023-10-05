import { Box } from '@mui/material';
import { Country } from '../../types';
import { useEffect } from 'react';
import { getAllCountries } from '../../services/countryService';
import CountryTable from './CountryTable';

interface Props {
  countries: undefined | Array<Country>;
  setCountries: (countries: Array<Country>) => void;
}

const CountryList = ({ countries, setCountries }: Props) => {
  useEffect(() => {
    if (countries) {
      return;
    }

    const updateCountries = async () => {
      const result = await getAllCountries();
      setCountries(result);
    };

    updateCountries();
  }, [countries]);

  if (!countries) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <CountryTable countries={countries} />
    </Box>
  );
};

export default CountryList;
