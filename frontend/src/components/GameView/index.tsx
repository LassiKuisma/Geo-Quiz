import {
  Alert,
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { GameObject } from '../../types';
import { useState } from 'react';

interface Props {
  game: undefined | GameObject;
}

interface CountryAndId {
  name: string;
  id: number;
}

const GameView = ({ game }: Props) => {
  const [countryValue, setCountryValue] = useState<null | CountryAndId>(null);
  const [countryInput, setCountryInput] = useState('');

  if (!game) {
    return <div>Loading new game...</div>;
  }

  const guessClicked = () => {
    console.log(
      'Submitting a guess, value is',
      countryValue,
      'input is',
      countryInput
    );

    setCountryInput('');
    setCountryValue(null);
  };

  const countriesWithId = game.countries.map((country) => {
    return { name: country.name, id: country.id };
  });

  return (
    <div>
      <Typography variant="h3">Guess a country</Typography>
      <Box display={'flex'}>
        <Autocomplete
          id="country-select-combo-box"
          sx={{ width: 300 }}
          value={countryValue}
          onChange={(_event, newValue) => {
            setCountryValue(newValue);
          }}
          inputValue={countryInput}
          onInputChange={(_event, newInput) => {
            setCountryInput(newInput);
          }}
          options={countriesWithId}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <Button variant="outlined" onClick={guessClicked}>
          Guess
        </Button>
      </Box>
      <Alert severity="error">Error displayed here...</Alert>
    </div>
  );
};

export default GameView;
