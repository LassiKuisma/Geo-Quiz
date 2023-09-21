import { Continent } from './continent';
import { Country } from './country';
import { DrivingSide } from './drivingSide';
import { Language } from './language';
import { Location } from './location';
import { Region } from './region';
import { Subregion } from './subregion';

Country.hasMany(Continent);

Country.hasOne(DrivingSide);

Country.hasMany(Language);

Country.hasOne(Location);
Location.belongsTo(Country);

Country.hasOne(Region);
Country.hasOne(Subregion);

export {
  Continent,
  Country,
  DrivingSide,
  Language,
  Location,
  Region,
  Subregion,
};
