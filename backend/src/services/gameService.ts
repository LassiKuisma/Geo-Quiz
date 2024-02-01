import { col, where } from 'sequelize';
import { CountryModel, GameModel, MoveModel, UserModel } from '../models';
import { compareCountries, getHints } from '../util/country';
import { defaultThresholds } from '../util/gameSettings';
import logger from '../util/logger';
import { CountryJoined, countryOptions, modelToCountry } from '../util/models';
import {
  difficultyAsNumber,
  difficultyFromNumber,
  getErrorMessage,
} from '../util/utils';
import { getAllCountries } from './countryService';

import {
  Country,
  Difficulty,
  GameLoaded,
  GameMove,
  GameResult,
  GameSummary,
} from '../../../common/api';
import { Ok, Result, error, ok } from '../../../common/result';
import { Game, User } from '../types/internal';

export const generateGame = async (
  user: UserModel | undefined,
  difficulty: Difficulty
): Promise<Result<GameLoaded>> => {
  const countriesResult = await getAllCountries();
  if (countriesResult.k === 'error') {
    const msg = 'unable to fetch country data';
    return error(msg);
  }

  const countries = countriesResult.value;
  if (countries.length === 0) {
    logger.error('Error creating game: no country data in db');
    const msg = 'database error';
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
      difficulty: difficultyAsNumber(difficulty),
    });

    const newGame: GameLoaded = {
      gameId: created.gameId,
      countries,
      hints: getHints(0, country, defaultThresholds),
      isGameOver: false,
      moves: [],
      result: 'ongoing',
      difficulty,
    };

    return ok(newGame);
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error('error creating game: ', msg);

    return dbError();
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
} & { moves: Array<MoveJoined> } & { answer: undefined | MoveModel };

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
      logger.error(
        `Error loading game ${id}: query returned faulty sql model.`
      );

      return dbError();
    }

    const owner: User | undefined = !result.user
      ? undefined
      : {
          username: result.user.username,
          id: result.userId,
        };

    let difficulty = difficultyFromNumber(result.difficulty);
    if (!difficulty) {
      logger.error(
        `Error loading game ${id}, invalid difficulty: '${result.difficulty}'. Defaulting to easy difficulty.`
      );
      difficulty = 'easy';
    }

    const game: Game = {
      gameId: result.gameId,
      answer: country,
      guesses: result.moves.length,
      owner,
      difficulty,
    };

    return ok(game);
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error(`Error loading game ${id}:`, msg);

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
    const msg = getErrorMessage(err);
    logger.error(`Error saving move ${countryId} in game ${gameId}:`, msg);

    return dbError();
  }
};

export const loadGame = async (
  gameId: number
): Promise<ResultGame<GameLoaded>> => {
  try {
    const model = (await GameModel.findByPk(gameId, {
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

    if (!model) {
      return gameNotFound(gameId);
    }

    const correctAnswer = modelToCountry(model.country);
    if (!correctAnswer) {
      logger.error(
        `Error loading game ${gameId}: query returned faulty sql model.`
      );

      return dbError();
    }

    let difficulty = difficultyFromNumber(model.difficulty);
    if (!difficulty) {
      logger.error(
        `Error loading game ${gameId}, invalid difficulty: '${model.difficulty}'. Defaulting to easy difficulty.`
      );
      difficulty = 'easy';
    }

    const { moves, guessedIds } = parseMoveModels(
      model.moves,
      correctAnswer,
      difficulty
    );
    const isGameOver = guessedIds.has(correctAnswer.id);

    const countriesLoaded = await getAllCountries();
    if (countriesLoaded.k === 'error') {
      logger.error(
        `Error loading game ${gameId}: can't fetch country data: ${countriesLoaded.message}`
      );
      return dbError();
    }

    const countries = countriesLoaded.value.filter(
      (country) => !guessedIds.has(country.id)
    );

    const gameResult = isGameOver ? 'completed' : 'ongoing';

    const gameWithMoves: GameLoaded = {
      gameId,
      moves,
      hints: getHints(moves.length, correctAnswer, defaultThresholds),
      isGameOver,
      countries,
      result: gameResult,
      difficulty,
    };

    return ok(gameWithMoves);
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error(`Error loading game ${gameId}:`, msg);

    return dbError();
  }
};

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
          include: [
            {
              model: CountryModel,
              ...countryOptions(),
            },
          ],
          order: [['created_at', 'DESC']],
        },
        {
          model: MoveModel,
          as: 'answer',
          required: false,
          where: where(
            col('games.countryId'),
            '=',
            col('answer.guessedCountry')
          ),
        },
      ],
    })) as Array<GameJoined>;

    const gamesWithMoveCount = games.map((game) => {
      const str = game.created_at ? game.created_at.toString() : undefined;
      let date = undefined;

      if (str) {
        const parsed = Date.parse(str);
        if (!isNaN(parsed)) {
          date = parsed;
        }
      }

      let mostRecent = undefined;
      if (game.moves.length > 0) {
        const lastIndex = game.moves.length - 1;
        const country = modelToCountry(game.moves[lastIndex].country);
        if (country) {
          mostRecent = country;
        }
      }

      const gameOver = !!game.answer;
      const result: GameResult = gameOver ? 'completed' : 'ongoing';

      let difficulty = difficultyFromNumber(game.difficulty);
      if (!difficulty) {
        logger.error(
          `Error loading game ${game.gameId}, invalid difficulty: '${game.difficulty}'. Defaulting to easy difficulty.`
        );
        difficulty = 'easy';
      }

      return {
        gameId: game.gameId,
        guessCount: game.moves.length,
        createdAt: date,
        latestGuess: mostRecent,
        result,
        difficulty,
      };
    });

    return ok(gamesWithMoveCount);
  } catch (err) {
    const msg = getErrorMessage(err);
    logger.error(`error loading user ${userId} games:`, msg);

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

const parseMoveModels = (
  moveModels: Array<MoveJoined>,
  correctAnswer: Country,
  difficulty: Difficulty
): { moves: Array<GameMove>; guessedIds: Set<number> } => {
  const moves = moveModels
    .map((move) => {
      const playerGuess = modelToCountry(move.country);
      if (!playerGuess) {
        return undefined;
      }

      const str = move.created_at ? move.created_at.toString() : undefined;
      let date = undefined;

      if (str) {
        const parsed = Date.parse(str);
        if (!isNaN(parsed)) {
          date = parsed;
        }
      }

      const result: GameMove = {
        guessedCountry: playerGuess,
        correct: playerGuess.id === correctAnswer.id,
        comparison: compareCountries(playerGuess, correctAnswer, difficulty),
        timestamp: date,
      };

      return result;
    })
    .filter((move): move is GameMove => !!move);

  const guessedIds = moves.reduce((guesses, move) => {
    guesses.add(move.guessedCountry.id);
    return guesses;
  }, new Set<number>());

  return { moves, guessedIds };
};
