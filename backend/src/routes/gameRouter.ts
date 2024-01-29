import express from 'express';
import { getCountry } from '../services/countryService';
import {
  generateGame,
  getGame,
  getGamesFromUser,
  loadGame,
  saveMove,
} from '../services/gameService';

import { canPostMoves, extractUser } from '../util/authentication';
import { compareCountries, getHints } from '../util/country';
import { defaultThresholds } from '../util/gameSettings';
import { isDifficulty, isNumber } from '../util/utils';

import {
  Difficulty,
  GameLoaded,
  GameSummary,
  MoveResult,
} from '../../../common/api';

const router = express.Router();

router.post('/newgame', async (req, res) => {
  let difficulty: Difficulty = 'easy';

  const rDifficulty: unknown = req.body.difficulty;
  if (rDifficulty !== undefined) {
    // only throw error if invalid difficulty is given. No difficulty given -> use default
    if (!isDifficulty(rDifficulty)) {
      return res.status(400).send('invalid difficulty');
    }

    difficulty = rDifficulty;
  }

  // user id can be added to games, but it's not required
  // only return error if token is invalid or user missing (token missing is ok)
  const userResult = await extractUser(req);
  if (userResult.k === 'error') {
    return res.status(500).send(userResult.message);
  }

  if (userResult.k === 'invalid-token' || userResult.k === 'user-not-found') {
    return res
      .status(400)
      .send('Invalid token. Please log out and try to re-login.');
  }

  const user = userResult.k === 'ok' ? userResult.value : undefined;

  const gameResult = await generateGame(user, difficulty);
  if (gameResult.k === 'error') {
    return res.status(500).send(gameResult.message);
  }

  const newGame: GameLoaded = gameResult.value;
  return res.json(newGame);
});

router.post('/move', async (req, res) => {
  const body: unknown = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).send('Malformed request');
  }

  if (!('gameId' in body) || !isNumber(body.gameId)) {
    return res.status(400).send('Game id missing or invalid');
  }
  if (!('countryId' in body) || !isNumber(body.countryId)) {
    return res.status(400).send('Country id missing or invalid');
  }

  const gameResult = await getGame(body.gameId);
  if (gameResult.k === 'error') {
    return res.status(gameResult.statusCode).send(gameResult.message);
  }
  const game = gameResult.value;

  const userResult = await extractUser(req);
  if (userResult.k === 'error') {
    return res.status(500).send(userResult.message);
  }
  if (userResult.k === 'invalid-token' || userResult.k === 'user-not-found') {
    return res
      .status(400)
      .send('Invalid token. Please log out and try to re-login.');
  }
  const user = userResult.k === 'ok' ? userResult.value : undefined;

  const canPostMove = canPostMoves(user?.id, game.owner?.id);
  if (!canPostMove) {
    return res.status(403).send("You don't have permission to this game");
  }

  const countryResult = await getCountry(body.countryId);
  if (countryResult.k === 'error' || !countryResult.value) {
    return res.status(400).send(`Country with id ${body.countryId} not found`);
  }

  const playerGuess = countryResult.value;
  const correctAnswer = game.answer;

  const comparison = compareCountries(
    playerGuess,
    correctAnswer,
    game.difficulty
  );
  const hints = getHints(game.guesses, correctAnswer, defaultThresholds);

  const moveResult: MoveResult = {
    move: {
      guessedCountry: playerGuess,
      correct: playerGuess.id === correctAnswer.id,
      comparison,
      timestamp: Date.now(),
    },
    hints,
  };

  const moveSaved = await saveMove(game.gameId, playerGuess.id);
  if (moveSaved.k === 'error') {
    return res.status(500).send(moveSaved.message);
  }

  return res.status(200).send(moveResult);
});

router.get('/load/:id', async (req, res) => {
  const gameId = parseInt(req.params.id);
  if (isNaN(gameId)) {
    return res.status(400).send('Invalid game id');
  }

  const result = await loadGame(gameId);
  if (result.k === 'error') {
    return res.status(result.statusCode).send(result.message);
  }

  const game: GameLoaded = result.value;
  return res.status(200).send(game);
});

router.get('/mygames', async (req, res) => {
  const userResult = await extractUser(req);
  if (userResult.k === 'error') {
    return res.status(500).send(userResult.message);
  }
  if (userResult.k === 'invalid-token' || userResult.k === 'user-not-found') {
    return res
      .status(400)
      .send('Invalid token. Please log out and try to re-login.');
  }
  if (userResult.k === 'token-missing') {
    return res.status(403).send('Not logged in');
  }

  const user = userResult.value;
  const gamesResult = await getGamesFromUser(user.id);
  if (gamesResult.k === 'error') {
    return res.status(500).send(gamesResult.message);
  }

  const games: Array<GameSummary> = gamesResult.value;
  return res.status(200).send(games);
});

export default router;
