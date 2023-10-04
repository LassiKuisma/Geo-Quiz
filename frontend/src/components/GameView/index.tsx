import { Box, Typography } from '@mui/material';
import { Country, GameObject } from '../../types';
import MoveList from './MoveList';
import HintsView from './HintsViews';
import CountrySelect from './CountrySelect';

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
      <MoveList moves={game.guesses} />
    </Box>
  );
};

export default GameView;
