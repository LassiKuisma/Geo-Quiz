import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  createFilterOptions,
} from '@mui/material';

import { Regions } from '../../types/internal';

interface Props {
  regions: Array<Regions>;
}

const Filter = ({ regions }: Props) => {
  return (
    <Box>
      <RegionFilter regions={regions} />
    </Box>
  );
};

interface RegionProps {
  regions: Array<Regions>;
}

const RegionFilter = ({ regions }: RegionProps) => {
  const subregions = regions.flatMap((item) =>
    item.subregions.map((subregion) => ({
      region: item.region,
      subregion,
    }))
  );

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      id="region-select-checkbox"
      options={subregions}
      groupBy={(option) => option.region}
      getOptionLabel={(option) => option.subregion}
      renderGroup={(params) => (
        <li key={params.key}>
          <Checkbox />
          {params.group}
          <ul>{params.children}</ul>
        </li>
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.subregion}>
          <Checkbox checked={selected} />
          {option.subregion}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Filter by region" placeholder="Regions" />
      )}
      filterOptions={filterOptions}
    />
  );
};

const filterOptions = createFilterOptions({
  // combine both subregion and main region so that searching for the main
  // region also shows all subregions
  stringify: (option: { region: string; subregion: string }) =>
    `${option.region} ${option.subregion}`,
});

export default Filter;
