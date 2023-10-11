import { Alert, Box, Typography } from '@mui/material';
import { Country, GameObject, Move } from '../../types';
import MoveList from './MoveList';
import HintsView from './HintsViews';
import CountrySelect from './CountrySelect';
import GameOver from './GameOver';
import { useState } from 'react';
import { postMove } from '../../services/gameService';

interface Props {
  game: undefined | GameObject;
  setGame: (game: GameObject) => void;
}

const GameView = ({ game, setGame }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const submitMove = async (country: Country) => {
    if (!game) {
      return;
    }

    setGame({
      ...game,
      isSubmittingMove: true,
    });

    const moveResult = await postMove(game.gameId, country.id);
    if (moveResult.k === 'error') {
      setError(moveResult.message);
      setGame({
        ...game,
        isSubmittingMove: false,
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
      gameId: game.gameId,
      countries: game.countries.filter((c) => c.id !== country.id),
      guesses: [move, ...game.guesses],
      isSubmittingMove: false,
      hints: result.hints,
      gameOver: game.gameOver || result.correct,
    });

    return;
  };

  if (!game) {
    return <div>Loading new game...</div>;
  }

  return (
    <Box margin={1}>
      <Box marginY={2}>
        <Typography variant="h3" marginY={1}>
          Guess a country
        </Typography>
        <CountrySelect game={game} submitMove={submitMove} />
      </Box>
      <Error message={error} />
      <HintsView hints={game.hints} />
      <GameOver show={game.gameOver} turns={game.guesses.length} />
      <MoveList moves={game.guesses} />
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
