import CircleIcon from '@mui/icons-material/Circle';
import { Box, Typography } from '@mui/material';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';

import { Country, GameMove } from '../../types/shared';

interface WorldMapProps {
  countries: Array<Country>;
  guessed: Array<GameMove>;
}

const WorldMap = ({ countries, guessed }: WorldMapProps) => {
  const colorScheme = makeColorScheme();

  const { guessedCountries, correctCountry } = guessed.reduce(
    (
      result: {
        guessedCountries: Set<string>;
        correctCountry: string | undefined;
      },
      move
    ) => {
      result.guessedCountries.add(move.guessedCountry.countryCode);

      if (move.correct) {
        result.correctCountry = move.guessedCountry.countryCode;
      }

      return result;
    },
    {
      guessedCountries: new Set<string>(),
      correctCountry: undefined,
    }
  );

  const countryCodes = countries.reduce(
    (codes, country) => codes.add(country.countryCode),
    new Set<string>()
  );

  return (
    <Box width="100%" height="100%">
      <ComposableMap>
        <ZoomableGroup>
          <Geographies
            geography={require('../../ne_110m_admin_0_countries.geojson')}
          >
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = geo.properties.ISO_A3_EH;

                const color = getColors(
                  colorScheme,
                  code,
                  correctCountry,
                  guessedCountries,
                  countryCodes
                );

                const name = geo.properties.NAME_EN;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: color.default },
                      hover: { fill: color.hover },
                    }}
                    data-tooltip-id="country-tooltip"
                    data-tooltip-content={name}
                    data-tooltip-float={true}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <MapLegend colorScheme={colorScheme} />
      <Tooltip id="country-tooltip" />
    </Box>
  );
};

type Colors = { default: string; hover: string };

interface ColorScheme {
  nonIndependent: Colors;
  guessed: Colors;
  default: Colors;
  correctAnswer: Colors;
}

const makeColorScheme = (): ColorScheme => {
  return {
    nonIndependent: {
      default: '#444444',
      hover: '#333333',
    },
    guessed: {
      default: '#730A00',
      hover: '#450600',
    },
    default: {
      default: '#0066FF',
      hover: '#0044DD',
    },
    correctAnswer: {
      default: '#004f08',
      hover: '#003605',
    },
  };
};

const getColors = (
  scheme: ColorScheme,
  countryCode: string,
  correctAnswer: string | undefined,
  guessedCountries: Set<string>,
  independentCountries: Set<string>
) => {
  if (countryCode === correctAnswer) {
    return scheme.correctAnswer;
  }

  if (guessedCountries.has(countryCode)) {
    return scheme.guessed;
  }

  if (!independentCountries.has(countryCode)) {
    return scheme.nonIndependent;
  }

  return scheme.default;
};

const MapLegend = ({ colorScheme }: { colorScheme: ColorScheme }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      columnGap="20px"
      alignItems="center"
    >
      <Tooltip id="map-legend" />
      <Typography>Colors:</Typography>
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.default.default }}
        data-tooltip-id="map-legend"
        data-tooltip-content="Country"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.guessed.default }}
        data-tooltip-id="map-legend"
        data-tooltip-content="Guessed country"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.nonIndependent.default }}
        data-tooltip-id="map-legend"
        data-tooltip-content="Non-independent country or region"
      />
    </Box>
  );
};

export default WorldMap;
