import { Alert, Box, Typography } from '@mui/material';
import { Country, GameStatus, Move } from '../../types';
import MoveList from './MoveList';
import HintsView from './HintsViews';
import CountrySelect from './CountrySelect';
import GameOver from './GameOver';
import { useState } from 'react';
import { postMove } from '../../services/gameService';

interface Props {
  game: GameStatus;
  setGame: (game: GameStatus) => void;
}

const GameView = ({ game, setGame }: Props) => {
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

    const moveResult = await postMove(gameObj.gameId, country.id);
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
    return <Box>Active game not found.</Box>;
  }

  if (game.k === 'loading') {
    return <Box>Loading new game...</Box>;
  }

  if (game.k === 'error') {
    return <Box>Error loading game: {game.message}</Box>;
  }

  const gameObj = game.game;

  return (
    <Box margin={1}>
      <Box marginY={2}>
        <Typography variant="h3" marginY={1}>
          Guess a country
        </Typography>
        <CountrySelect game={gameObj} submitMove={submitMove} />
      </Box>
      <Error message={error} />
      <HintsView hints={gameObj.hints} />
      <GameOver show={gameObj.gameOver} turns={gameObj.guesses.length} />
      <MoveList moves={gameObj.guesses} />
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
