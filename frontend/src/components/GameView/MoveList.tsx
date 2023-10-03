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
import React from 'react';

const HeaderCell = styled(TableCell)({
  fontSize: 'large',
  fontWeight: 'bold',
  background: 'grey',
});

interface Props {
  moves: Array<Move>;
}

const MoveList = ({ moves }: Props) => {
  return (
    <Box>
      <Typography variant="h5" marginY={3} marginX={1}>
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
  const country = move.guessedCountry;
  const comp = move.result.comparison;
  return (
    <TableRow hover>
      <Cell fontSize="large" maxWidth={200}>
        {move.guessedCountry.name}
      </Cell>
      <Cell>
        {boolToIcon(comp.regionEqual)}
        {country.region}
      </Cell>
      <Cell>
        {boolToIcon(comp.subregionEqual)}
        {country.subregion}
      </Cell>
      <Cell>
        <DiffAsIcon diff={comp.areaDifference} />
        {bigNumberToString(country.area, 0)} km²
      </Cell>
      <Cell>
        <DiffAsIcon diff={comp.populationDifference} />
        {bigNumberToString(country.population, 0)}
      </Cell>
      <ArrayCell
        values={country.neighbours}
        correctValues={comp.sameNeighbours}
      />
      <ArrayCell
        values={country.languages}
        correctValues={comp.sameLanguages}
      />
    </TableRow>
  );
};

interface CellProps {
  children?: React.ReactNode;
  maxWidth?: number;
  fontSize?: 'small' | 'medium' | 'large';
}

const Cell = ({ children, maxWidth, fontSize }: CellProps) => {
  return (
    <TableCell sx={{ maxWidth }}>
      <Stack direction="row" alignItems="center" fontSize={fontSize}>
        {children}
      </Stack>
    </TableCell>
  );
};

interface ArrayCellProps {
  values: Array<string>;
  correctValues: Array<string>;
}

const ArrayCell = ({ values, correctValues }: ArrayCellProps) => {
  const correct = new Array<string>();
  const wrong = new Array<string>();

  values.forEach((continent) => {
    if (correctValues.includes(continent)) {
      correct.push(continent);
    } else {
      wrong.push(continent);
    }
  });

  return (
    <TableCell sx={{ maxWidth: 200 }}>
      {correct.length !== 0 && (
        <Stack direction="row" alignItems="center">
          <CheckIcon />
          {correct.join(', ')}
        </Stack>
      )}
      {wrong.length !== 0 && (
        <Stack direction="row" alignItems="center">
          <CloseIcon />
          {wrong.join(', ')}
        </Stack>
      )}
    </TableCell>
  );
};

const bigNumberToString = (number: number, digits: number): string => {
  if (number > 1_000_000) {
    const m = (number / 1_000_000).toFixed(digits);
    return `${m} million`;
  }

  if (number > 1_000) {
    const k = (number / 1_000).toFixed(digits);
    return `${k} thousand`;
  }

  return number.toString();
};

const DiffAsIcon = ({ diff }: { diff: Difference }) => {
  // why do the symbols here seem to be the wrong way around?
  // example: correct answer has population=9999, you guess a country
  // with population=10, the API will return 'less', (10 < 999). Then we
  // display that in frontend: 'You guessed country with population=10,
  // the correct answer has more than that'
  if (diff === 'more') {
    return <ArrowDropDownIcon />;
  } else if (diff === 'less') {
    return <ArrowDropUpIcon />;
  } else {
    return <></>;
  }
};

const boolToIcon = (b: boolean) => {
  return b ? <CheckIcon /> : <CloseIcon />;
};

export default MoveList;
