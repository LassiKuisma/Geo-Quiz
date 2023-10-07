import { compareCountries, getHints } from '../src/util/country';
import { Country, Difference, Hint, Side } from '../src/util/types';

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
    expect(comparison.areaDifference).toEqual<Difference>('more');
    expect(comparison.populationDifference).toEqual<Difference>('less');
    expect(comparison.locationLatDifference).toEqual<Difference>('more');
    expect(comparison.locationLngDifference).toEqual<Difference>('less');
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
    expect(comparison.populationDifference).toEqual<Difference>('equal');
    expect(comparison.locationLatDifference).toEqual<Difference>('equal');
    expect(comparison.locationLngDifference).toEqual<Difference>('equal');
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

describe('generating hints', () => {
  test('generates all hints after passing guess threshold', () => {
    const thresholds = {
      landlocked: 2,
      drivingSide: 4,
      capital: 9,
    };

    const country: Country = {
      id: 1,
      landlocked: false,
      capital: 'New Skako',
      drivingSide: 'left',
      area: 0,
      countryCode: 'A',
      name: 'A',
      population: 0,
      location_lat: 0,
      location_lng: 0,
      region: 'A',
      subregion: 'A',
      languages: [],
      continents: [],
      neighbours: [],
    };

    const hints = getHints(1000, country, thresholds);
    expect(hints.landlocked).toEqual<Hint<boolean>>({
      locked: false,
      value: false,
    });
    expect(hints.drivingSide).toEqual<Hint<Side>>({
      locked: false,
      value: 'left',
    });
    expect(hints.capital).toEqual<Hint<string>>({
      locked: false,
      value: 'New Skako',
    });
  });

  test('generates some hints after passing some threshold', () => {
    const thresholds = {
      landlocked: 2,
      drivingSide: 400,
      capital: 900,
    };

    const country: Country = {
      id: 1,
      landlocked: false,
      capital: 'New Skako',
      drivingSide: 'left',
      area: 0,
      countryCode: 'A',
      name: 'A',
      population: 0,
      location_lat: 0,
      location_lng: 0,
      region: 'A',
      subregion: 'A',
      languages: [],
      continents: [],
      neighbours: [],
    };

    const hints = getHints(100, country, thresholds);
    expect(hints.landlocked).toEqual<Hint<boolean>>({
      locked: false,
      value: false,
    });
    expect(hints.drivingSide).toEqual<Hint<Side>>({
      locked: true,
      unlocksIn: 300,
    });
    expect(hints.capital).toEqual<Hint<string>>({
      locked: true,
      unlocksIn: 800,
    });
  });

  test('generates no hints before passing any threshold', () => {
    const thresholds = {
      landlocked: 10,
      drivingSide: 10,
      capital: 10,
    };

    const country: Country = {
      id: 1,
      landlocked: false,
      capital: 'New Skako',
      drivingSide: 'left',
      area: 0,
      countryCode: 'A',
      name: 'A',
      population: 0,
      location_lat: 0,
      location_lng: 0,
      region: 'A',
      subregion: 'A',
      languages: [],
      continents: [],
      neighbours: [],
    };

    const hints = getHints(1, country, thresholds);
    expect(hints.landlocked).toEqual<Hint<boolean>>({
      locked: true,
      unlocksIn: 9,
    });
    expect(hints.drivingSide).toEqual<Hint<Side>>({
      locked: true,
      unlocksIn: 9,
    });
    expect(hints.capital).toEqual<Hint<string>>({
      locked: true,
      unlocksIn: 9,
    });
  });

  test('generates hints at exact threshold', () => {
    const thresholds = {
      landlocked: 20,
      drivingSide: 21,
      capital: 22,
    };

    const country: Country = {
      id: 1,
      landlocked: false,
      capital: 'New Skako',
      drivingSide: 'left',
      area: 0,
      countryCode: 'A',
      name: 'A',
      population: 0,
      location_lat: 0,
      location_lng: 0,
      region: 'A',
      subregion: 'A',
      languages: [],
      continents: [],
      neighbours: [],
    };

    const hints = getHints(21, country, thresholds);
    expect(hints.landlocked).toEqual<Hint<boolean>>({
      locked: false,
      value: false,
    });
    expect(hints.drivingSide).toEqual<Hint<Side>>({
      locked: false,
      value: 'left',
    });
    expect(hints.capital).toEqual<Hint<string>>({
      locked: true,
      unlocksIn: 1,
    });
  });
});
