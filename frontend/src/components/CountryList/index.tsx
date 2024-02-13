import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';

import { getAllCountries } from '../../services/countryService';
import WorldMap from '../WorldMap';
import CountryFilter from './CountryFilter';
import CountryTable from './CountryTable';

import { FilterOptions, Subregion } from '../../types/filter';
import { Country } from '@common/api';

interface Props {
  countries: undefined | Array<Country>;
  setCountries: (countries: Array<Country>) => void;
  hasSmallDevice: boolean;
}

const CountryList = ({ countries, setCountries, hasSmallDevice }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState(0);

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
    <Box height="85%">
      <CountryFilter
        subregions={subregions}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        hasSmallDevice={hasSmallDevice}
      />
      <Box>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
        >
          <Tab label="Countries" />
          <Tab label="Map" />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <Box display="flex" flexDirection="column" height="100%">
          <CountryTable countries={countries} filters={filterOptions} />
        </Box>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Box height="85%">
          <WorldMap
            countries={countries}
            mapArgs={{ k: 'info', filters: filterOptions }}
          />
        </Box>
      </TabPanel>
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      height="100%"
    >
      {value === index && <Box height="100%">{children}</Box>}
    </Box>
  );
};

export default CountryList;
