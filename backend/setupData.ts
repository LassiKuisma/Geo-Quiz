/* eslint-disable no-console */

import axios from 'axios';
import {
  Continent,
  CountryContinent,
  CountryLanguage,
  CountryModel,
  CountryNeighbour,
  DrivingSide,
  Language,
  Region,
  Subregion,
} from './src/models';
import { connectToDatabase } from './src/util/db';
import {
  isNumber,
  isNumberArray,
  isSide,
  isString,
  isStringArray,
} from './src/util/utils';

import { Country, Side } from './src/types/shared';

const url = 'https://restcountries.com/v3.1/all';

const setup = async () => {
  console.log('Connecting to database');
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

  const allCountries = dataToCountries(data);
  const countries = allCountries.filter((country) => country.independent);
  const nonIndependent = allCountries
    .filter((country) => !country.independent)
    .map((c) => c.countryCode);

  const attributes = collectAttributes(countries);
  const attributesWithId = await saveAttributes(attributes);

  const countryCodeMap = await saveCountryData(countries, attributesWithId);
  await saveNeighbourData(countries, countryCodeMap, nonIndependent);

  console.log('Setup complete');
};

const saveCountryData = async (
  countries: Array<CountryInfo>,
  attributes: SavedAttributes
) => {
  const result = new Map<Country['countryCode'], Country['id']>();

  type CountryInfoWithFks = CountryInfo & { regionId: number } & {
    subregionId: number;
  } & { drivingSideId: number };

  const countriesWithAttributes: CountryInfoWithFks[] = countries
    .map((country) => {
      const regionId = attributes.regions.get(country.region);
      if (!regionId) {
        attributeMissing('region', country.region, country.name);
        return null;
      }
      const subregionId = attributes.subregions.get(country.subregion);
      if (!subregionId) {
        attributeMissing('subregion', country.subregion, country.name);
        return null;
      }
      const drivingSideId = attributes.drivingSides.get(country.drivingSide);
      if (!drivingSideId) {
        attributeMissing('drivingSide', country.drivingSide, country.name);
        return null;
      }

      return {
        ...country,
        regionId,
        subregionId,
        drivingSideId,
      };
    })
    .filter((country): country is CountryInfoWithFks => !!country);

  (
    await CountryModel.bulkCreate(
      countriesWithAttributes.map((country) => ({
        area: country.area,
        countryCode: country.countryCode,
        landlocked: country.landlocked,
        name: country.name,
        population: country.population,
        location_lat: country.location_lat,
        location_lng: country.location_lng,
        capital: country.capital,
        regionId: country.regionId,
        subregionId: country.subregionId,
        drivingSideId: country.drivingSideId,
      })),
      {
        fields: [
          'area',
          'countryCode',
          'landlocked',
          'name',
          'population',
          'location_lat',
          'location_lng',
          'capital',
          'regionId',
          'subregionId',
          'drivingSideId',
        ],
        updateOnDuplicate: [
          'area',
          'countryCode',
          'landlocked',
          'name',
          'population',
          'location_lat',
          'location_lng',
          'capital',
          'regionId',
          'subregionId',
          'drivingSideId',
        ],
      }
    )
  ).forEach((saved) => {
    result.set(saved.dataValues.countryCode, saved.dataValues.id);
  });

  const countryLanguages = new Set<{
    countryId: number;
    languageId: number;
  }>();
  const countryContinents = new Set<{
    countryId: number;
    continentId: number;
  }>();

  for (const country of countries) {
    const countryId = result.get(country.countryCode);
    if (!countryId) {
      console.log(`Error saving ${country.name}, can't find country id.`);
      continue;
    }

    for (const language of country.languages) {
      const languageId = attributes.languages.get(language);
      if (!languageId) {
        console.log(
          `Error saving languages of ${country.name}, can't find language id of ${language}.`
        );
        continue;
      }
      countryLanguages.add({
        countryId,
        languageId,
      });
    }

    for (const continent of country.continents) {
      const continentId = attributes.continents.get(continent);
      if (!continentId) {
        console.log(
          `Error saving continents of ${country.name}, can't find continent id of ${continent}.`
        );
        continue;
      }
      countryContinents.add({
        countryId,
        continentId,
      });
    }
  }

  await CountryLanguage.bulkCreate([...countryLanguages], {
    fields: ['countryId', 'languageId'],
    updateOnDuplicate: ['countryId', 'languageId'],
  });

  await CountryContinent.bulkCreate([...countryContinents], {
    fields: ['countryId', 'continentId'],
    updateOnDuplicate: ['countryId', 'continentId'],
  });

  return result;
};

