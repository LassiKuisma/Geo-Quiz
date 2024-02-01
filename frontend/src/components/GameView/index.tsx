import { Alert, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { loadGame, postMove } from '../../services/gameService';
import { hasUnlockedHints } from '../../util/gameUtil';
import WorldMap from '../WorldMap';
import CountrySelect from './CountrySelect';
import GameOver from './GameOver';
import HintsView from './HintsViews';
import MoveList from './MoveList';

import {
  Country,
  Difficulty,
  Hints,
  UserWithToken,
} from '../../../../common/api';
import { GameObject, GameStatus, GameStatusManager } from '../../types/game';

interface Props {
  game: GameStatus;
  gameStatus: GameStatusManager;
  startNewGame: (difficulty: Difficulty) => void;
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
  const [newHintsUnlocked, setNewHintsUnlocked] = useState(false);

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

      const gameObject: GameObject = {
        gameId: loaded.gameId,
        guesses: loaded.moves,
        isSubmittingMove: false,
        gameOver: loaded.isGameOver,
        hints: loaded.hints,
        countries: loaded.countries,
        difficulty: loaded.difficulty,
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

    if (hasUnlockedHints(gameObj.hints, result.hints)) {
      setNewHintsUnlocked(true);
    }

    gameStatus.setGameObject({
      gameId: gameObj.gameId,
      countries: gameObj.countries.filter((c) => c.id !== country.id),
      guesses: [move, ...gameObj.guesses],
      isSubmittingMove: false,
      hints: result.hints,
      gameOver: gameObj.gameOver || move.correct,
      difficulty: gameObj.difficulty,
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
          onClick={() => startNewGame('easy')}
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
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" flexDirection="row">
        <Box maxWidth="100%">
          <Typography variant="h3">Guess a country</Typography>
          <CountrySelect game={gameObj} submitMove={submitMove} />
          <Error message={error} />
          <HintsContainer
            hasSmallDevice={hasSmallDevice}
            hints={gameObj.hints}
            newHintsUnlocked={newHintsUnlocked}
            clearAnimation={() => setNewHintsUnlocked(false)}
          />
        </Box>
        {!hasSmallDevice && (
          <WorldMap
            countries={gameObj.countries}
            mapArgs={{
              k: 'game',
              guesses: gameObj.guesses,
              difficulty: gameObj.difficulty,
            }}
          />
        )}
      </Box>
      <GameOver
        show={gameObj.gameOver}
        turns={gameObj.guesses.length}
        startNewGame={startNewGame}
        difficulty={gameObj.difficulty}
      />
      <MoveList
        moves={gameObj.guesses}
        directionVisible={gameObj.difficulty !== 'hard'}
      />
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

interface HintsContainerProps {
  hasSmallDevice: boolean;
  hints: Hints;
  newHintsUnlocked: boolean;
  clearAnimation: () => void;
}

const HintsContainer = ({
  hasSmallDevice,
  hints,
  newHintsUnlocked,
  clearAnimation,
}: HintsContainerProps) => {
  if (!hasSmallDevice) {
    return (
      <Box marginTop="1em">
        <HintsView
          hints={hints}
          newHintsUnlocked={newHintsUnlocked}
          clearAnimation={clearAnimation}
        />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="row" marginTop="1em" columnGap="1em">
      <HintsView
        hints={hints}
        newHintsUnlocked={newHintsUnlocked}
        clearAnimation={clearAnimation}
      />
      <Box>
        <Button variant="contained" component={Link} to="/game/map">
          Open map
        </Button>
      </Box>
    </Box>
  );
};

export default GameView;
