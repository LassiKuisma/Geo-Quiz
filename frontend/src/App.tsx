import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import GameView from './components/GameView';
import { useState } from 'react';
import { startNewGame } from './services/gameService';
import { Country, GameObject, GameStatus, Move } from './types';
import CountryList from './components/CountryList';
import LoginPage from './components/LoginPage';

const App = () => {
  const [game, setGame] = useState<GameStatus>(undefined);
  const [countries, setCountries] = useState<undefined | Array<Country>>(
    undefined
  );
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
        <Route path="/" element={<Layout />}>
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
          <Route path="login" element={<LoginPage />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
};

const Layout = () => {
  return (
    <div>
      <NavigationBar />
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
