import { CountryModel, GameModel, MoveModel, UserModel } from '../models';
import { compareCountries, getHints } from '../util/country';
import { defaultThresholds } from '../util/gameSettings';
import { CountryJoined, countryOptions, modelToCountry } from '../util/models';
import { error, ok } from '../util/utils';
import { getAllCountries } from './countryService';

import { Game, Ok, Result, User } from '../types/internal';
import { GameLoaded, GameMove, GameSummary, NewGame } from '../types/shared';

export const generateGame = async (
  user?: UserModel
): Promise<Result<NewGame>> => {
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

  const index = Math.floor(Math.random() * countries.length);
  const country = countries[index];
  const countryId = country.id;

  try {
    const userId = user ? user.id : undefined;

    const created = await GameModel.create({
      countryId,
      userId,
    });

    const newGame = {
      gameId: created.gameId,
      countries,
      hints: getHints(0, country, defaultThresholds),
    };

    return ok(newGame);
  } catch (err) {
    const msg = 'Db error';
    return error(msg);
  }
};

type GameError = {
  k: 'error';
  statusCode: number;
  message: string;
};

type ResultGame<T> = Ok<T> | GameError;

type MoveJoined = MoveModel & { country: CountryJoined };

type GameJoined = GameModel & { country: CountryJoined } & {
  user?: UserModel;
} & { moves: Array<MoveJoined> };

export const getGame = async (id: number): Promise<ResultGame<Game>> => {
  try {
    const result = (await GameModel.findByPk(id, {
      include: [
        {
          model: CountryModel,
          ...countryOptions(),
        },
        {
          model: UserModel,
        },
        {
          model: MoveModel,
          attributes: ['moveId'],
        },
      ],
    })) as GameJoined | null;

    if (!result) {
      return gameNotFound(id);
    }

    const country = modelToCountry(result.country);
    if (!country) {
      console.log(
        `Error fetching game id=${id}: query returned faulty sql model.`
      );

      return dbError();
    }

    const owner: User | undefined = !result.user
      ? undefined
      : {
          username: result.user.username,
          id: result.userId,
        };

    const game: Game = {
      gameId: result.gameId,
      answer: country,
      guesses: result.moves.length,
      owner,
    };

    return ok(game);
  } catch (err) {
    console.log(`Error fetching game id=${id}:`, err);

    return dbError();
  }
};

export const saveMove = async (
  gameId: number,
  countryId: number
): Promise<Result<undefined>> => {
  try {
    await MoveModel.create({
      gameId,
      guessedCountry: countryId,
    });

    return ok(undefined);
  } catch (err) {
    return dbError();
  }
};

export const loadGame = async (
  gameId: number
): Promise<ResultGame<GameLoaded>> => {
  try {
    const result = (await GameModel.findByPk(gameId, {
      include: [
        {
          model: CountryModel,
          ...countryOptions(),
        },
        {
          model: UserModel,
        },
        {
          model: MoveModel,
          include: [
            {
              model: CountryModel,
              ...countryOptions(),
            },
          ],
        },
      ],
    })) as GameJoined | null;

    if (!result) {
      return gameNotFound(gameId);
    }

    const correctAnswer = modelToCountry(result.country);
    if (!correctAnswer) {
      return dbError();
    }

    const moves = result.moves
      .map((move) => {
        const playerGuess = modelToCountry(move.country);
        if (!playerGuess) {
          return undefined;
        }

        const result: GameMove = {
          guessedCountry: playerGuess,
          correct: playerGuess.id === correctAnswer.id,
          comparison: compareCountries(playerGuess, correctAnswer),
        };

        return result;
      })
      .filter((move): move is GameMove => !!move);

    const guessedIds = moves.reduce((set, move) => {
      set.add(move.guessedCountry.id);
      return set;
    }, new Set<number>());

    const isGameOver = guessedIds.has(correctAnswer.id);

    const countriesResult = await getAllCountries();
    if (countriesResult.k === 'error') {
      return dbError();
    }

    const countries = countriesResult.value.filter(
      (country) => !guessedIds.has(country.id)
    );

    const gameWithMoves: GameLoaded = {
      gameId,
      moves,
      hints: getHints(moves.length, correctAnswer, defaultThresholds),
      isGameOver,
      countries,
    };

    return ok(gameWithMoves);
  } catch (err) {
    return dbError();
  }
};

type GameModelWithMoves = GameModel & { moves: Array<MoveModel> };

export const getGamesFromUser = async (
  userId: number
): Promise<Result<Array<GameSummary>>> => {
  try {
    const games = (await GameModel.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: MoveModel,
          attributes: ['moveId'],
        },
      ],
    })) as Array<GameModelWithMoves>;

    const gamesWithMoveCount = games.map((game) => {
      return {
        gameId: game.gameId,
        guessCount: game.moves.length,
      };
    });

    return ok(gamesWithMoveCount);
  } catch (err) {
    return dbError();
  }
};

const gameNotFound = (id: number): GameError => {
  return {
    k: 'error',
    statusCode: 404,
    message: `Game with id ${id} not found`,
  };
};

const dbError = (): GameError => {
  return {
    k: 'error',
    statusCode: 500,
    message: 'Unknown database error',
  };
};
