import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';
import { CountryModel } from './country';
import { UserModel } from './user';

class GameModel extends Model<
  InferAttributes<GameModel>,
  InferCreationAttributes<GameModel>
> {
  declare gameId: CreationOptional<number>;
  declare countryId: ForeignKey<CountryModel['id']>;

  declare userId: ForeignKey<UserModel['id']>;

  declare created_at: CreationOptional<DataTypes.DateDataType>;

  declare difficulty: CreationOptional<number>;
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'games',
    createdAt: true,
  }
);

export { GameModel };
