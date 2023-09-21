import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Subregion extends Model {}

Subregion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    subregionName: {
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
    modelName: 'subregion',
  }
);

export { Subregion };
