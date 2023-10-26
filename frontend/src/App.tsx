import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';

import CountryList from './components/CountryList';
import CreateAccountPage from './components/CreateAccountPage';
import GameView from './components/GameView';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import NavigationBar from './components/NavigationBar';

import { PREFERRED_THEME_PATH, USER_STORAGE_PATH } from './constants';
import { startNewGame } from './services/gameService';
import { userFromJson } from './util/utils';

import { AppTheme, GameObject, GameStatus } from './types/internal';
import { Country, UserWithToken } from './types/shared';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});

const App = () => {
  const [game, setGame] = useState<GameStatus>(undefined);
  const [countries, setCountries] = useState<undefined | Array<Country>>(
    undefined
  );
  const [user, setUser] = useState<UserWithToken | undefined>(undefined);
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

  useEffect(() => {
    const storedUser = window.localStorage.getItem(USER_STORAGE_PATH);
    if (!storedUser) {
      return;
    }

    const parsed = userFromJson(storedUser);
    if (parsed.k === 'error') {
      console.log('Failed to get user from local storage:', parsed.message);
      return;
    }

    setUser(parsed.value);
  }, []);

  const startNewGameClicked = async () => {
    setGame({ k: 'loading' });
    navigate('/game');
    const newGameResult = await startNewGame(user?.token);
    if (newGameResult.k === 'error') {
      setGame({
        k: 'error',
        message: newGameResult.message,
      });
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
    };

    setGame({
      k: 'ok',
      game: gameObj,
    });
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

    setGame(undefined);
  };

  const handleLogout = () => {
    setUser(undefined);
    window.localStorage.removeItem(USER_STORAGE_PATH);

    setGame(undefined);
  };

  const switchToTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    window.localStorage.setItem(PREFERRED_THEME_PATH, newTheme);
  };

  const hasActiveGame = game?.k === 'ok';
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box>
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
                  setGame={setGame}
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
                />
              }
            />
            <Route path="login" element={<LoginPage setUser={handleLogin} />} />
            <Route
              path="create-account"
              element={<CreateAccountPage setUser={handleLogin} />}
            />

            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Box>
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
  return (
    <Box>
      <NavigationBar
        hasSmallDevice={hasSmallDevice}
        loggedInUser={loggedInUser}
        setUser={setUser}
        theme={theme}
        switchToTheme={switchToTheme}
      />
      <Box width="100vw" maxWidth="1024px" margin="auto">
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
