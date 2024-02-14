import { Button } from '@mui/material';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorldMap from '../WorldMap';

import { GameStatus } from '../../types/game';

interface MobileWorldMapProps {
  gameStatus: GameStatus;
}

const MobileWorldMap = ({ gameStatus }: MobileWorldMapProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (gameStatus?.k !== 'ok') {
      navigate('/game');
    }
  }, [gameStatus]);

  if (gameStatus?.k !== 'ok') {
    return <></>;
  }

  const game = gameStatus.game;

  return (
    <>
      <Button
        variant="contained"
        component={Link}
        to="/game"
        sx={{ marginBottom: '2em' }}
      >
        Back
      </Button>
      <WorldMap
        countries={game.countries}
        mapArgs={{
          k: 'game',
          guesses: game.guesses,
          difficulty: game.difficulty,
        }}
      />
    </>
  );
};

export default MobileWorldMap;
