import { Alert, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { loadGame, postMove } from '../../services/gameService';
import CountrySelect from './CountrySelect';
import GameOver from './GameOver';
import HintsView from './HintsViews';
import MoveList from './MoveList';

import {
  GameObject,
  GameStatus,
  GameStatusManager,
} from '../../types/internal';
import { Country, UserWithToken } from '../../types/shared';

interface Props {
  game: GameStatus;
  gameStatus: GameStatusManager;
  startNewGame: () => void;
  user?: UserWithToken;
  hasSmallDevice: boolean;
}

const GameView = ({
  game,
  gameStatus,
  startNewGame,
  user,
  hasSmallDevice,
}: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (game?.k !== 'load-from-id') {
      return;
    }

    const doLoadGame = async () => {
      const gameId = game.gameId;
      gameStatus.setLoading();

      const loadResult = await loadGame(gameId);
      if (loadResult.k === 'error') {
        gameStatus.setError(loadResult.message);
        return;
      }

      const loaded = loadResult.value;
      loaded.countries.sort((a, b) => a.name.localeCompare(b.name));

      const gameObject: GameObject = {
        gameId: loaded.gameId,
        guesses: loaded.moves,
        isSubmittingMove: false,
        gameOver: loaded.isGameOver,
        hints: loaded.hints,
        countries: loaded.countries,
      };

      gameStatus.setGameObject(gameObject);
    };

    doLoadGame();
  }, [game?.k]);

  const submitMove = async (country: Country) => {
    if (!game || game.k !== 'ok') {
      return;
    }

    const gameObj = game.game;

    gameStatus.setGameObject({
      ...gameObj,
      isSubmittingMove: true,
    });

    const moveResult = await postMove(gameObj.gameId, country.id, user?.token);
    if (moveResult.k === 'error') {
      setError(moveResult.message);

      gameStatus.setGameObject({
        ...gameObj,
        isSubmittingMove: false,
      });
      return;
    }

    setError(undefined);

    const result = moveResult.value;
    const move = result.move;

    gameStatus.setGameObject({
      gameId: gameObj.gameId,
      countries: gameObj.countries.filter((c) => c.id !== country.id),
      guesses: [move, ...gameObj.guesses],
      isSubmittingMove: false,
      hints: result.hints,
      gameOver: gameObj.gameOver || move.correct,
    });

    return;
  };

  if (!game) {
    return (
      <Box margin={1}>
        <Box>Game not started, start a new game?</Box>
        <Button
          variant="contained"
          sx={{ marginY: 1, padding: 1 }}
          onClick={startNewGame}
        >
          Start new game
        </Button>
      </Box>
    );
  }

  if (game.k === 'loading' || game.k === 'load-from-id') {
    return <Loading />;
  }

  if (game.k === 'error') {
    return <Box margin={1}>Error loading game: {game.message}</Box>;
  }

  const gameObj = game.game;

  return (
    <Box margin="0.25em">
      <Box>
        <Typography variant="h3">
          {game.game.guesses.length === 0
            ? 'Take a blind guess!'
            : 'Guess a country'}
        </Typography>
        <CountrySelect game={gameObj} submitMove={submitMove} />
      </Box>
      <Error message={error} />
      <HintsView hints={gameObj.hints} />
      <GameOver
        show={gameObj.gameOver}
        turns={gameObj.guesses.length}
        startNewGame={startNewGame}
      />
      <MoveList moves={gameObj.guesses} hasSmallDevice={hasSmallDevice} />
    </Box>
  );
};

const Error = ({ message }: { message: string | undefined }) => {
  if (!message) {
    return null;
  }

  return (
    <Alert severity="error">
      Error submitting move: {message}
      <br />
      Try again in a moment.
    </Alert>
  );
};

const Loading = () => {
  return <Box margin={1}>Loading game...</Box>;
};

export default GameView;
