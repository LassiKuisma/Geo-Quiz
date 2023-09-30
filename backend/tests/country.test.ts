import { compareCountries } from '../src/util/country';
import { Country, Difference } from '../src/util/types';

describe('comparing countries', () => {
  test('works with two completely different countries', () => {
    const countryA: Country = {
      id: 1,
      area: 1.23,
      countryCode: 'COU',
      landlocked: true,
      name: 'Testopia',
      population: 123,
      location_lat: 10,
      location_lng: -10,
      drivingSide: 'left',
      region: 'Testasia',
      subregion: 'East Testia',
      capital: 'Great Test',
      languages: ['Blabbish', 'Binary'],
      continents: ['Con'],
      neighbours: ['West Testia', 'Jestia'],
    };

    const countryB: Country = {
      id: 2,
      area: 400,
      countryCode: 'NTR',
      landlocked: false,
      name: 'Unitia',
      population: 3,
      location_lat: 80,
      location_lng: -20,
      drivingSide: 'right',
      region: 'Coverica',
      subregion: 'North Coverica',
      capital: 'Johannesbug',
      languages: ['Js', 'Ts'],
      continents: ['Tinent'],
      neighbours: ['Canaxico', 'Mexida', 'Divided states of Ecma'],
    };

    const comparison = compareCountries(countryA, countryB);
    expect(comparison.areaDifference).toEqual<Difference>('less');
    expect(comparison.landlockedEquality).toEqual<boolean>(false);
    expect(comparison.populationDifference).toEqual<Difference>('more');
    expect(comparison.locationLatDifference).toEqual<Difference>('less');
    expect(comparison.locationLngDifference).toEqual<Difference>('more');
    expect(comparison.drivingSideEqual).toEqual<boolean>(false);
    expect(comparison.regionEqual).toEqual<boolean>(false);
    expect(comparison.subregionEqual).toEqual<boolean>(false);
    expect(comparison.sameContinents).toEqual<Array<string>>([]);
    expect(comparison.sameLanguages).toEqual<Array<string>>([]);
    expect(comparison.sameNeighbours).toEqual<Array<string>>([]);
  });

  test('works with two similar countries', () => {
    const countryA: Country = {
      id: 3,
      area: 400,
      countryCode: 'COU',
      landlocked: false,
      name: 'Testopia',
      population: 123,
      location_lat: 10.5,
      location_lng: -80,
      drivingSide: 'right',
      region: 'Testasia',
      subregion: 'East Testia',
      capital: 'Great Test',
      languages: ['Blabbish', 'Binary'],
      continents: ['Con'],
      neighbours: ['West Testia', 'Jestia'],
    };

    const countryB: Country = {
      id: 4,
      area: 400,
      countryCode: 'NTR',
      landlocked: false,
      name: 'Unitia',
      population: 123,
      location_lat: 10.5,
      location_lng: -80,
      drivingSide: 'right',
      region: 'Testasia',
      subregion: 'East Testia',
      capital: 'Johannesbug',
      languages: ['Js', 'Ts', 'Blabbish', 'Binary'],
      continents: ['Con', 'Tinent'],
      neighbours: ['Jestia', 'Qwertia'],
    };

    const comparison = compareCountries(countryA, countryB);
    expect(comparison.areaDifference).toEqual<Difference>('equal');
    expect(comparison.landlockedEquality).toEqual<boolean>(true);
    expect(comparison.populationDifference).toEqual<Difference>('equal');
    expect(comparison.locationLatDifference).toEqual<Difference>('equal');
    expect(comparison.locationLngDifference).toEqual<Difference>('equal');
    expect(comparison.drivingSideEqual).toEqual<boolean>(true);
    expect(comparison.regionEqual).toEqual<boolean>(true);
    expect(comparison.subregionEqual).toEqual<boolean>(true);
    expect(comparison.sameContinents).toEqual<Array<string>>(['Con']);
    expect(comparison.sameLanguages).toEqual<Array<string>>([
      'Blabbish',
      'Binary',
    ]);
    expect(comparison.sameNeighbours).toEqual<Array<string>>(['Jestia']);
  });
});
