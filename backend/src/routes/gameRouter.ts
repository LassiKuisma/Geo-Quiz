import express from 'express';
import { isNumber } from '../util/utils';
import { getAllCountries, getCountry } from '../services/countryService';
import { Country, MoveResult, NewGame } from '../util/types';
import { compareCountries, getHints } from '../util/country';
import { defaultThresholds } from '../util/gameSettings';

const router = express.Router();

interface Game {
  gameId: number;
  answer: Country['id'];
  guesses: number;
}

const activeGames = new Map<number, Game>();

const generateGame = (countries: Array<Country>): Game => {
  const id = activeGames.size + 1;

  const index = Math.floor(Math.random() * countries.length);
  const countryId = countries[index].id;

  return {
    gameId: id,
    answer: countryId,
    guesses: 0,
  };
};

router.post('/newgame', async (_req, res) => {
  const result = await getAllCountries();
  if (result.k === 'error') {
    return res.status(500).send(result.message);
  }

  const countries = result.value;
  if (countries.length === 0) {
    console.log('Error creating game: no countries found');
    return res.status(500).send('Failed to create new game.');
  }

  const game = generateGame(countries);
  activeGames.set(game.gameId, game);

  const newGame: NewGame = {
    gameId: game.gameId,
    countries,
    hints: getHints(0, countries[game.answer], defaultThresholds),
  };

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

  const game = activeGames.get(body.gameId);
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

  game.guesses += 1;

  return res.status(200).send(moveResult);
});

export default router;
