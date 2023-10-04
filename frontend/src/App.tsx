import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import GameView from './components/GameView';
import { useState } from 'react';
import { postMove, startNewGame } from './services/gameService';
import { Country, GameObject, Move } from './types';

const App = () => {
  const [game, setGame] = useState<undefined | GameObject>(undefined);
  const navigate = useNavigate();

  const startNewGameClicked = async () => {
    setGame(undefined);
    navigate('/game');
    const newGame = await startNewGame();
    newGame.countries.sort((a, b) => a.name.localeCompare(b.name));

    const gameObj: GameObject = {
      gameId: newGame.gameId,
      countries: newGame.countries,
      guesses: new Array<Move>(),
      isSubmittingMove: false,
      hints: newGame.hints,
      gameOver: false,
    };

    setGame(gameObj);
  };

  const resumeCurrentGame = () => {
    if (!game) {
      return;
    }
    navigate('/game');
  };

  const sumbitMove = async (country: Country) => {
    if (!game) {
      return;
    }

    setGame({
      ...game,
      isSubmittingMove: true,
    });

    try {
      const result = await postMove(game.gameId, country.id);
      const move: Move = {
        guessedCountry: country,
        result,
      };

      setGame({
        gameId: game.gameId,
        countries: game.countries.filter((c) => c.id !== country.id),
        guesses: [move, ...game.guesses],
        isSubmittingMove: false,
        hints: result.hints,
        gameOver: game.gameOver || result.correct,
      });

      return;
    } catch (error) {
      console.log('error:', error);
      // TODO: error message
      setGame({
        ...game,
        isSubmittingMove: false,
      });
    }
  };

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
                hasActiveGame={!!game}
              />
            }
          />
          <Route
            path="game"
            element={<GameView game={game} submitMove={sumbitMove} />}
          />
          <Route path="first" element={<First />} />
          <Route path="second" element={<Second />} />

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

const First = () => {
  return (
    <div>
      <h2>First page about some stuff</h2>
    </div>
  );
};

const Second = () => {
  return (
    <div>
      <h2>Second page, full of interesting things</h2>
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
