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
  },
  {
    sequelize,
    modelName: 'games',
  }
);

export { GameModel };
