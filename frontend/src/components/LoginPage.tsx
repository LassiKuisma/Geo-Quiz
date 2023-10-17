import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { tryLogin } from '../services/loginService';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const togglePasswordVisible = () => {
    setShowPassword((show) => !show);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(undefined);

    console.log('logging in...');
    const result = await tryLogin(username, password);
    if (result.k === 'error') {
      setErrorMessage(`Error logging in: ${result.message}`);
      return;
    }

    setUsername('');
    setPassword('');

    const login = result.value;
    console.log('login result:', login);
  };

  return (
    <form onSubmit={handleLogin}>
      <Box width={400} margin={1}>
        <Typography variant="h4" fontWeight="bold" marginY={2}>
          Log in
        </Typography>

        <ErrorDisplay message={errorMessage} />

        <FormControl variant="outlined" fullWidth sx={{ marginY: 1 }}>
          <InputLabel htmlFor="username-input">Username</InputLabel>
          <OutlinedInput
            id="username-input"
            label="Username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth sx={{ marginY: 1 }}>
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <OutlinedInput
            id="password-input"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisible}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </FormControl>

        <Box display="flex" justifyContent="end" marginY={1}>
          <Button type="submit" variant="contained" size="large">
            Log in
          </Button>
        </Box>
      </Box>
    </form>
  );
};

const ErrorDisplay = ({ message }: { message?: string }) => {
  return (
    <Box marginY={2}>
      {message ? (
        <Alert variant="outlined" severity="error">
          {message}
        </Alert>
      ) : null}
    </Box>
  );
};

export default LoginPage;
