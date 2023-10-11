import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import GameView from './components/GameView';
import { useState } from 'react';
import { postMove, startNewGame } from './services/gameService';
import { Country, GameObject, Move } from './types';
import CountryList from './components/CountryList';

const App = () => {
  const [game, setGame] = useState<undefined | GameObject>(undefined);
  const [countries, setCountries] = useState<undefined | Array<Country>>(
    undefined
  );
  const navigate = useNavigate();

  const startNewGameClicked = async () => {
    setGame(undefined);
    navigate('/game');
    const newGameResult = await startNewGame();
    if (newGameResult.k === 'error') {
      // TODO: display message
      console.log('error starting new game:', newGameResult.message);
      setGame(undefined);
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

    const moveResult = await postMove(game.gameId, country.id);
    if (moveResult.k === 'error') {
      // TODO: display error message
      console.log('error submitting move:', moveResult.message);
      setGame({
        ...game,
        isSubmittingMove: false,
      });
      return;
    }

    const result = moveResult.value;

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
          <Route
            path="countries"
            element={
              <CountryList countries={countries} setCountries={setCountries} />
            }
          />

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
