import { DarkMode, LightMode } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { AppTheme, Page } from '../../types/app';

interface Props {
  pages: Array<Page>;
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
  loggedInUser: string | undefined;
  setUser: (_: undefined) => void;
}

const MobileNavBar = ({
  pages,
  theme,
  switchToTheme,
  loggedInUser,
  setUser,
}: Props) => {
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!loggedInUser;
  const pagesToShow = pages.filter((page) => {
    const requireLogin = page.loginRequired || false;

    const hide = requireLogin && !isLoggedIn;
    return !hide;
  });

  return (
    <>
      <TopBar setOpen={setOpen} user={loggedInUser} />
      <SideBar
        pages={pagesToShow}
        open={open}
        setOpen={setOpen}
        theme={theme}
        switchToTheme={switchToTheme}
        user={loggedInUser}
        setUser={setUser}
      />
    </>
  );
};

interface TopBarProps {
  setOpen: (o: boolean) => void;
  user: string | undefined;
}

const TopBar = ({ setOpen, user }: TopBarProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <MenuIcon />
        </IconButton>
        {user && <Typography>Logged in as {user}</Typography>}
      </Toolbar>
    </AppBar>
  );
};

interface SideBarProps {
  pages: Array<Page>;
  open: boolean;
  setOpen: (o: boolean) => void;
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
  user: string | undefined;
  setUser: (_: undefined) => void;
}

const SideBar = ({
  pages,
  open,
  setOpen,
  theme,
  switchToTheme,
  user,
  setUser,
}: SideBarProps) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box width="auto" role="presentation">
        <List>
          <Pages pages={pages} setOpen={setOpen} />
          <ThemeSwitch theme={theme} switchToTheme={switchToTheme} />
          <Divider sx={{ marginY: 2 }} />
          <AccountButtons
            loggedIn={!!user}
            setOpen={setOpen}
            setUser={setUser}
          />
        </List>
      </Box>
    </Drawer>
  );
};

const Pages = ({
  pages,
  setOpen,
}: {
  pages: Array<Page>;
  setOpen: (o: boolean) => void;
}) => {
  return (
    <>
      {pages.map(({ name, to }) => (
        <React.Fragment key={name}>
          <ListItem
            onClick={() => setOpen(false)}
            onKeyDown={() => setOpen(false)}
          >
            <ListItemButton component={Link} to={to}>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        </React.Fragment>
      ))}
    </>
  );
};

interface AccountButtonsProps {
  loggedIn: boolean;
  setOpen: (_: boolean) => void;
  setUser: (_: undefined) => void;
}

const AccountButtons = ({
  loggedIn,
  setOpen,
  setUser,
}: AccountButtonsProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const logout = () => {
    setUser(undefined);
    setOpenDialog(false);
    setOpen(false);
  };

  return loggedIn ? (
    <>
      <ListItem>
        <ListItemButton
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <ListItemText primary="Log out" />
        </ListItemButton>
      </ListItem>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Log out?</DialogTitle>
        <Box>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
          <Button onClick={logout}>Yes</Button>
        </Box>
      </Dialog>
    </>
  ) : (
    <>
      <ListItem onClick={() => setOpen(false)} onKeyDown={() => setOpen(false)}>
        <ListItemButton component={Link} to={'/create-account'}>
          <ListItemText primary={'Create account'} />
        </ListItemButton>
      </ListItem>
      <ListItem onClick={() => setOpen(false)} onKeyDown={() => setOpen(false)}>
        <ListItemButton component={Link} to={'/login'}>
          <ListItemText primary={'Log in'} />
        </ListItemButton>
      </ListItem>
    </>
  );
};

interface ThemeProps {
  theme: AppTheme;
  switchToTheme: (newTheme: AppTheme) => void;
}

const ThemeSwitch = ({ theme, switchToTheme }: ThemeProps) => {
  return (
    <ListItem>
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
    </ListItem>
  );
};

export default MobileNavBar;
