import { Button, Container, Typography } from '@mui/material';

interface Props {
  startNewGame: () => void;
  resumeCurrentGame: () => void;
  currentGameId: undefined | number;
}

const HomePage = ({
  startNewGame,
  resumeCurrentGame,
  currentGameId,
}: Props) => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        my: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 1,
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: 3 }}>
        Main menu
      </Typography>
      <Button
        variant="contained"
        sx={{ borderRadius: 5 }}
        onClick={resumeCurrentGame}
        disabled={!currentGameId}
      >
        Resume game
      </Button>
      <Button
        variant="contained"
        sx={{ borderRadius: 5 }}
        onClick={startNewGame}
      >
        New game
      </Button>
    </Container>
  );
};

export default HomePage;
