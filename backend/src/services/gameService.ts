import { CountryModel, GameModel } from '../models';

import { Game, NewGame, Ok, Result } from '../util/types';
import { defaultThresholds } from '../util/gameSettings';
import { getHints } from '../util/country';
import { countryOptions, CountryJoined, modelToCountry } from '../util/models';
import { error, ok } from '../util/utils';

import { getAllCountries } from './countryService';

const MAX_RETRIES = 10;

export const generateGame = async (): Promise<Result<NewGame>> => {
  const countriesResult = await getAllCountries();
  if (countriesResult.k === 'error') {
    const msg = 'unable to fetch country data';
    return error(msg);
  }

  const countries = countriesResult.value;
  if (countries.length === 0) {
    console.log('Error creating game: no countries found');
    const msg = 'no countries found';
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

  console.log('unable to find a unique id for game');
  const msg = 'uknown error';
  return error(msg);
};

type GameError = {
  k: 'error';
  statusCode: number;
  message: string;
};

type ResultGame<T> = Ok<T> | GameError;

export const getGame = async (id: number): Promise<ResultGame<Game>> => {
  try {
    const result = (await GameModel.findByPk(id, {
      include: {
        model: CountryModel,
        ...countryOptions,
      },
    })) as (GameModel & { country: CountryJoined }) | null;

    if (!result) {
      return {
        k: 'error',
        statusCode: 404,
        message: `Game with id ${id} not found`,
      };
    }

    const country = modelToCountry(result.country);
    if (!country) {
      console.log(
        `Error fetching game id=${id}: query returned faulty sql model.`
      );

      return {
        k: 'error',
        statusCode: 500,
        message: 'Unknown database error',
      };
    }

    const game: Game = {
      gameId: result.gameId,
      answer: country,
      guesses: result.guessCount,
    };

    return ok(game);
  } catch (err) {
    console.log(`Error fetching game id=${id}:`, err);

    return {
      k: 'error',
      statusCode: 500,
      message: 'Unknown database error',
    };
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
