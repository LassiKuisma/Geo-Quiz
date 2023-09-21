import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Country extends Model {}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    modelName: 'country',
  }
);

export { Country };
