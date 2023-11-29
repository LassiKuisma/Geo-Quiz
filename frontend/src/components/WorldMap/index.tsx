import CircleIcon from '@mui/icons-material/Circle';
import { Box, Typography } from '@mui/material';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { prefixNumber } from '../../util/utils';

import { FilterOptions } from '../../types/internal';
import { Country, Difficulty, GameMove } from '../../types/shared';

type GameMapArgs = {
  k: 'game';
  guesses: Array<GameMove>;
  difficulty: Difficulty;
};
type InfoMapArgs = { k: 'info'; filters: FilterOptions };

interface WorldMapProps {
  countries: Array<Country>;
  mapArgs: GameMapArgs | InfoMapArgs;
}

const WorldMap = ({ countries, mapArgs }: WorldMapProps) => {
  const colorScheme = makeColorScheme();

  return (
    <Box width="100%" height="100%">
      <ComposableMap style={{ width: '100%', height: '100%' }}>
        <ZoomableGroup>
          <Geographies
            geography={require('../../ne_110m_admin_0_countries_minified.geojson')}
          >
            {({ geographies }) =>
              mapArgs.k === 'game'
                ? gameMap(geographies, countries, mapArgs)
                : infoMap(geographies, countries, mapArgs)
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
  neighbour: Colors;
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
    neighbour: {
      default: '#9b9e00',
      hover: '#5a5c00',
    },
  };
};

const getColors = (
  scheme: ColorScheme,
  countryCode: string,
  codes: CountryCodes
) => {
  if (countryCode === codes.correctAnswer) {
    return scheme.correctAnswer;
  }

  if (codes.guessed.has(countryCode)) {
    return scheme.guessed;
  }

  if (codes.neighbours.has(countryCode)) {
    return scheme.neighbour;
  }

  if (!codes.notGuessed.has(countryCode)) {
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
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.neighbour.default }}
        data-tooltip-id="map-legend"
        data-tooltip-content="Neighbour of the correct answer"
      />
      <Box fontSize="small" marginLeft="auto">
        Map source:
        <br />
        <a
          href="https://www.naturalearthdata.com/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </Box>
    </Box>
  );
};

interface CountryCodes {
  guessed: Set<string>;
  correctAnswer: string | undefined;
  neighbours: Set<string>;
  notGuessed: Set<string>;
}

const countryCodesFromMoves = (
  moves: Array<GameMove>,
  countries: Array<Country>
): CountryCodes => {
  const codes = moves.reduce(
    (result: CountryCodes, move) => {
      result.guessed.add(move.guessedCountry.countryCode);

      if (move.correct) {
        result.correctAnswer = move.guessedCountry.countryCode;
      } else {
        move.comparison.sameNeighbours.forEach((n) => {
          result.neighbours.add(n.countryCode);
        });
      }

      return result;
    },
    {
      guessed: new Set<string>(),
      correctAnswer: undefined,
      neighbours: new Set<string>(),
      notGuessed: new Set<string>(),
    }
  );

  countries.forEach((country) => {
    codes.notGuessed.add(country.countryCode);
  });

  return codes;
};

const gameMap = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geographies: Array<any>,
  countries: Array<Country>,
  { guesses, difficulty }: GameMapArgs
) => {
  const colorScheme = makeColorScheme();
  const countryCodes = countryCodesFromMoves(guesses, countries);

  return geographies.map((geo) => {
    const code = geo.properties.ISO_A3_EH;
    const name = geo.properties.NAME_EN;

    const color = getColors(colorScheme, code, countryCodes);
    const showTooltip =
      difficulty === 'hard' ? countryCodes.guessed.has(code) : true;
    const isGameOver = !!countryCodes.correctAnswer;
    const tooltip = showTooltip || isGameOver ? name : '???';

    return (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        style={{
          default: { fill: color.default },
          hover: { fill: color.hover },
        }}
        data-tooltip-id="country-tooltip"
        data-tooltip-content={tooltip}
        data-tooltip-float={true}
      />
    );
  });
};

const infoMap = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geographies: Array<any>,
  countries: Array<Country>,
  { filters }: InfoMapArgs
) => {
  const colorScheme = makeColorScheme();

  const countriesByCode = countries.reduce(
    (result, country) => result.set(country.countryCode, country),
    new Map<string, Country>()
  );

  const getTooltip = (country: Country | undefined, name: string): string => {
    if (!country) {
      return name;
    }

    const area = country.area.toLocaleString();
    const population = prefixNumber(country.population, 1);

    return `${country.name}<br/>Area: ${area} km²<br/>Population: ${population}`;
  };

  const getColor = (country: Country | undefined) => {
    if (!country) {
      return colorScheme.nonIndependent;
    }

    if (filterIsEmpty()) {
      return colorScheme.default;
    }

    if (passesFilters(country)) {
      return colorScheme.correctAnswer;
    } else {
      return colorScheme.guessed;
    }
  };

  const filterIsEmpty = () => {
    return (
      filters.shownSubregions.length === 0 &&
      !filters.area.minimum &&
      !filters.area.maximum &&
      !filters.population.minimum &&
      !filters.population.maximum &&
      filters.nameFilter.length === 0
    );
  };

  const passesFilters = (country: Country) => {
    const subregionPasses = (country: Country) => {
      if (filters.shownSubregions.length === 0) {
        return true;
      }

      return filters.shownSubregions.some(
        ({ subregion }) => subregion === country.subregion
      );
    };

    const namePasses = (country: Country) => {
      if (filters.nameFilter.length === 0) {
        return true;
      }

      const name = filters.nameFilter.trim().toLowerCase();
      return country.name.toLowerCase().includes(name);
    };

    const areaPasses = (country: Country) => {
      const largerThanMin = filters.area.minimum
        ? country.area >= filters.area.minimum
        : true;

      const smallerThanMax = filters.area.maximum
        ? country.area <= filters.area.maximum
        : true;

      return largerThanMin && smallerThanMax;
    };

    const populationPasses = (country: Country) => {
      const moreThanMin = filters.population.minimum
        ? country.population >= filters.population.minimum
        : true;

      const lessThanMax = filters.population.maximum
        ? country.population <= filters.population.maximum
        : true;

      return moreThanMin && lessThanMax;
    };

    return (
      areaPasses(country) &&
      populationPasses(country) &&
      subregionPasses(country) &&
      namePasses(country)
    );
  };

  return geographies.map((geo) => {
    const code = geo.properties.ISO_A3_EH;
    const name = geo.properties.NAME_EN;

    const country = countriesByCode.get(code);

    const color = getColor(country);

    const tooltip = getTooltip(country, name);

    return (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        style={{
          default: { fill: color.default },
          hover: { fill: color.hover },
        }}
        data-tooltip-id="country-tooltip"
        data-tooltip-html={tooltip}
        data-tooltip-float={true}
      />
    );
  });
};

export default WorldMap;
