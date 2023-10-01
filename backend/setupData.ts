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
  CountryNeighbour,
} from './src/models';
import {
  isNumber,
  isNumberArray,
  isSide,
  isString,
  isStringArray,
} from './src/util/utils';
import { Country, Side } from './src/util/types';

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

  const countries = dataToCountries(data).filter(
    (country) => country.independent
  );

  const attributes = collectAttributes(countries);
  const attributesWithId = await saveAttributes(attributes);

  const countryCodeMap = await saveCountryData(countries, attributesWithId);
  await saveNeighbourData(countries, countryCodeMap);
};

const saveCountryData = async (
  countries: Array<CountryInfo>,
  attributes: SavedAttributes
) => {
  const countryCodeMap = new Map<Country['countryCode'], Country['id']>();

  for (const country of countries) {
    const regionId = attributes.regions.get(country.region);
    if (!regionId) {
      attributeMissing('region', country.region, country.name);
      continue;
    }
    const subregionId = attributes.subregions.get(country.subregion);
    if (!subregionId) {
      attributeMissing('subregion', country.subregion, country.name);
      continue;
    }
    const drivingSideId = attributes.drivingSides.get(country.drivingSide);
    if (!drivingSideId) {
      attributeMissing('drivingSide', country.drivingSide, country.name);
      continue;
    }

    const countryModel = await CountryModel.upsert({
      area: country.area,
      countryCode: country.countryCode,
      landlocked: country.landlocked,
      name: country.name,
      population: country.population,
      location_lat: country.location_lat,
      location_lng: country.location_lng,
      capital: country.capital,

      regionId,
      subregionId,
      drivingSideId,
    });

    for (const language of country.languages) {
      const languageId = attributes.languages.get(language);
      if (!languageId) {
        attributeMissing('language', language, country.name);
        continue;
      }
      await CountryLanguage.upsert({
        languageId,
        countryId: countryModel[0].dataValues.id,
      });
    }

    for (const continent of country.continents) {
      const continentId = attributes.continents.get(continent);
      if (!continentId) {
        attributeMissing('continent', continent, country.name);
        continue;
      }
      await CountryContinent.upsert({
        continentId,
        countryId: countryModel[0].dataValues.id,
      });
    }

    countryCodeMap.set(countryModel[0].countryCode, countryModel[0].id);
  }

  return countryCodeMap;
};

interface Attributes {
  drivingSides: Set<Side>;
  regions: Set<string>;
  subregions: Set<string>;
  languages: Set<string>;
  continents: Set<string>;
}

interface SavedAttributes {
  drivingSides: Map<Side, number>;
  regions: Map<string, number>;
  subregions: Map<string, number>;
  languages: Map<string, number>;
  continents: Map<string, number>;
}

const collectAttributes = (countries: Array<CountryInfo>): Attributes => {
  const result = countries.reduce(
    (attributes: Attributes, country: CountryInfo) => {
      attributes.drivingSides.add(country.drivingSide);
      attributes.regions.add(country.region);
      attributes.subregions.add(country.subregion);

      country.languages.forEach((language) =>
        attributes.languages.add(language)
      );

      country.continents.forEach((continent) =>
        attributes.continents.add(continent)
      );

      return attributes;
    },
    {
      drivingSides: new Set<Side>(),
      regions: new Set<string>(),
      subregions: new Set<string>(),
      languages: new Set<string>(),
      continents: new Set<string>(),
    }
  );

  return result;
};

const saveAttributes = async (attributes: Attributes) => {
  const result: SavedAttributes = {
    drivingSides: new Map(),
    regions: new Map(),
    subregions: new Map(),
    languages: new Map(),
    continents: new Map(),
  };

  for (const side of attributes.drivingSides) {
    const saved = await DrivingSide.upsert({
      side,
    });
    result.drivingSides.set(side, saved[0].dataValues.id);
  }

  for (const region of attributes.regions) {
    const saved = await Region.upsert({
      regionName: region,
    });
    result.regions.set(region, saved[0].dataValues.id);
  }

  for (const subregion of attributes.subregions) {
    const saved = await Subregion.upsert({
      subregionName: subregion,
    });
    result.subregions.set(subregion, saved[0].dataValues.id);
  }

  for (const language of attributes.languages) {
    const saved = await Language.upsert({
      languageName: language,
    });
    result.languages.set(language, saved[0].dataValues.id);
  }

  for (const continent of attributes.continents) {
    const saved = await Continent.upsert({
      continentName: continent,
    });
    result.continents.set(continent, saved[0].dataValues.id);
  }

  return result;
};

const saveNeighbourData = async (
  countries: Array<CountryInfo>,
  countryCodeMap: Map<Country['countryCode'], Country['id']>
) => {
  for (const country of countries) {
    for (const neighbour of country.neighboursCountryCodes) {
      const firstCountryId = countryCodeMap.get(country.countryCode);
      const secondCountryId = countryCodeMap.get(neighbour);

      if (!firstCountryId || !secondCountryId) {
        const missingCode = !firstCountryId ? country.countryCode : neighbour;
        console.log(
          `Error trying to save ${country.name} neighbours. Can't find country id of ${missingCode}`
        );
        continue;
      }

      await CountryNeighbour.upsert({
        firstCountryId,
        secondCountryId,
      });
    }
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
    neighboursCountryCodes: neighbours,
    population: item.population,
    region: item.region,
    subregion: item.subregion,
  };
};

interface CountryInfo extends Omit<Country, 'id' | 'capital' | 'neighbours'> {
  independent: boolean;
  capital: string;
  neighboursCountryCodes: Array<string>;
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

const attributeMissing = (
  attributeName: string,
  attributeValue: string,
  countryName: string
) => {
  console.log(
    `Error saving ${countryName}, attribute ${attributeName} with value ${attributeValue} not found.`
  );
};

void setup();
