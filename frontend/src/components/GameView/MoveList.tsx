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
  Tooltip,
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
  ':first-of-type': {
    borderLeft: '1px solid',
  },
  ':last-child': {
    borderRight: '1px solid',
  },
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  ':first-of-type': {
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
  directionVisible: boolean;
}

const MoveList = ({ moves, directionVisible }: Props) => {
  return (
    <Box display="contents">
      <Typography variant="h5" marginY="0.5em">
        Guesses
      </Typography>
      <TableContainer
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 'auto',
          minHeight: '40vh',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <HeaderCell>Country</HeaderCell>
              <HeaderCell>Region</HeaderCell>
              <TooltipHeader type="area">Area</TooltipHeader>
              <TooltipHeader type="population">Population</TooltipHeader>
              <HeaderCell>Common neighbours</HeaderCell>
              <HeaderCell>Same languages</HeaderCell>
              {directionVisible && <HeaderCell>Direction</HeaderCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {moves.map((move) => (
              <ResultRow
                key={move.guessedCountry.id}
                move={move}
                directionVisible={directionVisible}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

interface RowProps {
  move: GameMove;
  directionVisible: boolean;
}

const ResultRow = ({ move, directionVisible }: RowProps) => {
  // the icon I'm using is right-facing arrow. The angle returned by server
  // is 0=up, 90=right(east)
  const ARROW_ROTATION_OFFSET = -90;

  const country = move.guessedCountry;
  const comp = move.comparison;
  const correctAnswer = move.correct;
  const direction = move.comparison.direction;
  const angle = !direction ? undefined : direction + ARROW_ROTATION_OFFSET;

  const fontWeight = correctAnswer === true ? 'bold' : undefined;

  return (
    <TableRow
      hover
      sx={{
        '& > td': {
          fontWeight,
        },
      }}
    >
      <Cell fontSize="large">{move.guessedCountry.name}</Cell>
      <RegionCell
        region={country.region}
        regionCorrect={comp.regionEqual}
        subregion={country.subregion}
        subregionCorrect={comp.subregionEqual}
      />
      <Cell rightAlign>
        <DiffAsIcon diff={comp.areaDifference} />
        {country.area.toLocaleString()} km²
      </Cell>
      <Cell>
        <DiffAsIcon diff={comp.populationDifference} />
        {prefixNumber(country.population, 0)}
      </Cell>
      <Cell wrapText>
        {comp.sameNeighbours.length !== 0
          ? comp.sameNeighbours.map((n) => n.name).join(', ')
          : 'None'}
      </Cell>
      <Cell wrapText>
        {comp.sameLanguages.length !== 0
          ? comp.sameLanguages.join(', ')
          : 'None'}
      </Cell>
      {directionVisible && (
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
      )}
    </TableRow>
  );
};

interface CellProps {
  children?: React.ReactNode;
  fontSize?: 'small' | 'medium' | 'large';
  wrapText?: boolean;
  rightAlign?: boolean;
}

const Cell = ({ children, fontSize, wrapText, rightAlign }: CellProps) => {
  return (
    <StyledCell
      sx={{
        whiteSpace: wrapText ? 'normal' : 'nowrap',
        fontSize,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent={rightAlign ? 'right' : undefined}
      >
        {children}
      </Box>
    </StyledCell>
  );
};

interface RegionCellProps {
  region: string;
  regionCorrect: boolean;
  subregion: string;
  subregionCorrect: boolean;
}

const RegionCell = ({
  region,
  regionCorrect,
  subregion,
  subregionCorrect,
}: RegionCellProps) => {
  const color = (correct: boolean) => {
    return correct ? 'green' : 'red';
  };

  return (
    <Cell>
      <Stack>
        <Box
          display="flex"
          alignItems="center"
          color={color(regionCorrect)}
          whiteSpace="nowrap"
        >
          {boolToIcon(regionCorrect)}
          {region}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          color={color(subregionCorrect)}
          whiteSpace="nowrap"
          fontSize="small"
          marginLeft="0.3em"
        >
          {boolToIcon(subregionCorrect, true)}
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

const boolToIcon = (b: boolean, small?: boolean) => {
  return b ? (
    <CheckIcon fontSize={small ? 'small' : 'medium'} />
  ) : (
    <CloseIcon fontSize={small ? 'small' : 'medium'} />
  );
};

interface TooltipHeaderProps {
  children?: React.ReactNode;
  type: 'area' | 'population';
}

const TooltipHeader = ({ children, type }: TooltipHeaderProps) => {
  const explanations =
    type === 'area'
      ? ['larger area', 'smaller area']
      : ['more population', 'less population'];

  return (
    <Tooltip
      title={
        <Box display="flex" flexDirection="column">
          The correct answer has...
          <Box display="flex" flexDirection="row" alignItems="center">
            <ArrowDropUpIcon /> = {explanations[0]}
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <ArrowDropDownIcon /> = {explanations[1]}
          </Box>
        </Box>
      }
    >
      <HeaderCell
        sx={{
          textDecorationStyle: 'dotted',
          textDecorationLine: 'underline',
        }}
      >
        {children}
      </HeaderCell>
    </Tooltip>
  );
};

export default MoveList;
