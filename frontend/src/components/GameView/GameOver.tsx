import { Box, Typography } from '@mui/material';

interface Props {
  show: boolean;
  turns: number;
}

const GameOver = ({ show, turns }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <Box marginTop={3}>
      <Typography variant="h4">You got it!</Typography>
      You guessed the correct answer in {turns} turns.
    </Box>
  );
};

export default GameOver;
