import CircleIcon from '@mui/icons-material/Circle';
import { Box, Typography } from '@mui/material';
import { Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { isFilterEmpty, passesFilters } from '../../util/filters';
import { prefixNumber } from '../../util/utils';

import { FilterOptions } from '../../types/internal';
import { Country } from '../../../../common/api';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geographies: Array<any>;
  countries: Array<Country>;
  filters: FilterOptions;
}

const InfoMap = ({ geographies, countries, filters }: Props) => {
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

    if (isFilterEmpty(filters)) {
      return colorScheme.default;
    }

    if (passesFilters(filters, country)) {
      return colorScheme.passesFilters;
    } else {
      return colorScheme.filteredOut;
    }
  };

  return (
    <>
      {geographies.map((geo) => {
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
      })}
    </>
  );
};

type Colors = { default: string; hover: string };

interface ColorScheme {
  nonIndependent: Colors;
  filteredOut: Colors;
  default: Colors;
  passesFilters: Colors;
}

const makeColorScheme = (): ColorScheme => {
  return {
    nonIndependent: {
      default: '#444444',
      hover: '#333333',
    },
    filteredOut: {
      default: '#730A00',
      hover: '#450600',
    },
    default: {
      default: '#0066FF',
      hover: '#0044DD',
    },
    passesFilters: {
      default: '#004f08',
      hover: '#003605',
    },
  };
};

const InfoMapLegend = () => {
  const colorScheme = makeColorScheme();

  return (
    <Box
      display="flex"
      flexDirection="row"
      columnGap="20px"
      alignItems="center"
    >
      <Tooltip id="info-map-legend" />
      <Typography>Colors:</Typography>
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.default.default }}
        data-tooltip-id="info-map-legend"
        data-tooltip-content="Country"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.nonIndependent.default }}
        data-tooltip-id="info-map-legend"
        data-tooltip-content="Non-independent country or region"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.passesFilters.default }}
        data-tooltip-id="info-map-legend"
        data-tooltip-content="Country matching filters"
      />
      <CircleIcon
        fontSize="large"
        sx={{ color: colorScheme.filteredOut.default }}
        data-tooltip-id="info-map-legend"
        data-tooltip-content="Country not matching filters"
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

export { InfoMap, InfoMapLegend };
