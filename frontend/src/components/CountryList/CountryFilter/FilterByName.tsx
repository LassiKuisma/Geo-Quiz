import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchProps {
  setNameFilter: (_: string) => void;
}

const FilterByName = ({ setNameFilter }: SearchProps) => {
  const [value, setValue] = useState('');
  const debounced = useDebouncedCallback((newValue) => {
    setNameFilter(newValue);
  }, 500);

  return (
    <TextField
      label="Filter by name"
      fullWidth
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        debounced(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setValue('');
                debounced('');
              }}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FilterByName;
