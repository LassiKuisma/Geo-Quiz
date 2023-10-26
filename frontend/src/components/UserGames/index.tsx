import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { getUserGames } from '../../services/gameService';
import GamesTable from './GamesTable';

import { GameStatus } from '../../types/internal';
import { GameSummary, UserWithToken } from '../../types/shared';

interface Props {
  user: UserWithToken | undefined;
  setGame: (status: GameStatus) => void;
}

interface GamesLoading {
  k: 'loading';
}
interface GamesError {
  k: 'error';
  message: string;
}
interface GamesOk {
  k: 'ok';
  value: Array<GameSummary>;
}
type GamesStatus = undefined | GamesLoading | GamesError | GamesOk;

const UserGamesView = ({ user, setGame }: Props) => {
  const [myGames, setMyGames] = useState<GamesStatus>(undefined);

  const loadGames = async () => {
    if (!user) {
      return;
    }

    setMyGames({ k: 'loading' });
    const games = await getUserGames(user.token);
    if (games.k === 'error') {
      setMyGames({ k: 'error', message: games.message });
    } else {
      setMyGames({ k: 'ok', value: games.value });
    }
  };

  useEffect(() => {
    const shouldLoad = !myGames || myGames.k === 'error';
    if (!shouldLoad) {
      return;
    }

    loadGames();
  }, [user]);

  if (!user) {
    return <Box>You need to be logged in to view your games.</Box>;
  }

  const isLoading = myGames?.k === 'loading';
  const isError = myGames?.k === 'error';
  const isOk = myGames?.k === 'ok';

  return (
    <Box>
      <Typography variant="h3" marginY={'1em'}>
        My games
      </Typography>
      {isLoading && <Loading />}
      {isError && <Error message={myGames.message} loadGames={loadGames} />}
      {isOk && <GamesTable games={myGames.value} setGame={setGame} />}
    </Box>
  );
};

const Loading = () => {
  return (
    <Box display="flex" alignItems="center" gap="1em">
      <CircularProgress />
      Loading...
    </Box>
  );
};

const Error = ({
  message,
  loadGames,
}: {
  message: string;
  loadGames: () => void;
}) => {
  return (
    <Box>
      <Alert severity="error">Failed to load games: {message}</Alert>
      <Button variant="contained" sx={{ marginTop: '1em' }} onClick={loadGames}>
        Try again?
      </Button>
    </Box>
  );
};

export default UserGamesView;
