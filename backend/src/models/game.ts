import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { Country } from './country';
import { sequelize } from '../util/db';

class GameModel extends Model<
  InferAttributes<GameModel>,
  InferCreationAttributes<GameModel>
> {
  declare gameId: CreationOptional<number>;
  declare countryId: ForeignKey<Country['id']>;

  declare guessCount: CreationOptional<number>;
}

GameModel.init(
  {
    gameId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    guessCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'games',
  }
);

export { GameModel };
