import { Box, Button, Typography } from '@mui/material';

interface Props {
  show: boolean;
  turns: number;
  startNewGame: () => void;
}

const GameOver = ({ show, turns, startNewGame }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4">You got it!</Typography>
      <Box>You guessed the correct answer in {turns} turns.</Box>
      <Button variant="contained" onClick={startNewGame}>
        Play again?
      </Button>
    </Box>
  );
};

export default GameOver;
