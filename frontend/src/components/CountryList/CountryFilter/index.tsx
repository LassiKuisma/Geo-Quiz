import { Box } from '@mui/material';

import FilterByArea from './FilterByArea';
import FilterByName from './FilterByName';
import FilterByPopulation from './FilterByPopulation';
import FilterByRegion from './FilterByRegion';

import { FilterOptions, Subregion } from '../../../types/internal';

interface Props {
  subregions: Array<Subregion>;
  filterOptions: FilterOptions;
  setFilterOptions: (_: FilterOptions) => void;
}

const CountryFilter = ({
  subregions,
  filterOptions,
  setFilterOptions,
}: Props) => {
  return (
    <Box>
      <FilterByName
        setNameFilter={(name) => {
          setFilterOptions({
            ...filterOptions,
            nameFilter: name,
          });
        }}
      />
      <FilterByRegion
        subregions={subregions}
        selectedSubregions={filterOptions.shownSubregions}
        setSelectedSubregions={(selected) => {
          setFilterOptions({
            ...filterOptions,
            shownSubregions: selected,
          });
        }}
      />
      <FilterByArea
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <FilterByPopulation
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </Box>
  );
};

export default CountryFilter;
