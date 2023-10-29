import TrophyIcon from '@mui/icons-material/EmojiEvents';
import DotsIcon from '@mui/icons-material/MoreHoriz';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import dateFormat from 'dateformat';
import { useNavigate } from 'react-router-dom';

import { loadGame } from '../../services/gameService';

import { GameObject, GameStatusManager } from '../../types/internal';
import { Country, GameResult, GameSummary } from '../../types/shared';

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
              <StatusHeaderCell />
              <TableCell>Date</TableCell>
              <TableCell>Guesses</TableCell>
              <TableCell>Last guess</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <GameRow key={game.gameId} game={game} playGame={playGame} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

interface GameRowProps {
  game: GameSummary;
  playGame: (id: number) => void;
}

const GameRow = ({ game, playGame }: GameRowProps) => {
  // TODO: is game over, disable play again button (or change text)
  // last guess

  const formatString = 'dd-mm-yyyy';

  const date = game.createdAt
    ? dateFormat(new Date(game.createdAt), formatString)
    : '';

  return (
    <TableRow>
      <PlayButtonCell
        gameId={game.gameId}
        playGame={playGame}
        gameResult={game.result}
      />
      <TableCell>
        <GameResultIcon result={game.result} />
      </TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{game.guessCount}</TableCell>
      <TableCell>
        <LastMove country={game.latestGuess} />
      </TableCell>
    </TableRow>
  );
};

const PlayButtonCell = ({
  gameId,
  playGame,
  gameResult,
}: {
  gameId: number;
  playGame: (id: number) => void;
  gameResult: GameResult;
}) => {
  const text = gameResult === 'ongoing' ? 'Continue playing' : 'View game';

  return (
    <TableCell>
      <Button variant="outlined" onClick={() => playGame(gameId)}>
        {text}
      </Button>
    </TableCell>
  );
};

const GameResultIcon = ({ result }: { result: GameResult }) => {
  if (result === 'completed') {
    return <TrophyIcon />;
  } else if (result === 'ongoing') {
    return <DotsIcon />;
  } else {
    return <QuestionMarkIcon />;
  }
};

const LastMove = ({ country }: { country: Country | undefined }) => {
  if (!country) {
    return null;
  }

  return <>{country.name}</>;
};

const StatusHeaderCell = () => {
  return (
    <Tooltip
      title={
        <Box display="flex" flexDirection="column">
          <Box>
            <TrophyIcon /> = victory
          </Box>
          <Box>
            <DotsIcon /> = ongoing
          </Box>
        </Box>
      }
    >
      <TableCell
        sx={{
          textDecorationStyle: 'dotted',
          textDecorationLine: 'underline',
        }}
      >
        Status
      </TableCell>
    </Tooltip>
  );
};

export default GamesTable;
