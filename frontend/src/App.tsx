import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';

import CountryList from './components/CountryList';
import CreateAccountPage from './components/CreateAccountPage';
import DifficultySelect from './components/DifficultySelect';
import GameView from './components/GameView';
import MobileWorldMap from './components/GameView/MobileWorldMap';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import NavigationBar from './components/NavigationBar';
import UserGamesView from './components/UserGames';

import {
  CURRENT_GAME_ID,
  PREFERRED_THEME_PATH,
  USER_STORAGE_PATH,
} from './constants';
import { startNewGame } from './services/gameService';
import { createStatusManager } from './util/gameUtil';
import { userFromJson } from './util/utils';

import { Country, Difficulty, UserWithToken } from '../../common/api';
import { AppTheme } from './types/app';
import { GameObject, GameStatus } from './types/game';

const typography = {
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
};

const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
    },
    typography,
  })
);

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
    },
    typography,
  })
);

const userFromLocalStorage = (): UserWithToken | undefined => {
  const storedUser = window.localStorage.getItem(USER_STORAGE_PATH);
  if (!storedUser) {
    return undefined;
  }

  const parsed = userFromJson(storedUser);
  if (parsed.k === 'error') {
    console.log('Failed to get user from local storage:', parsed.message);
    return undefined;
  }

  return parsed.value;
};

const gameIdFromLocalStorage = (): number | undefined => {
  const activeGameId = window.localStorage.getItem(CURRENT_GAME_ID);
  if (!activeGameId) {
    return undefined;
  }

  const id = parseInt(activeGameId);
  if (isNaN(id)) {
    console.log(`Invalid game id in local storage: ${activeGameId}`);
    return undefined;
  }

  return id;
};

const App = () => {
  const [game, setGame] = useState<GameStatus>(undefined);
  const [countries, setCountries] = useState<undefined | Array<Country>>(
    undefined
  );
  const [user, setUser] = useState<UserWithToken | undefined>(
    userFromLocalStorage()
  );
  const navigate = useNavigate();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const savedTheme = window.localStorage.getItem(PREFERRED_THEME_PATH);
  const preferredTheme =
    savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : prefersDarkMode
      ? 'dark'
      : 'light';
  const [theme, setTheme] = useState<AppTheme>(preferredTheme);

  const hasSmallDevice = !useMediaQuery('(min-width: 768px)');

  const gameStatus = useMemo(() => createStatusManager(setGame), []);

  if (!game) {
    const id = gameIdFromLocalStorage();
    if (id) {
      gameStatus.setLoadableFromId(id);
    }
  }

  const startNewGameClicked = async (difficulty: Difficulty) => {
    gameStatus.setLoading();
    navigate('/game');
    const newGameResult = await startNewGame(user?.token, difficulty);
    if (newGameResult.k === 'error') {
      gameStatus.setError(newGameResult.message);
      return;
    }
    const newGame = newGameResult.value;

    newGame.countries.sort((a, b) => a.name.localeCompare(b.name));

    const gameObj: GameObject = {
      gameId: newGame.gameId,
      countries: newGame.countries,
      guesses: [],
      isSubmittingMove: false,
      hints: newGame.hints,
      gameOver: false,
      difficulty: newGame.difficulty,
    };

    gameStatus.setGameObject(gameObj);
  };

  const resumeCurrentGame = () => {
    if (!game) {
      return;
    }
    navigate('/game');
  };

  const handleLogin = (user: UserWithToken) => {
    setUser(user);
    window.localStorage.setItem(USER_STORAGE_PATH, JSON.stringify(user));

    gameStatus.clear();
  };

  const handleLogout = () => {
    setUser(undefined);
    window.localStorage.removeItem(USER_STORAGE_PATH);

    gameStatus.clear();
  };

  const switchToTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    window.localStorage.setItem(PREFERRED_THEME_PATH, newTheme);
  };

  const hasActiveGame = game?.k === 'ok' || game?.k === 'load-from-id';
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              hasSmallDevice={hasSmallDevice}
              loggedInUser={user?.username}
              setUser={handleLogout}
              theme={theme}
              switchToTheme={switchToTheme}
            />
          }
        >
          <Route
            index
            element={
              <HomePage
                startNewGame={startNewGameClicked}
                resumeCurrentGame={resumeCurrentGame}
                hasActiveGame={hasActiveGame}
              />
            }
          />
          <Route
            path="game"
            element={
              <GameView
                game={game}
                gameStatus={gameStatus}
                startNewGame={startNewGameClicked}
                user={user}
                hasSmallDevice={hasSmallDevice}
              />
            }
          />
          <Route
            path="countries"
            element={
              <CountryList
                countries={countries}
                setCountries={setCountries}
                hasSmallDevice={hasSmallDevice}
              />
            }
          />
          <Route path="login" element={<LoginPage setUser={handleLogin} />} />
          <Route
            path="create-account"
            element={<CreateAccountPage setUser={handleLogin} />}
          />
          <Route
            path="my-games"
            element={
              <UserGamesView
                user={user}
                gameStatus={gameStatus}
                hasSmallDevice={hasSmallDevice}
              />
            }
          />
          <Route
            path="game/map"
            element={<MobileWorldMap gameStatus={game} />}
          />
          <Route
            path="select-difficulty"
            element={<DifficultySelect startNewGame={startNewGameClicked} />}
          />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

interface LayoutProps {
  hasSmallDevice: boolean;
  loggedInUser?: string;
  setUser: (_: undefined) => void;
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
}

const Layout = ({
  hasSmallDevice,
  loggedInUser,
  setUser,
  theme,
  switchToTheme,
}: LayoutProps) => {
  const navbarHeight = '56px';

  return (
    <Box height="100vh">
      <NavigationBar
        hasSmallDevice={hasSmallDevice}
        loggedInUser={loggedInUser}
        setUser={setUser}
        theme={theme}
        switchToTheme={switchToTheme}
      />
      <Box
        width="100vw"
        maxWidth="1024px"
        margin="auto"
        padding="0.5rem"
        paddingTop="2rem"
        height={`calc(100vh - ${navbarHeight})`}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

const NoMatch = () => {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
};

export default App;
