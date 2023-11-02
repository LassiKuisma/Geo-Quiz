import TrophyIcon from '@mui/icons-material/EmojiEvents';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DotsIcon from '@mui/icons-material/MoreHoriz';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dateFormat from 'dateformat';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loadGame } from '../../services/gameService';

import { GameObject, GameStatusManager } from '../../types/internal';
import { Country, GameResult, GameSummary } from '../../types/shared';

interface Props {
  games: Array<GameSummary>;
  gameStatus: GameStatusManager;
  hasSmallDevice: boolean;
}

const GamesTable = ({ games, gameStatus, hasSmallDevice }: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const gamesToShow = games.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <TableContainer>
      <Table size={hasSmallDevice ? 'small' : 'medium'}>
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
          {gamesToShow.map((game) => (
            <GameRow
              key={game.gameId}
              game={game}
              playGame={playGame}
              hasSmallDevice={hasSmallDevice}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={games.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

interface GameRowProps {
  game: GameSummary;
  playGame: (id: number) => void;
  hasSmallDevice: boolean;
}

const GameRow = ({ game, playGame, hasSmallDevice }: GameRowProps) => {
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
        hasSmallDevice={hasSmallDevice}
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
  hasSmallDevice,
}: {
  gameId: number;
  playGame: (id: number) => void;
  gameResult: GameResult;
  hasSmallDevice: boolean;
}) => {
  const textContinue = hasSmallDevice ? 'Continue' : 'Continue playing';
  const textView = hasSmallDevice ? 'View' : 'View game';

  const text = gameResult === 'ongoing' ? textContinue : textView;
  const buttonSize = hasSmallDevice ? 'small' : 'medium';

  return (
    <TableCell>
      <Button
        variant="outlined"
        size={buttonSize}
        onClick={() => playGame(gameId)}
        sx={{ whiteSpace: 'nowrap' }}
        fullWidth={hasSmallDevice}
      >
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

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) => {
  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};

export default GamesTable;