interface Attributes {
  drivingSides: Set<Side>;
  regions: Set<string>;
  subregions: Set<string>;
  languages: Set<string>;
  continents: Set<string>;
}

interface SavedAttributes {
  drivingSides: Map<string, number>;
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

  (
    await DrivingSide.bulkCreate(
      [...attributes.drivingSides].map((side) => ({
        side,
      })),
      {
        fields: ['side'],
        updateOnDuplicate: ['side'],
      }
    )
  ).forEach((saved) =>
    result.drivingSides.set(saved.dataValues.side, saved.dataValues.id)
  );

  (
    await Region.bulkCreate(
      [...attributes.regions].map((region) => ({
        regionName: region,
      })),
      {
        fields: ['regionName'],
        updateOnDuplicate: ['regionName'],
      }
    )
  ).forEach((saved) =>
    result.regions.set(saved.dataValues.regionName, saved.dataValues.id)
  );

  (
    await Subregion.bulkCreate(
      [...attributes.subregions].map((subregion) => ({
        subregionName: subregion,
      })),
      {
        fields: ['subregionName'],
        updateOnDuplicate: ['subregionName'],
      }
    )
  ).forEach((saved) =>
    result.subregions.set(saved.dataValues.subregionName, saved.dataValues.id)
  );

  (
    await Language.bulkCreate(
      [...attributes.languages].map((language) => ({
        languageName: language,
      })),
      {
        fields: ['languageName'],
        updateOnDuplicate: ['languageName'],
      }
    )
  ).forEach((saved) =>
    result.languages.set(saved.dataValues.languageName, saved.dataValues.id)
  );

  (
    await Continent.bulkCreate(
      [...attributes.continents].map((continent) => ({
        continentName: continent,
      })),
      {
        fields: ['continentName'],
        updateOnDuplicate: ['continentName'],
      }
    )
  ).forEach((saved) =>
    result.continents.set(saved.dataValues.continentName, saved.dataValues.id)
  );

  return result;
};

const saveNeighbourData = async (
  countries: Array<CountryInfo>,
  countryCodeMap: Map<Country['countryCode'], Country['id']>,
  nonIndependentCountries: Array<string>
) => {
  const countryNeighbours = new Set<{
    firstCountryId: number;
    secondCountryId: number;
  }>();

  for (const country of countries) {
    const firstCountryId = countryCodeMap.get(country.countryCode);
    if (!firstCountryId) {
      console.log(
        `Error saving country neighbours: can't find id of ${country.name}.`
      );
      continue;
    }

    for (const neighbour of country.neighboursCountryCodes) {
      const secondCountryId = countryCodeMap.get(neighbour);
      if (!secondCountryId) {
        // some entries have non-independent neighbours that will not be saved to db
        // only log error if neighbour is not one of these
        const unknownCode = !nonIndependentCountries.includes(neighbour);
        if (unknownCode) {
          console.log(
            `Error saving ${country.name}'s neighbours: id of country code ${neighbour} not found. Skipping this entry.`
          );
        }
        continue;
      }

      countryNeighbours.add({
        firstCountryId,
        secondCountryId,
      });
    }
  }

  await CountryNeighbour.bulkCreate([...countryNeighbours], {
    fields: ['firstCountryId', 'secondCountryId'],
    updateOnDuplicate: ['firstCountryId', 'secondCountryId'],
  });
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

  let capital;
  // some countries have multiple capitals, so in the api capitals are given as array
  if (!('capital' in item) || !isStringArray(item.capital)) {
    console.log(`${countryName} is missing capital, marking it as 'Unknown'.`);
    capital = 'Unknown';
  } else {
    // to simplify things: join the names into one string for easier display
    capital = item.capital.join(', ');
  }

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

  let independent;
  if (!('independent' in item) || typeof item.independent !== 'boolean') {
    console.log(
      `${countryName} is missing independence info, marking it as non-independent.`
    );
    independent = false;
  } else {
    independent = item.independent;
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
    independent,
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
