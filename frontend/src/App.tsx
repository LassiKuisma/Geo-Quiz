import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import GameView from './components/GameView';
import { useState } from 'react';
import { startNewGame } from './services/gameService';
import { Country, GameObject, GameStatus, Move, UserWithToken } from './types';
import CountryList from './components/CountryList';
import LoginPage from './components/LoginPage';
import CreateAccountPage from './components/CreateAccountPage';

const App = () => {
  const [game, setGame] = useState<GameStatus>(undefined);
  const [countries, setCountries] = useState<undefined | Array<Country>>(
    undefined
  );
  const [user, setUser] = useState<UserWithToken | undefined>(undefined);
  const navigate = useNavigate();

  const startNewGameClicked = async () => {
    setGame({ k: 'loading' });
    navigate('/game');
    const newGameResult = await startNewGame();
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
      guesses: new Array<Move>(),
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

  const hasActiveGame = game?.k === 'ok';

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Layout loggedInUser={user?.username} setUser={setUser} />}
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
              />
            }
          />
          <Route
            path="countries"
            element={
              <CountryList countries={countries} setCountries={setCountries} />
            }
          />
          <Route path="login" element={<LoginPage setUser={setUser} />} />
          <Route path="create-account" element={<CreateAccountPage />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
};

interface LayoutProps {
  loggedInUser?: string;
  setUser: (_: undefined) => void;
}

const Layout = ({ loggedInUser, setUser }: LayoutProps) => {
  return (
    <div>
      <NavigationBar loggedInUser={loggedInUser} setUser={setUser} />
      <hr />
      <Outlet />
    </div>
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
