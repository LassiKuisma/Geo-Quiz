import { Continent } from './continent';
import { Country } from './country';
import { DrivingSide } from './drivingSide';
import { Language } from './language';
import { Location } from './location';
import { Region } from './region';
import { Subregion } from './subregion';

Country.belongsTo(DrivingSide);
Country.belongsTo(Region);
Country.belongsTo(Subregion);

export {
  Continent,
  Country,
  DrivingSide,
  Language,
  Location,
  Region,
  Subregion,
};
