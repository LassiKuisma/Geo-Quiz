import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class Language extends Model<
  InferAttributes<Language>,
  InferCreationAttributes<Language>
> {
  declare id: CreationOptional<number>;
  declare languageName: string;
}

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
    modelName: 'language',
  }
);

export { Language };
