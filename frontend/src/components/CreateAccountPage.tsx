import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { tryCreateAccount } from '../services/accountService';

import { UserWithToken } from '../../../common/api';

const minLength = 3;
const maxLength = 100;

interface Props {
  setUser: (uwt: UserWithToken) => void;
}

const CreateAccountPage = ({ setUser }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waiting, setWaiting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const [usernameError, setUsernameError] = useState<string | undefined>(
    undefined
  );
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );

  const navigate = useNavigate();

  const checkUsernameLength = () => {
    if (username.length < minLength) {
      setUsernameError(`Username must be at least ${minLength} characters`);
    } else if (username.length > maxLength) {
      setUsernameError(`Username can't be over ${maxLength} characters`);
    } else {
      setUsernameError(undefined);
    }
  };

  const checkPasswordLength = () => {
    if (password.length < minLength) {
      setPasswordError(`Password must be at least ${minLength} characters`);
    } else if (password.length > maxLength) {
      setPasswordError(`Password can't be over ${maxLength} characters`);
    } else {
      setPasswordError(undefined);
    }
  };

  const togglePasswordVisible = () => {
    setShowPassword((show) => !show);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setErrorMessage(undefined);

    if (usernameError) {
      setErrorMessage(usernameError);
      return;
    }

    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    setErrorMessage(undefined);
    setWaiting(true);
    const result = await tryCreateAccount(username, password);
    setWaiting(false);

    if (result.k === 'error') {
      setErrorMessage(result.message);
      return;
    }

    setUsername('');
    setPassword('');

    setUser(result.value);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box width="500px" maxWidth="100%" padding="0.75em">
        <Typography variant="h4" fontWeight="bold" marginY={2}>
          Create account
        </Typography>
        <Box>
          Already have an account? <Link to="/login">Log in</Link> instead.
        </Box>

        <ErrorDisplay message={errorMessage} />

        <FormControl
          variant="outlined"
          fullWidth
          disabled={waiting}
          error={!!usernameError}
        >
          <InputLabel htmlFor="username-input">Username</InputLabel>
          <OutlinedInput
            id="username-input"
            label="Username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            onBlur={checkUsernameLength}
          />

          <FormHelperText>{usernameError ? usernameError : ' '}</FormHelperText>
        </FormControl>

        <FormControl
          variant="outlined"
          fullWidth
          disabled={waiting}
          error={!!passwordError}
        >
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
            onBlur={checkPasswordLength}
          />

          <FormHelperText>{passwordError ? passwordError : ' '}</FormHelperText>
        </FormControl>

        <Box display="flex" justifyContent="end">
          {waiting && <CircularProgress sx={{ marginX: 2 }} />}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={waiting}
          >
            Create account
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

export default CreateAccountPage;
