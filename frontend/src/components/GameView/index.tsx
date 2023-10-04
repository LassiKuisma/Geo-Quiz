import { Box, Typography } from '@mui/material';
import { Country, GameObject } from '../../types';
import MoveList from './MoveList';
import HintsView from './HintsViews';
import CountrySelect from './CountrySelect';
import GameOver from './GameOver';

interface Props {
  game: undefined | GameObject;
  submitMove: (country: Country) => void;
}

const GameView = ({ game, submitMove }: Props) => {
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
      <HintsView hints={game.hints} />
      <GameOver show={game.gameOver} turns={game.guesses.length} />
      <MoveList moves={game.guesses} />
    </Box>
  );
};

export default GameView;
