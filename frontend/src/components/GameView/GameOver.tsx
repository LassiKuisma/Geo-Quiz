import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Difficulty } from '../../types/shared';

interface Props {
  show: boolean;
  turns: number;
  startNewGame: (difficulty: Difficulty) => void;
  difficulty: Difficulty;
}

const GameOver = ({ show, turns, startNewGame, difficulty }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <Box marginTop="1em">
      <Typography variant="h4">You got it!</Typography>
      <Box>You guessed the correct answer in {turns} turns.</Box>
      <Button
        variant="contained"
        onClick={() => startNewGame(difficulty)}
        sx={{ marginRight: '1em', marginTop: '1em' }}
      >
        Play again? ({difficulty})
      </Button>
      <Button
        variant="contained"
        component={Link}
        to="/select-difficulty"
        sx={{ marginRight: '1em', marginTop: '1em' }}
      >
        Choose another difficulty
      </Button>
    </Box>
  );
};

export default GameOver;
