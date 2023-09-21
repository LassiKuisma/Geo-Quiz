import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Region extends Model {}

Region.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    regionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    modelName: 'region',
  }
);

export { Region };
