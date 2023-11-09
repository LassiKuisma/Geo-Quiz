/*
Utility script for creating a minified version of the Natural Earth map.
The minified version contains borders data, English names and country codes.

This script does not need to be run on project setup, as the map file should be
included in the project. Run this if you need to update the map file.
*/

/* eslint-disable */
const axios = require('axios');
const { writeFile } = require('fs');

const downloadUrl =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';
const outputFile = './src/ne_110m_admin_0_countries_minified.geojson';

const downloadAndSave = async () => {
  const content = await axios.get(downloadUrl);
  console.log('map downloaded');
  const data = content.data;

  const newObject = {
    ...data,
    features: data.features.map((feature) => {
      const properties = feature.properties;
      return {
        ...feature,
        properties: {
          ISO_A3_EH: properties.ISO_A3_EH,
          NAME_EN: properties.NAME_EN,
        },
      };
    }),
  };
  newObject.name = 'ne_110m_admin_0_countries_minified';

  writeFile(outputFile, JSON.stringify(newObject), (err) => {
    if (err) {
      console.log('error writing to file:', err);
    } else {
      console.log(`file saved to ${outputFile}`);
    }
  });
};

try {
  console.log('creating a minified map');
  downloadAndSave();
} catch (err) {
  console.log(err);
}
