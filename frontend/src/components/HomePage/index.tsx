import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Difficulty } from '../../types/shared';

interface Props {
  startNewGame: (difficulty: Difficulty) => void;
  resumeCurrentGame: () => void;
  hasActiveGame: boolean;
}

const HomePage = ({
  startNewGame,
  resumeCurrentGame,
  hasActiveGame,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3" sx={{ marginBottom: 3 }}>
        Geo Quiz
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" rowGap={1}>
        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: 5 }}
          onClick={resumeCurrentGame}
          disabled={!hasActiveGame}
        >
          Resume game
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: 5 }}
          onClick={() => startNewGame('easy')}
        >
          New game (easy)
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: 5 }}
          component={Link}
          to="/select-difficulty"
        >
          Select difficulty
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
