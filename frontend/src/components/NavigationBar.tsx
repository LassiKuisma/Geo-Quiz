import { DarkMode, LightMode } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AppTheme } from '../types';

interface Page {
  name: string;
  to: string;
}

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
    name: 'List of countries',
    to: '/countries',
  },
];

interface AppBarProps {
  loggedInUser?: string;
  setUser: (_: undefined) => void;
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
}

const NavigationBar = ({
  loggedInUser,
  setUser,
  theme,
  switchToTheme,
}: AppBarProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Box display={'flex'}>
            {pages.map((page) => (
              <AppBarButton key={page.name} text={page.name} linkTo={page.to} />
            ))}
          </Box>
          <LoginItems loggedInUser={loggedInUser} setUser={setUser} />
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            sx={{ marginX: 1 }}
          />
          <ThemeSelect theme={theme} switchToTheme={switchToTheme} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

interface AppBarButtonProps {
  text: string;
  linkTo: string;
}

const AppBarButton = ({ text, linkTo }: AppBarButtonProps) => {
  return (
    <Button
      sx={{ my: 1, color: 'white', display: 'block' }}
      component={Link}
      to={linkTo}
    >
      {text}
    </Button>
  );
};

interface LoginProps {
  loggedInUser?: string;
  setUser: (_: undefined) => void;
}

const LoginItems = ({ loggedInUser, setUser }: LoginProps) => {
  const logout = () => {
    setUser(undefined);
  };

  return (
    <Box display={'flex'} marginLeft={'auto'}>
      {loggedInUser ? (
        <Box display={'flex'} alignItems="center">
          <Typography>Logged in as {loggedInUser}</Typography>
          <Button color="inherit" onClick={logout}>
            LOG OUT
          </Button>
        </Box>
      ) : (
        <>
          <AppBarButton text="Create account" linkTo="/create-account" />
          <AppBarButton text="Log in" linkTo="/login" />
        </>
      )}
    </Box>
  );
};

interface ThemeProps {
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
}

const ThemeSelect = ({ theme, switchToTheme }: ThemeProps) => {
  return (
    <Box display="flex" alignItems="center">
      <LightMode />
      <Switch
        aria-label="theme switch"
        checked={theme === 'dark'}
        onChange={(e) => {
          const newTheme = e.target.checked ? 'dark' : 'light';
          switchToTheme(newTheme);
        }}
      />
      <DarkMode />
    </Box>
  );
};

export default NavigationBar;
