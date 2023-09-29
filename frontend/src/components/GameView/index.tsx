import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { Country, GameObject } from '../../types';
import { useState } from 'react';
import MoveList from './MoveList';

interface Props {
  game: undefined | GameObject;
  submitMove: (country: Country) => void;
}

const GameView = ({ game, submitMove }: Props) => {
  const [countryValue, setCountryValue] = useState<null | Country>(null);
  const [countryInput, setCountryInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  if (!game) {
    return <div>Loading new game...</div>;
  }

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

  return (
    <div>
      <Typography variant="h3">Guess a country</Typography>
      <Box width={600}>
        <Box display={'flex'}>
          <Autocomplete
            id="country-select-combo-box"
            sx={{ width: '100%' }}
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
          <Button variant="outlined" onClick={guessClicked}>
            Guess
          </Button>
          <LoadingIcon visible={game.isSubmittingMove} />
        </Box>
        <ErrorDisplay errorMessage={errorMessage} />
      </Box>
      <MoveList moves={game.guesses} />
    </div>
  );
};

const ErrorDisplay = ({ errorMessage }: { errorMessage: null | string }) => {
  return (
    <Box sx={{ height: 50 }}>
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
};

const LoadingIcon = ({ visible }: { visible: boolean }) => {
  return <Box sx={{ width: 100 }}>{visible && <CircularProgress />}</Box>;
};

export default GameView;
