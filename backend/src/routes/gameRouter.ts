import express from 'express';
import { isNumber } from '../util/utils';
import { getCountry } from '../services/countryService';
import { MoveResult } from '../util/types';
import { compareCountries, getHints } from '../util/country';
import { defaultThresholds } from '../util/gameSettings';
import {
  generateGame,
  getGame,
  increaseGuessCount,
} from '../services/gameService';
import { extractUser } from '../util/authentication';

const router = express.Router();

router.post('/newgame', async (req, res) => {
  // user id can be added to games, but it's not required
  // only return error if token is invalid or user missing (token missing is ok)
  const userResult = await extractUser(req);
  if (userResult.k === 'error') {
    return res.status(500).send(userResult.message);
  }

  if (userResult.k === 'invalid-token' || userResult.k === 'user-not-found') {
    return res.status(400).send('Invalid token');
  }

  const user = userResult.k === 'ok' ? userResult.value : undefined;

  const gameResult = await generateGame(user);
  if (gameResult.k === 'error') {
    return res.status(500).send(gameResult.message);
  }

  const newGame = gameResult.value;
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

  const resultPlayer = await getCountry(body.countryId);
  if (resultPlayer.k === 'error' || !resultPlayer.value) {
    return res.status(400).send(`Country with id ${body.countryId} not found`);
  }

  const playerGuess = resultPlayer.value;
  const correctAnswer = game.answer;

  const comparison = compareCountries(playerGuess, correctAnswer);
  const hints = getHints(game.guesses, correctAnswer, defaultThresholds);

  const moveResult: MoveResult = {
    correct: playerGuess.id === correctAnswer.id,
    comparison,
    hints,
  };

  const guessSaved = await increaseGuessCount(game.gameId);
  if (guessSaved.k === 'error') {
    return res.status(500).send(guessSaved.message);
  }

  return res.status(200).send(moveResult);
});

export default router;
