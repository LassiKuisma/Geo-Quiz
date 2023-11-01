import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';
import { GameModel } from './game';
import { CountryModel } from './country';

class MoveModel extends Model<
  InferAttributes<MoveModel>,
  InferCreationAttributes<MoveModel>
> {
  declare moveId: CreationOptional<number>;
  declare gameId: ForeignKey<GameModel['gameId']>;
  declare guessedCountry: ForeignKey<CountryModel['id']>;

  declare created_at: CreationOptional<DataTypes.DateDataType>;
}

MoveModel.init(
  {
    moveId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'games', key: 'gameId' },
    },
    guessedCountry: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'moves',
    createdAt: true,
  }
);

export { MoveModel };
