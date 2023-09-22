import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'countries',
    'drivingSide',
    'drivingSideId'
  );
  await queryInterface.renameColumn('countries', 'region', 'regionId');
  await queryInterface.renameColumn('countries', 'subregion', 'subregionId');
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn(
    'countries',
    'drivingSideId',
    'drivingSide'
  );
  await queryInterface.renameColumn('countries', 'regionId', 'region');
  await queryInterface.renameColumn('countries', 'subregionId', 'subregion');
};
