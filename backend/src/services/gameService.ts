import { CountryModel, GameModel } from '../models';

import { Game, NewGame, Result } from '../util/types';
import { defaultThresholds } from '../util/gameSettings';
import {
  CountryJoined,
  countryOptions,
  getHints,
  modelToCountry,
} from '../util/country';
import { error, ok } from '../util/utils';

import { getAllCountries } from './countryService';

const MAX_RETRIES = 10;

export const generateGame = async (): Promise<Result<NewGame>> => {
  const countriesResult = await getAllCountries();
  if (countriesResult.k === 'error') {
    const msg = `Failed to create game, fetching countries failed: ${countriesResult.message}`;
    return error(msg);
  }

  const countries = countriesResult.value;
  if (countries.length === 0) {
    console.log('Error creating game: no countries found');
    const msg = 'Failed to create new game: no countries found';
    return error(msg);
  }

  for (let n = 0; n < MAX_RETRIES; n++) {
    const id = Math.floor(Math.random() * 100000);

    const index = Math.floor(Math.random() * countries.length);
    const country = countries[index];
    const countryId = country.id;

    try {
      const created = await GameModel.create({
        gameId: id,
        countryId,
      });

      const newGame = {
        gameId: created.gameId,
        countries,
        hints: getHints(0, country, defaultThresholds),
      };

      return ok(newGame);
    } catch (error) {
      console.log(
        `Failed to create new game (attempt ${n + 1}/${MAX_RETRIES})`
      );
    }
  }

  const msg = 'Failed to create a new game';
  return error(msg);
};

export const getGame = async (id: number): Promise<Game | undefined> => {
  try {
    const result = (await GameModel.findByPk(id, {
      include: {
        model: CountryModel,
        ...countryOptions,
      },
    })) as (GameModel & { country: CountryJoined }) | null;

    if (!result) {
      return undefined;
    }

    const country = modelToCountry(result.country);
    if (!country) {
      return undefined;
    }

    const game: Game = {
      gameId: result.gameId,
      answer: country,
      guesses: result.guessCount,
    };
    return game;
  } catch (error) {
    return undefined;
  }
};

export const increaseGuessCount = async (id: number): Promise<Result<void>> => {
  try {
    const game = await GameModel.findByPk(id);
    if (!game) {
      return error('Game not found');
    }

    game.guessCount += 1;
    await game.save();

    return ok(undefined);
  } catch (err) {
    console.log('Error updating guess count:', err);
    return error('Error updating guess count');
  }
};
