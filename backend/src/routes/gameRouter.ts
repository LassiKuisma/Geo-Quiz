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

const router = express.Router();

router.post('/newgame', async (_req, res) => {
  const gameResult = await generateGame();
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

  const game = await getGame(body.gameId);
  if (!game) {
    return res.status(404).send(`Game with id ${body.gameId} not found`);
  }

  const resultPlayer = await getCountry(body.countryId);
  if (resultPlayer.k === 'error' || !resultPlayer.value) {
    return res.status(400).send(`Country with id ${body.countryId} not found`);
  }

  const resultAnswer = await getCountry(game.answer);
  if (resultAnswer.k === 'error' || !resultAnswer.value) {
    return res.status(500).send('Something went wrong.');
  }

  const playerGuess = resultPlayer.value;
  const correctAnswer = resultAnswer.value;

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
