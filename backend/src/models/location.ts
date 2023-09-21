import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Location extends Model {}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    longitude: {
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
    modelName: 'location',
  }
);

export { Location };
