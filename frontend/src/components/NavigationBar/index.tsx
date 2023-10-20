import { AppTheme, Page } from '../../types';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';

const pages: Array<Page> = [
  {
    name: 'Home',
    to: '/',
  },
  {
    name: 'Play',
    to: '/game',
  },
  {
    name: 'Countries',
    to: '/countries',
  },
];

interface AppBarProps {
  hasSmallDevice: boolean;
  loggedInUser: string | undefined;
  setUser: (_: undefined) => void;
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
}

const NavigationBar = ({
  hasSmallDevice,
  loggedInUser,
  setUser,
  theme,
  switchToTheme,
}: AppBarProps) => {
  return hasSmallDevice ? (
    <MobileNavBar
      pages={pages}
      theme={theme}
      switchToTheme={switchToTheme}
      loggedInUser={loggedInUser}
      setUser={setUser}
    />
  ) : (
    <DesktopNavBar
      pages={pages}
      loggedInUser={loggedInUser}
      setUser={setUser}
      theme={theme}
      switchToTheme={switchToTheme}
    />
  );
};

export default NavigationBar;
