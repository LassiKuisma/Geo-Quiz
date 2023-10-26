import { Continent } from './continent';
import { CountryModel } from './country';
import { CountryContinent } from './countryContinent';
import { CountryLanguage } from './countryLanguage';
import { CountryNeighbour } from './countryNeighbour';
import { DrivingSide } from './drivingSide';
import { GameModel } from './game';
import { Language } from './language';
import { Region } from './region';
import { Subregion } from './subregion';
import { UserModel } from './user';

Continent.belongsToMany(CountryModel, { through: CountryContinent });
CountryModel.belongsToMany(Continent, { through: CountryContinent });

Language.belongsToMany(CountryModel, { through: CountryLanguage });
CountryModel.belongsToMany(Language, { through: CountryLanguage });

CountryModel.belongsTo(DrivingSide);
CountryModel.belongsTo(Region);
CountryModel.belongsTo(Subregion);

CountryModel.belongsToMany(CountryModel, {
  as: 'neighbours',
  foreignKey: 'firstCountryId',
  through: CountryNeighbour,
});

CountryModel.belongsToMany(CountryModel, {
  as: 'countryNeighbours',
  foreignKey: 'secondCountryId',
  through: CountryNeighbour,
});

GameModel.belongsTo(CountryModel);

GameModel.belongsTo(UserModel);

export {
  Continent,
  CountryContinent,
  CountryLanguage,
  CountryModel,
  CountryNeighbour,
  DrivingSide,
  GameModel,
  Language,
  Region,
  Subregion,
  UserModel,
};
