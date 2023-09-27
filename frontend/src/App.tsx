import { Routes, Route, Link, Outlet } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
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
