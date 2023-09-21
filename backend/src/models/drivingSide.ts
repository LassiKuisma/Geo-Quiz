import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class DrivingSide extends Model {}

DrivingSide.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    side: {
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
    modelName: 'drivingSide',
  }
);

export { DrivingSide };