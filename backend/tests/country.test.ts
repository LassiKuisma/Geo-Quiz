import { compareCountries, getHints } from '../src/util/country';

import {
  Country,
  Difference,
  Hint,
  Neighbour,
  Side,
} from '../src/types/shared';

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
      neighbours: [
        { name: 'West Testia', countryCode: 'AAA' },
        { name: 'Jestia', countryCode: 'BBB' },
      ],
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
      neighbours: [
        { name: 'Canaxico', countryCode: 'CCC' },
        { name: 'Mexida', countryCode: 'DDD' },
        { name: 'Divided states of Ecma', countryCode: 'EEE' },
      ],
    };

    const comparison = compareCountries(countryA, countryB, 'easy');
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
      neighbours: [
        { name: 'West Testia', countryCode: 'WWW' },
        { name: 'Jestia', countryCode: 'JJJ' },
      ],
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
      neighbours: [
        { name: 'Jestia', countryCode: 'JJJ' },
        { name: 'Qwertia', countryCode: 'QQQ' },
      ],
    };

    const comparison = compareCountries(countryA, countryB, 'easy');
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
    expect(comparison.sameNeighbours).toEqual<Array<Neighbour>>([
      { name: 'Jestia', countryCode: 'JJJ' },
    ]);
  });
});

