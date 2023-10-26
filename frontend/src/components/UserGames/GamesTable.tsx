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

import { GameObject, GameStatus } from '../../types/internal';
import { GameSummary } from '../../types/shared';

interface Props {
  games: Array<GameSummary>;
  setGame: (status: GameStatus) => void;
}

const GamesTable = ({ games, setGame }: Props) => {
  const navigate = useNavigate();

  const playGame = async (gameId: number) => {
    setGame({ k: 'loading' });

    navigate('/game');

    const gameLoaded = await loadGame(gameId);
    if (gameLoaded.k === 'error') {
      setGame({ k: 'error', message: gameLoaded.message });
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

    setGame({ k: 'ok', game: gameObject });
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
