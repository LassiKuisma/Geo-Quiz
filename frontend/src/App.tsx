import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import GameView from './components/GameView';
import { useState } from 'react';

const App = () => {
  const [gameId, setGameId] = useState<undefined | number>(undefined);
  const navigate = useNavigate();

  const generateGameId = async () => {
    console.log('starting new game');
    setTimeout(() => {
      const id = Math.floor(Math.random() * 10);
      console.log('new id set');

      setGameId(id);
    }, 1000);
  };

  const startNewGameClicked = () => {
    setGameId(undefined);
    navigate('/game');
    generateGameId();
  };

  const resumeCurrentGame = () => {
    if (!gameId) {
      return;
    }
    navigate('/game');
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
                currentGameId={gameId}
              />
            }
          />
          <Route path="game" element={<GameView gameId={gameId} />} />
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