describe('generating hints', () => {
  test('generates all hints after passing guess threshold', () => {
    const thresholds = {
      landlocked: 2,
      drivingSide: 4,
      capital: 9,
      neighbourCount: 999,
      languageCount: 999,
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
      neighbourCount: 999,
      languageCount: 999,
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
      neighbourCount: 999,
      languageCount: 999,
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
      neighbourCount: 999,
      languageCount: 999,
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

describe('comparing locations', () => {
  const country = (lat: number, lng: number): Country => {
    return {
      id: 0,
      area: 0,
      countryCode: '',
      landlocked: false,
      name: '',
      population: 0,
      location_lat: lat,
      location_lng: lng,
      drivingSide: 'right',
      capital: '',
      region: '',
      subregion: '',
      languages: [],
      continents: [],
      neighbours: [],
    };
  };

  describe('guessing country directly north, east, south and west', () => {
    const correctAnswer = country(0, 0);

    // note: the result is the "opposite" direction of variable name
    // "north" = I guessed location north of answer -> point south
    const north = { name: 'north', country: country(10, 0), expected: 180 };
    const south = { name: 'south', country: country(-10, 0), expected: 0 };
    const east = { name: 'east', country: country(0, 10), expected: 270 };
    const west = { name: 'west', country: country(0, -10), expected: 90 };

    const items = [north, south, east, west];

    test.each(items)('$name', ({ country, expected }) => {
      expect(
        compareCountries(country, correctAnswer, 'easy').direction
      ).toBeCloseTo(expected);
    });
  });

  test('between location on different sides of anti-meridian (straight)', () => {
    const correctAnswer = country(0, 170);
    const playerGuess = country(0, -170);

    const comparison = compareCountries(playerGuess, correctAnswer, 'easy');
    expect(comparison.direction).toBeCloseTo(270);
  });

  test('between location on different sides of anti-meridian (diagonal)', () => {
    const correctAnswer = country(25, -165);
    const playerGuess = country(-10, 160);

    const comparison = compareCountries(playerGuess, correctAnswer, 'easy');
    expect(comparison.direction).toBeCloseTo(45);
  });

  test('guessing the same location', () => {
    const correctAnswer = country(12.34, -123.98);
    const playerGuess = country(12.34, -123.98);

    const comparison = compareCountries(playerGuess, correctAnswer, 'easy');
    expect(comparison.direction).toBe(undefined);
  });

  test('guessing nearly same location', () => {
    const correctAnswer = country(-77.888, 3.33333);
    const playerGuess = country(-77.887, 3.33332);

    const comparison = compareCountries(playerGuess, correctAnswer, 'easy');
    expect(comparison.direction).toBe(undefined);
  });

  describe('using real life country locations', () => {
    const locations = new Map<string, [number, number]>();
    locations.set('Brazil', [-10, -55]);
    locations.set('Mexico', [23, -102]);
    locations.set('Argentina', [-34, -64]);
    locations.set('New Zealand', [-41, 174]);
    locations.set('Japan', [36, 138]);
    locations.set('USA', [38, -97]);
    locations.set('South Africa', [-29, 24]);
    locations.set('Finland', [64, 26]);
    locations.set('Algeria', [28, 3]);
    locations.set('Libya', [25, 17]);
    locations.set('South Korea', [37, 127.5]);
    locations.set('Switzerland', [47, 8]);
    locations.set('Poland', [52, 20]);
    locations.set('Sweden', [62, 15]);

    type Direction =
      | 'north'
      | 'east'
      | 'south'
      | 'west'
      | 'north-east'
      | 'north-west'
      | 'south-east'
      | 'south-west';

    const directions: Direction[] = [
      'north',
      'north-east',
      'east',
      'south-east',
      'south',
      'south-west',
      'west',
      'north-west',
    ];

    const angleToDirection = (angle: number): Direction => {
      // add 22.5 to "rotate" the sectors: north goes from [0, 45] to [-22.5, 22.5]
      const clamped = (angle + 22.5) % 360;
      const index = Math.floor(clamped / 45);
      const result = directions[index];
      return result;
    };

    const countryDirections = new Array<[string, Direction, string]>();
    countryDirections.push(['Brazil', 'north-west', 'Mexico']);
    countryDirections.push(['Mexico', 'south-east', 'Brazil']);

    countryDirections.push(['Argentina', 'west', 'New Zealand']);
    countryDirections.push(['New Zealand', 'east', 'Argentina']);

    countryDirections.push(['Japan', 'east', 'USA']);
    countryDirections.push(['USA', 'west', 'Japan']);

    countryDirections.push(['South Africa', 'north', 'Finland']);
    countryDirections.push(['Finland', 'south', 'South Africa']);

    countryDirections.push(['Algeria', 'east', 'Libya']);
    countryDirections.push(['Libya', 'west', 'Algeria']);

    countryDirections.push(['South Africa', 'north-east', 'South Korea']);
    countryDirections.push(['South Korea', 'south-west', 'South Africa']);

    countryDirections.push(['Switzerland', 'north-east', 'Poland']);
    countryDirections.push(['Poland', 'south-west', 'Switzerland']);

    countryDirections.push(['Finland', 'west', 'Sweden']);
    countryDirections.push(['Sweden', 'east', 'Finland']);

    test.each(countryDirections)(
      'going from %s %s leads to %s',
      (name1, expectedDirection, name2) => {
        const loc1 = locations.get(name1);
        if (!loc1) throw new Error(`${name1} not found`);
        const country1 = country(loc1[0], loc1[1]);

        const loc2 = locations.get(name2);
        if (!loc2) throw new Error(`${name2} not found`);
        const country2 = country(loc2[0], loc2[1]);

        const angle = compareCountries(country1, country2, 'easy').direction;
        if (!angle) {
          throw new Error(`angle is undefined between ${name1} and ${name2}`);
        }

        const direction = angleToDirection(angle);

        if (expectedDirection !== direction) {
          throw new Error(
            `expected ${expectedDirection}, got ${direction} (${angle.toFixed(
              2
            )})`
          );
        }
      }
    );
  });

  describe('on different difficulty settings', () => {
    const c1: Country = {
      id: 1,
      region: 'Region A',
      subregion: 'Subregion A',
      location_lat: 10,
      location_lng: 10,
      name: 'A',
      countryCode: 'A',
      area: 0,
      capital: null,
      drivingSide: 'right',
      landlocked: false,
      population: 0,
      languages: [],
      continents: [],
      neighbours: [],
    };

    const c2: Country = {
      id: 2,
      region: 'Region A',
      subregion: 'Subregion B',
      location_lat: 20,
      location_lng: 20,
      name: 'B',
      countryCode: 'B',
      area: 0,
      capital: null,
      drivingSide: 'right',
      landlocked: false,
      population: 0,
      languages: [],
      continents: [],
      neighbours: [],
    };

    const c3: Country = {
      id: 3,
      region: 'Region C',
      subregion: 'Subregion C',
      location_lat: -40,
      location_lng: -50,
      name: 'C',
      countryCode: 'C',
      area: 0,
      capital: null,
      drivingSide: 'right',
      landlocked: false,
      population: 0,
      languages: [],
      continents: [],
      neighbours: [],
    };

    test('on easy direction hint is always given', () => {
      const result = compareCountries(c1, c3, 'easy');
      expect(result.direction).not.toBe(undefined);
    });

    test('on medium direction hint is given when in the same region', () => {
      const result = compareCountries(c1, c2, 'medium');
      expect(result.direction).not.toBe(undefined);
    });

    test('on medium direction hint is not given when not in the same region', () => {
      const result = compareCountries(c1, c3, 'medium');
      expect(result.direction).toBe(undefined);
    });

    test('on hard direction hint is never given', () => {
      const result = compareCountries(c1, c2, 'hard');
      expect(result.direction).toBe(undefined);
    });
  });
});
