import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Language extends Model {}

Language.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    languageName: {
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
    modelName: 'language',
  }
);

export { Language };
