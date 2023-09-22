import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class DrivingSide extends Model<
  InferAttributes<DrivingSide>,
  InferCreationAttributes<DrivingSide>
> {
  declare id: CreationOptional<number>;
  declare side: string;
}

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
    modelName: 'driving_sides',
  }
);

export { DrivingSide };
