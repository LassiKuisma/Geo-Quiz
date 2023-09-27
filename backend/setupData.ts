import axios from 'axios';
import { connectToDatabase } from './src/util/db';
import {
  Continent,
  CountryModel,
  DrivingSide,
  Language,
  Region,
  Subregion,
  CountryLanguage,
  CountryContinent,
} from './src/models';
import {
  isNumber,
  isNumberArray,
  isSide,
  isString,
  isStringArray,
} from './src/util/utils';
import { Country } from './src/util/types';

const url = 'https://restcountries.com/v3.1/all';

const setup = async () => {
  await connectToDatabase();

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

  const independentCountries = dataToCountries(data).filter(
    (country) => country.independent
  );

  await saveData(independentCountries);
};

const saveData = async (countries: Array<CountryInfo>) => {
  for (const country of countries) {
    const region = await Region.upsert({
      regionName: country.region,
    });

    const subregion = await Subregion.upsert({
      subregionName: country.subregion,
    });

    const drivingSide = await DrivingSide.upsert({
      side: country.drivingSide,
    });

    const countryModel = await CountryModel.upsert({
      area: country.area,
      countryCode: country.countryCode,
      landlocked: country.landlocked,
      name: country.name,
      population: country.population,
      location_lat: country.location_lat,
      location_lng: country.location_lng,

      regionId: region[0].dataValues.id,
      subregionId: subregion[0].dataValues.id,
      drivingSideId: drivingSide[0].dataValues.id,
    });

    for (const language of country.languages) {
      const languageModel = await Language.upsert({
        languageName: language,
      });

      await CountryLanguage.upsert({
        languageId: languageModel[0].dataValues.id,
        countryId: countryModel[0].dataValues.id,
      });
    }

    for (const continent of country.continents) {
      const continentModel = await Continent.upsert({
        continentName: continent,
      });

      await CountryContinent.upsert({
        continentId: continentModel[0].dataValues.id,
        countryId: countryModel[0].dataValues.id,
      });
    }

    // TODO: add countries neighbours
  }
};

const fetchData = async () => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.log('Error fetching country data:', error);
    return undefined;
  }
};

const dataToCountries = (data: Array<unknown>): Array<CountryInfo> => {
  return data
    .map((item) => toCountry(item))
    .filter((item): item is CountryInfo => !!item);
};

const toCountry = (item: unknown): CountryInfo | null => {
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
    fieldMissing('area', countryName);
    return null;
  }

  // some countries have multiple capitals, so in the api capitals are given as array
  if (!('capital' in item) || !isStringArray(item.capital)) {
    fieldMissing('capital', countryName);
    return null;
  }
  // to simplify things: join the names into one string for easier display
  const capital = item.capital.join(', ');

  if (!('car' in item) || typeof item.car !== 'object') {
    fieldMissing('car', countryName);
    return null;
  }
  const carData = item.car;
  if (!carData || !('side' in carData) || !isSide(carData.side)) {
    fieldMissing('car.side', countryName);
    return null;
  }

  if (!('continents' in item) || !isStringArray(item.continents)) {
    fieldMissing('continents', countryName);
    return null;
  }

  if (!('independent' in item) || typeof item.independent !== 'boolean') {
    fieldMissing('independent', countryName);
    return null;
  }

  if (!('landlocked' in item) || typeof item.landlocked !== 'boolean') {
    fieldMissing('landlocked', countryName);
    return null;
  }

  if (!('languages' in item)) {
    fieldMissing('languages', countryName);
    return null;
  }

  let languages = new Array<string>();
  if (!!item.languages && typeof item.languages === 'object') {
    const langs = Object.values(item.languages);
    if (isStringArray(langs)) {
      languages = langs;
    } else {
      console.log(`Error parsing languages in ${countryName}.`);
      return null;
    }
  }

  if (!('latlng' in item)) {
    fieldMissing('latlng', countryName);
    return null;
  }
  const location = toLocation(item.latlng);
  if (!location) {
    console.log(
      `Error parsing location in ${countryName}. Location object: ${location}`
    );
    return null;
  }

  // some countries have no neighbours, in the api the item is missing this field -> just use an empty array instead
  let neighbours = new Array<string>();
  if ('borders' in item && isStringArray(item.borders)) {
    neighbours = item.borders;
  }

  if (!('population' in item) || !isNumber(item.population)) {
    fieldMissing('population', countryName);
    return null;
  }

  if (!('region' in item) || !isString(item.region)) {
    fieldMissing('region', countryName);
    return null;
  }

  if (!('subregion' in item) || !isString(item.subregion)) {
    fieldMissing('subregion', countryName);
    return null;
  }

  if (!('cca3' in item) || !isString(item.cca3)) {
    fieldMissing('cca3', countryName);
    return null;
  }

  return {
    area: item.area,
    capital: capital,
    drivingSide: carData.side,
    continents: item.continents,
    countryCode: item.cca3,
    independent: item.independent,
    landlocked: item.landlocked,
    languages: languages,
    location_lat: location.lat,
    location_lng: location.lng,
    name: countryName,
    neighbours: neighbours,
    population: item.population,
    region: item.region,
    subregion: item.subregion,
  };
};

interface CountryInfo extends Omit<Country, 'id'> {
  independent: boolean;
}

interface LatLngPosition {
  lat: number;
  lng: number;
}

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

const fieldMissing = (fieldName: string, countryName: string) => {
  console.log(
    `'${fieldName}' field missing from ${countryName}, skipping this entry.`
  );
};

void setup();
