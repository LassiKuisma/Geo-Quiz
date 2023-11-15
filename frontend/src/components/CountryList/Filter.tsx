import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { useState } from 'react';

import { Subregion } from '../../types/internal';

interface Props {
  subregions: Array<Subregion>;
}

const Filter = ({ subregions }: Props) => {
  return (
    <Box>
      <RegionFilter subregions={subregions} />
    </Box>
  );
};

interface RegionProps {
  subregions: Array<Subregion>;
}

const RegionFilter = ({ subregions }: RegionProps) => {
  const [selectedSubregions, setSelectedSubregions] = useState<
    Array<Subregion>
  >([]);

  const checkedState = (
    region: string
  ): 'checked' | 'indeterminate' | 'unchecked' => {
    const sameRegion = subregions.filter((sr) => sr.region === region);
    const selected = sameRegion.filter((sr) => selectedSubregions.includes(sr));

    if (selected.length === 0) {
      return 'unchecked';
    } else if (selected.length === sameRegion.length) {
      return 'checked';
    } else {
      return 'indeterminate';
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      id="region-select-checkbox"
      options={subregions}
      value={selectedSubregions}
      isOptionEqualToValue={(option, value) =>
        option.subregion === value.subregion
      }
      onChange={(event, value, reason) => {
        if (
          reason === 'removeOption' ||
          reason === 'clear' ||
          reason === 'selectOption'
        ) {
          setSelectedSubregions(value);
        }
      }}
      groupBy={(option) => option.region}
      getOptionLabel={(option) => option.subregion}
      renderGroup={(params) => {
        const thisRegion = params.group;
        const check = checkedState(thisRegion);
        return (
          <li key={params.key}>
            <Checkbox
              checked={check === 'checked'}
              indeterminate={check === 'indeterminate'}
              onChange={(_event, _checked) => {
                if (check === 'checked') {
                  // un-check everything from this region
                  const newValue = selectedSubregions.filter(
                    (sr) => sr.region !== thisRegion
                  );
                  setSelectedSubregions(newValue);
                } else {
                  // select all from this region
                  const select = subregions
                    .filter((sr) => sr.region === thisRegion)
                    .filter((sr) => !selectedSubregions.includes(sr));

                  const newValue = [...selectedSubregions, ...select];

                  setSelectedSubregions(newValue);
                }
              }}
            />
            {thisRegion}
            <ul>{params.children}</ul>
          </li>
        );
      }}
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
  stringify: (option: Subregion) => `${option.region} ${option.subregion}`,
});

export default Filter;
