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
import { Difference, Move } from '../../types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Arrow from '@mui/icons-material/TrendingFlat';
import React from 'react';
import { prefixNumber } from '../../util/utils';

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: 'large',
  fontWeight: 'bold',
  background: theme.palette.primary.contrastText,
}));

interface Props {
  moves: Array<Move>;
}

const MoveList = ({ moves }: Props) => {
  return (
    <Box>
      <Typography variant="h5" marginY={3}>
        Guesses
      </Typography>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <HeaderCell>Country</HeaderCell>
              <HeaderCell>Region</HeaderCell>
              <HeaderCell>Subregion</HeaderCell>
              <HeaderCell>Area</HeaderCell>
              <HeaderCell>Population</HeaderCell>
              <HeaderCell>Neighbours</HeaderCell>
              <HeaderCell>Languages</HeaderCell>
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

const ResultRow = ({ move }: { move: Move }) => {
  // the icon I'm using is right-facing arrow. The angle returned by server
  // is 0=up, 90=right(east)
  const ARROW_ROTATION_OFFSET = -90;

  const country = move.guessedCountry;
  const comp = move.result.comparison;
  const correctAnswer = move.result.correct;
  const direction = move.result.comparison.direction;
  const angle = !direction ? undefined : direction + ARROW_ROTATION_OFFSET;

  return (
    <TableRow hover>
      <Cell fontSize="large" maxWidth="8rem" correctAnswer={correctAnswer}>
        {move.guessedCountry.name}
      </Cell>
      <Cell maxWidth="8rem" correctAnswer={correctAnswer}>
        {boolToIcon(comp.regionEqual)}
        {country.region}
      </Cell>
      <Cell maxWidth="8rem" correctAnswer={correctAnswer}>
        {boolToIcon(comp.subregionEqual)}
        {country.subregion}
      </Cell>
      <Cell maxWidth="8rem" correctAnswer={correctAnswer}>
        <DiffAsIcon diff={comp.areaDifference} />
        {prefixNumber(country.area, 0)} km²
      </Cell>
      <Cell maxWidth="8rem" correctAnswer={correctAnswer}>
        <DiffAsIcon diff={comp.populationDifference} />
        {prefixNumber(country.population, 0)}
      </Cell>
      <ArrayCell
        values={country.neighbours}
        correctValues={comp.sameNeighbours}
        correctAnswer={correctAnswer}
      />
      <ArrayCell
        values={country.languages}
        correctValues={comp.sameLanguages}
        correctAnswer={correctAnswer}
      />
      <Cell maxWidth="4rem">
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
  maxWidth?: string;
  fontSize?: 'small' | 'medium' | 'large';
  correctAnswer?: boolean;
}

const Cell = ({ children, maxWidth, fontSize, correctAnswer }: CellProps) => {
  const fontWeight = correctAnswer === true ? 'bold' : undefined;
  return (
    <TableCell sx={{ maxWidth: maxWidth }}>
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

interface ArrayCellProps {
  values: Array<string>;
  correctValues: Array<string>;
  correctAnswer?: boolean;
}

const ArrayCell = ({
  values,
  correctValues,
  correctAnswer,
}: ArrayCellProps) => {
  const correct = new Array<string>();
  const wrong = new Array<string>();

  values.forEach((continent) => {
    if (correctValues.includes(continent)) {
      correct.push(continent);
    } else {
      wrong.push(continent);
    }
  });

  const fontWeight = correctAnswer === true ? 'bold' : undefined;

  return (
    <TableCell sx={{ maxWidth: '12rem' }}>
      {correct.length !== 0 && (
        <Stack
          direction="row"
          alignItems="center"
          fontWeight={fontWeight}
          marginBottom={1}
        >
          <CheckIcon />
          {correct.join(', ')}
        </Stack>
      )}
      {wrong.length !== 0 && (
        <Stack
          direction="row"
          alignItems="center"
          fontWeight={fontWeight}
          marginTop={1}
        >
          <CloseIcon />
          {wrong.join(', ')}
        </Stack>
      )}
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
