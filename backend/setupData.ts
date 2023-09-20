// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const axios = require('axios');

const url = 'https://restcountries.com/v3.1/all';

const setup = async () => {
  console.log('Fetching country data');

  const response: unknown = await fetchData();

  if (!response || typeof response !== 'object' || !('data' in response)) {
    console.log('Failed to fetch country data.');
    return;
  }

  const data = response.data;

  if (!Array.isArray(data)) {
    console.log('Error fetching country data: data is not an array.');
    return;
  }

  const countries = dataToCountries(data);
  console.log(countries.length, ' countries left');
  const independentCountries = countries.filter(
    (country) => country.independent
  );

  console.log(independentCountries.length, ' independent countries left');
  const regions = new Set();
  const subregions = new Set();
  const cars = new Set();
  const continents = new Set();
  const languages = new Set();

  independentCountries.forEach((country) => {
    regions.add(country.region);
    subregions.add(country.subregion);
    cars.add(country.carSide);

    country.continents.forEach((continent) => {
      continents.add(continent);
    });

    country.languages.forEach((language) => {
      languages.add(language);
    });
  });

  console.log('All regions:', regions);
  console.log('All subregions:', subregions);
  console.log('All cars:', cars);
  console.log('All continents:', continents);
  console.log('All languages:', languages);
};

const fetchData = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return await axios.get(url);
  } catch (error) {
    console.log('Error fetching country data:', error);
    return undefined;
  }
};

const dataToCountries = (data: Array<unknown>): Array<Country> => {
  return data
    .map((item) => toCountry(item))
    .filter((item): item is Country => !!item);
};

const toCountry = (item: unknown): Country | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  if (!('name' in item)) {
    return null;
  }

  const nameObj = item.name;
  if (
    !nameObj ||
    typeof nameObj !== 'object' ||
    !('common' in nameObj) ||
    !isString(nameObj.common)
  ) {
    return null;
  }
  const countryName = nameObj.common;

  if (!('area' in item) || !isNumber(item.area)) {
    console.log('area missing from', countryName);
    return null;
  }

  // some countries have multiple capitals, so in the api capitals are given as array
  if (!('capital' in item) || !isStringArray(item.capital)) {
    console.log('capital missing from', countryName);
    return null;
  }
  // to simplify things: join the names into one string for easier display
  const capital = item.capital.join(', ');

  if (!('car' in item) || typeof item.car !== 'object') {
    console.log('car missing from', countryName);
    return null;
  }
  const carData = item.car;
  if (!carData || !('side' in carData) || !isString(carData.side)) {
    console.log('car side missing from', countryName);
    return null;
  }

  if (!('continents' in item) || !isStringArray(item.continents)) {
    console.log('no continents in', countryName);
    return null;
  }

  if (!('independent' in item) || typeof item.independent !== 'boolean') {
    return null;
  }

  if (!('landlocked' in item) || typeof item.landlocked !== 'boolean') {
    console.log('no landlocked in', countryName);
    return null;
  }

  if (!('languages' in item)) {
    console.log('no official languages in', countryName);
    return null;
  }

  let languages = new Array<string>();
  if (!!item.languages && typeof item.languages === 'object') {
    const langs = Object.values(item.languages);
    if (isStringArray(langs)) {
      languages = langs;
    } else {
      console.log('Invalid languages in', countryName);
    }
  }

  if (!('latlng' in item)) {
    console.log('location missing from', countryName);
    return null;
  }
  const location = toLocation(item.latlng);
  if (!location) {
    console.log('invalid location in', countryName, ',', location);
    return null;
  }

  // some countries have no neighbours, in the api the item is missing this field -> just use an empty array instead
  let neighbours = new Array<string>();
  if ('borders' in item && isStringArray(item.borders)) {
    neighbours = item.borders;
  }

  if (!('population' in item) || !isNumber(item.population)) {
    console.log('no population in', countryName);
    return null;
  }

  if (!('region' in item) || !isString(item.region)) {
    console.log('no region in', countryName);
    return null;
  }

  if (!('subregion' in item) || !isString(item.subregion)) {
    console.log(
      'no subregion in',
      countryName,
      'is it independent:',
      item.independent
    );
    return null;
  }

  return {
    area: item.area,
    capital: capital,
    carSide: carData.side,
    continents: item.continents,
    independent: item.independent,
    landlocked: item.landlocked,
    languages: languages,
    location: location,
    name: countryName,
    neighbours: neighbours,
    population: item.population,
    region: item.region,
    subregion: item.subregion,
  };
};

interface Country {
  area: number;
  capital: string;
  carSide: string;
  continents: Array<string>;
  independent: boolean;
  landlocked: boolean;
  languages: Array<string>;
  location: LatLngPosition;
  name: string;
  neighbours: Array<string>;
  population: number;
  region: string;
  subregion: string;
}

interface LatLngPosition {
  lat: number;
  lng: number;
}

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (param: unknown): param is number => {
  return typeof param === 'number' || param instanceof Number;
};

const isStringArray = (param: unknown): param is Array<string> => {
  return Array.isArray(param) && param.every((item) => isString(item));
};

const isNumberArray = (param: unknown): param is Array<number> => {
  return Array.isArray(param) && param.every((item) => isNumber(item));
};

const toLocation = (param: unknown): LatLngPosition | null => {
  if (!param || !isNumberArray(param)) {
    return null;
  }

  if (param.length !== 2) {
    return null;
  }

  const lat = param[0];
  const lng = param[1];
  if (isNumber(lat) && isNumber(lng)) {
    return {
      lat,
      lng,
    };
  } else {
    return null;
  }
};

void setup();
