import { Country, Game } from '../util/types';

const activeGames = new Map<number, Game>();

export const generateGame = (countries: Array<Country>): Game => {
  const id = Math.floor(Math.random() * 100000);

  const index = Math.floor(Math.random() * countries.length);
  const countryId = countries[index].id;

  const game = {
    gameId: id,
    answer: countryId,
    guesses: 0,
  };

  activeGames.set(id, game);

  return game;
};

export const getGame = (id: number): Game | undefined => {
  return activeGames.get(id);
};
