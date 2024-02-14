import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { Country } from '@common/api';
import { GameObject } from '../../types/game';

interface Props {
  game: GameObject;
  submitMove: (country: Country) => void;
}

const CountrySelect = ({ game, submitMove }: Props) => {
  const [countryValue, setCountryValue] = useState<null | Country>(null);
  const [countryInput, setCountryInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const guessClicked = () => {
    setErrorMessage(null);

    if (!countryValue) {
      setErrorMessage('You need to select a country first!');
      return;
    }

    submitMove(countryValue);

    setCountryInput('');
    setCountryValue(null);
  };

  const disableInput = game.gameOver || game.isSubmittingMove;

  return (
    <>
      <Box display={'flex'} alignItems={'center'}>
        <Autocomplete
          id="country-select-combo-box"
          disabled={disableInput}
          fullWidth
          sx={{ width: '400px' }}
          value={countryValue}
          onChange={(_event, newValue) => {
            setCountryValue(newValue);
          }}
          inputValue={countryInput}
          onInputChange={(_event, newInput) => {
            setCountryInput(newInput);
          }}
          options={game.countries}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
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
        <Button
          variant="outlined"
          onClick={guessClicked}
          sx={{ marginX: 1, padding: 1.5 }}
          disabled={disableInput}
        >
          Guess
        </Button>
        <LoadingIcon visible={game.isSubmittingMove} />
      </Box>
      <ErrorDisplay errorMessage={errorMessage} />
    </>
  );
};

const ErrorDisplay = ({ errorMessage }: { errorMessage: null | string }) => {
  return (
    <Box>
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
};

const LoadingIcon = ({ visible }: { visible: boolean }) => {
  return (
    <Box>
      <CircularProgress sx={{ visibility: visible ? 'visible' : 'hidden' }} />
    </Box>
  );
};

export default CountrySelect;
