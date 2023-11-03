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
  borderColor: theme.palette.primary.light,
  border: 0,
  borderTop: '1px solid',
  ':first-child': {
    borderLeft: '1px solid',
  },
  ':last-child': {
    borderRight: '1px solid',
  },
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  ':first-child': {
    borderLeft: '1px solid',
    borderLeftColor: theme.palette.primary.light,
  },
  ':last-child': {
    borderRight: '1px solid',
    borderRightColor: theme.palette.primary.light,
  },
}));

interface Props {
  moves: Array<GameMove>;
}

const MoveList = ({ moves }: Props) => {
  return (
    <Box display="contents">
      <Typography variant="h5" marginY="0.5em">
        Guesses
      </Typography>
      <TableContainer sx={{ flexGrow: 1, flexShrink: 1, flexBasis: 'auto' }}>
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
    </Box>
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
      <Cell correctAnswer={correctAnswer}>
        {comp.sameNeighbours.length !== 0
          ? comp.sameNeighbours.join(', ')
          : 'None'}
      </Cell>
      <Cell correctAnswer={correctAnswer}>
        {comp.sameLanguages.length !== 0
          ? comp.sameLanguages.join(', ')
          : 'None'}
      </Cell>
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
    <StyledCell>
      <Stack
        direction="row"
        alignItems="center"
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        {children}
      </Stack>
    </StyledCell>
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
