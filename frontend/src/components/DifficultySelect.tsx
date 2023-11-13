import { Box, Button, Typography } from '@mui/material';
import { Difficulty } from '../types/shared';

interface Props {
  startNewGame: (difficulty: Difficulty) => void;
}

const DifficultySelect = ({ startNewGame }: Props) => {
  const easyDescription =
    'The default difficulty. Country names are displayed on the map and direction hint is always available.';

  const mediumDescription =
    'A bit more challenge. Country names are displayed on the map and direction hint is only available when you guess the correct region.';

  const hardDescription =
    'A lot more challenge. Direction hint is never available. Only names of countries you have guessed are displayed on the map, forcing you to memorize country locations.';

  return (
    <Box>
      <Typography variant="h3">Select difficulty</Typography>

      <Typography variant="h5" marginTop="1em">
        Easy
      </Typography>
      <Box>{easyDescription}</Box>
      <Button variant="contained" onClick={() => startNewGame('easy')}>
        Start easy game
      </Button>

      <Typography variant="h5" marginTop="1em">
        Medium
      </Typography>
      <Box>{mediumDescription}</Box>
      <Button variant="contained" onClick={() => startNewGame('medium')}>
        Start medium game
      </Button>

      <Typography variant="h5" marginTop="1em">
        Hard
      </Typography>
      <Box>{hardDescription}</Box>
      <Button variant="contained" onClick={() => startNewGame('hard')}>
        Start hard game
      </Button>
    </Box>
  );
};

export default DifficultySelect;
