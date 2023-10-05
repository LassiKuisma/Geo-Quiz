import { AppBar, Box, Button, Toolbar } from '@mui/material';
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

const NavigationBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {pages.map((page) => (
            <Button
              key={page.name}
              sx={{ my: 1, color: 'white', display: 'block' }}
              component={Link}
              to={page.to}
            >
              {page.name}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
