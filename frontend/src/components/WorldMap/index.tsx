import { Box } from '@mui/material';
import { ComposableMap, Geographies, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';

import { GameMap, GameMapLegend } from './GameMap';
import { InfoMap, InfoMapLegend } from './InfoMap';

import { FilterOptions } from '../../types/filter';
import { Country, Difficulty, GameMove } from '@common/api';

import Map from '../../ne_110m_admin_0_countries_minified.json';

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
  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <ComposableMap style={{ width: '100%', height: '100%' }}>
        <ZoomableGroup>
          <Geographies geography={Map}>
            {({ geographies }) =>
              mapArgs.k === 'game' ? (
                <GameMap
                  geographies={geographies}
                  countries={countries}
                  guesses={mapArgs.guesses}
                  difficulty={mapArgs.difficulty}
                />
              ) : (
                <InfoMap
                  geographies={geographies}
                  countries={countries}
                  filters={mapArgs.filters}
                />
              )
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {mapArgs.k === 'game' ? <GameMapLegend /> : <InfoMapLegend />}
      <Tooltip id="country-tooltip" />
    </Box>
  );
};

export default WorldMap;
