import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class Subregion extends Model<
  InferAttributes<Subregion>,
  InferCreationAttributes<Subregion>
> {
  declare id: CreationOptional<number>;
  declare subregionName: string;
}

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
    modelName: 'subregion',
  }
);

export { Subregion };
