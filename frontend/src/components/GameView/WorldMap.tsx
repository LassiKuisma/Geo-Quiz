import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

import { Country, GameMove } from '../../types/shared';

interface WorldMapProps {
  countries: Array<Country>;
  guessed: Array<GameMove>;
}

const WorldMap = ({ countries, guessed }: WorldMapProps) => {
  const colorDefault = '#0066FF';
  const colorGuessed = '#730A00';
  const colorUnknown = '#444444';

  return (
    <ComposableMap>
      <ZoomableGroup>
        <Geographies geography="./ne_110m_admin_0_countries.geojson">
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = geo.properties.ISO_A3_EH;

              const isGuessed = guessed.some(
                (move) => move.guessedCountry.countryCode === code
              );

              const regularCountry = countries.some(
                (country) => country.countryCode === code
              );

              const color = isGuessed
                ? colorGuessed
                : regularCountry
                ? colorDefault
                : colorUnknown;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: color },
                    hover: { fill: '#04D' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default WorldMap;
