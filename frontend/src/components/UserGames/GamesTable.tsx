import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { loadGame } from '../../services/gameService';

import { GameObject, GameStatusManager } from '../../types/internal';
import { GameSummary } from '../../types/shared';

interface Props {
  games: Array<GameSummary>;
  gameStatus: GameStatusManager;
}

const GamesTable = ({ games, gameStatus }: Props) => {
  const navigate = useNavigate();

  const playGame = async (gameId: number) => {
    gameStatus.setLoading();

    navigate('/game');

    const gameLoaded = await loadGame(gameId);
    if (gameLoaded.k === 'error') {
      gameStatus.setError(gameLoaded.message);
      return;
    }

    const game = gameLoaded.value;
    game.countries.sort((a, b) => a.name.localeCompare(b.name));

    const gameObject: GameObject = {
      gameId: game.gameId,
      guesses: game.moves,
      isSubmittingMove: false,
      gameOver: game.isGameOver,
      hints: game.hints,
      countries: game.countries,
    };

    gameStatus.setGameObject(gameObject);
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Moves made</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.gameId}>
                <PlayButtonCell gameId={game.gameId} playGame={playGame} />
                <TableCell>{game.guessCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const PlayButtonCell = ({
  gameId,
  playGame,
}: {
  gameId: number;
  playGame: (id: number) => void;
}) => {
  return (
    <TableCell>
      <Button variant="outlined" onClick={() => playGame(gameId)}>
        Continue playing
      </Button>
    </TableCell>
  );
};

export default GamesTable;
