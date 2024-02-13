import CircleIcon from '@mui/icons-material/Circle';
import { Box, Typography } from '@mui/material';
import { Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';

import { Country, Difficulty, GameMove } from '@common/api';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geographies: Array<any>;
  countries: Array<Country>;
  guesses: Array<GameMove>;
  difficulty: Difficulty;
}

type Colors = { default: string; hover: string };

interface ColorScheme {
  nonIndependent: Colors;
  guessed: Colors;
  default: Colors;
  correctAnswer: Colors;
  neighbour: Colors;
}

const GameMap = ({ geographies, countries, guesses, difficulty }: Props) => {
  const colorScheme = makeColorScheme();
  const countryCodes = countryCodesFromMoves(guesses, countries);

  return (
    <>
      {geographies.map((geo) => {
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
      })}
    </>
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

const GameMapLegend = () => {
  const colorScheme = makeColorScheme();

  return (
    <Box
      display="flex"
      flexDirection="row"
      columnGap="20px"
      alignItems="center"
    >
      <Tooltip id="game-map-legend" />
      <Typography>Colors:</Typography>
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.default.default }}
        data-tooltip-id="game-map-legend"
        data-tooltip-content="Country"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.guessed.default }}
        data-tooltip-id="game-map-legend"
        data-tooltip-content="Guessed country"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.nonIndependent.default }}
        data-tooltip-id="game-map-legend"
        data-tooltip-content="Non-independent country or region"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.neighbour.default }}
        data-tooltip-id="game-map-legend"
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

export { GameMap, GameMapLegend };
