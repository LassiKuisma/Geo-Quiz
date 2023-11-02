import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Arrow from '@mui/icons-material/TrendingFlat';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import React from 'react';

import { prefixNumber } from '../../util/utils';

import { Difference, GameMove } from '../../types/shared';

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: 'large',
  fontWeight: 'bold',
  background: theme.palette.primary.contrastText,
}));

interface Props {
  moves: Array<GameMove>;
  hasSmallDevice: boolean;
}

const leftArrow = '\u{2190}'; // ←
const rightArrow = '\u{2192}'; // →

const MoveList = ({ moves, hasSmallDevice }: Props) => {
  return (
    <>
      <Typography variant="h5" marginY="0.5em">
        Guesses
      </Typography>
      {hasSmallDevice && (
        <Box>
          {leftArrow} Scroll sideways {rightArrow}
        </Box>
      )}
      <TableContainer sx={{ maxHeight: '65vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <HeaderCell>Country</HeaderCell>
              <HeaderCell>Region</HeaderCell>
              <HeaderCell>Area</HeaderCell>
              <HeaderCell>Population</HeaderCell>
              <HeaderCell>Same neighbours</HeaderCell>
              <HeaderCell>Same languages</HeaderCell>
              <HeaderCell>Direction</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moves.map((move) => (
              <ResultRow key={move.guessedCountry.id} move={move} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const ResultRow = ({ move }: { move: GameMove }) => {
  // the icon I'm using is right-facing arrow. The angle returned by server
  // is 0=up, 90=right(east)
  const ARROW_ROTATION_OFFSET = -90;

  const country = move.guessedCountry;
  const comp = move.comparison;
  const correctAnswer = move.correct;
  const direction = move.comparison.direction;
  const angle = !direction ? undefined : direction + ARROW_ROTATION_OFFSET;

  return (
    <TableRow hover>
      <Cell fontSize="large" correctAnswer={correctAnswer}>
        {move.guessedCountry.name}
      </Cell>
      <RegionCell
        correctAnswer={correctAnswer}
        region={country.region}
        regionCorrect={comp.regionEqual}
        subregion={country.subregion}
        subregionCorrect={comp.subregionEqual}
      />
      <Cell correctAnswer={correctAnswer}>
        <DiffAsIcon diff={comp.areaDifference} />
        {prefixNumber(country.area, 0)} km²
      </Cell>
      <Cell correctAnswer={correctAnswer}>
        <DiffAsIcon diff={comp.populationDifference} />
        {prefixNumber(country.population, 0)}
      </Cell>
      <ArrayCell
        correctValues={comp.sameNeighbours}
        correctAnswer={correctAnswer}
      />
      <ArrayCell
        correctValues={comp.sameLanguages}
        correctAnswer={correctAnswer}
      />
      <Cell>
        {angle && (
          <Arrow
            fontSize="large"
            sx={{
              rotate: angle + 'deg',
            }}
          />
        )}
      </Cell>
    </TableRow>
  );
};

interface CellProps {
  children?: React.ReactNode;
  fontSize?: 'small' | 'medium' | 'large';
  correctAnswer?: boolean;
}

const Cell = ({ children, fontSize, correctAnswer }: CellProps) => {
  const fontWeight = correctAnswer === true ? 'bold' : undefined;
  return (
    <TableCell>
      <Stack
        direction="row"
        alignItems="center"
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        {children}
      </Stack>
    </TableCell>
  );
};

interface RegionCellProps {
  correctAnswer: boolean;
  region: string;
  regionCorrect: boolean;
  subregion: string;
  subregionCorrect: boolean;
}

const RegionCell = ({
  correctAnswer,
  region,
  regionCorrect,
  subregion,
  subregionCorrect,
}: RegionCellProps) => {
  const color = (correct: boolean) => {
    return correct ? 'green' : 'red';
  };

  return (
    <Cell correctAnswer={correctAnswer}>
      <Stack>
        <Box display="flex" alignItems="center" color={color(regionCorrect)}>
          {boolToIcon(regionCorrect)}
          {region}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          marginLeft="15%"
          color={color(subregionCorrect)}
        >
          {boolToIcon(subregionCorrect)}
          {subregion}
        </Box>
      </Stack>
    </Cell>
  );
};

interface ArrayCellProps {
  correctValues: Array<string>;
  correctAnswer?: boolean;
}

const ArrayCell = ({ correctValues, correctAnswer }: ArrayCellProps) => {
  const fontWeight = correctAnswer === true ? 'bold' : undefined;

  return (
    <TableCell sx={{ fontWeight }}>
      {correctValues.length !== 0 ? correctValues.join(', ') : 'None'}
    </TableCell>
  );
};

const DiffAsIcon = ({ diff }: { diff: Difference }) => {
  if (diff === 'less') {
    return <ArrowDropDownIcon />;
  } else if (diff === 'more') {
    return <ArrowDropUpIcon />;
  } else {
    return <></>;
  }
};

const boolToIcon = (b: boolean) => {
  return b ? <CheckIcon /> : <CloseIcon />;
};

export default MoveList;
