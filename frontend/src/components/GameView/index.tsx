import { Alert, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

import { postMove } from '../../services/gameService';
import CountrySelect from './CountrySelect';
import GameOver from './GameOver';
import HintsView from './HintsViews';
import MoveList from './MoveList';

import { GameStatus, Move } from '../../types/internal';
import { Country, UserWithToken } from '../../types/shared';

interface Props {
  game: GameStatus;
  setGame: (game: GameStatus) => void;
  startNewGame: () => void;
  user?: UserWithToken;
  hasSmallDevice: boolean;
}

const GameView = ({
  game,
  setGame,
  startNewGame,
  user,
  hasSmallDevice,
}: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const submitMove = async (country: Country) => {
    if (!game || game.k !== 'ok') {
      return;
    }

    const gameObj = game.game;

    setGame({
      k: 'ok',
      game: {
        ...gameObj,
        isSubmittingMove: true,
      },
    });

    const moveResult = await postMove(gameObj.gameId, country.id, user?.token);
    if (moveResult.k === 'error') {
      setError(moveResult.message);
      setGame({
        k: 'ok',
        game: {
          ...gameObj,
          isSubmittingMove: false,
        },
      });
      return;
    }

    setError(undefined);

    const result = moveResult.value;

    const move: Move = {
      guessedCountry: country,
      result,
    };

    setGame({
      k: 'ok',
      game: {
        gameId: gameObj.gameId,
        countries: gameObj.countries.filter((c) => c.id !== country.id),
        guesses: [move, ...gameObj.guesses],
        isSubmittingMove: false,
        hints: result.hints,
        gameOver: gameObj.gameOver || result.correct,
      },
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

  if (game.k === 'loading') {
    return <Box margin={1}>Loading new game...</Box>;
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

export default GameView;
