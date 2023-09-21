import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Continent extends Model {}

Continent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    continentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'continent',
  }
);

export { Continent };
