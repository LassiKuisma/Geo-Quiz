import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
}

const NavigationBar = ({ loggedInUser }: AppBarProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box display={'flex'}>
            {pages.map((page) => (
              <AppBarButton key={page.name} text={page.name} linkTo={page.to} />
            ))}
          </Box>
          <LoginItems loggedInUser={loggedInUser} />
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

const LoginItems = ({ loggedInUser }: { loggedInUser?: string }) => {
  const logout = () => {
    console.log('logging out...');
  };

  return (
    <Box display={'flex'} marginLeft={'auto'}>
      {loggedInUser ? (
        <Box display={'flex'} alignItems="center">
          <Typography sx={{ my: 1, color: 'white' }} variant="h6">
            Logged in as {loggedInUser}
          </Typography>
          <Button
            sx={{ my: 1, color: 'white', display: 'block' }}
            onClick={logout}
          >
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

export default NavigationBar;
