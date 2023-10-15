import { Continent } from './continent';
import { Country } from './country';
import { CountryContinent } from './countryContinent';
import { CountryLanguage } from './countryLanguage';
import { CountryNeighbour } from './countryNeighbour';
import { DrivingSide } from './drivingSide';
import { Language } from './language';
import { Region } from './region';
import { Subregion } from './subregion';
import { GameModel } from './game';
import { UserModel } from './user';

Continent.belongsToMany(Country, { through: CountryContinent });
Country.belongsToMany(Continent, { through: CountryContinent });

Language.belongsToMany(Country, { through: CountryLanguage });
Country.belongsToMany(Language, { through: CountryLanguage });

Country.belongsTo(DrivingSide);
Country.belongsTo(Region);
Country.belongsTo(Subregion);

Country.belongsToMany(Country, {
  as: 'neighbours',
  foreignKey: 'firstCountryId',
  through: CountryNeighbour,
});

Country.belongsToMany(Country, {
  as: 'countryNeighbours',
  foreignKey: 'secondCountryId',
  through: CountryNeighbour,
});

GameModel.belongsTo(Country);

export {
  Continent,
  Country as CountryModel,
  CountryContinent,
  CountryLanguage,
  CountryNeighbour,
  DrivingSide,
  Language,
  Region,
  Subregion,
  GameModel,
  UserModel,
};
