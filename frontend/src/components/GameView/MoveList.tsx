import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Difference, Move } from '../../types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props {
  moves: Array<Move>;
}

const MoveList = ({ moves }: Props) => {
  return (
    <div>
      Guesses
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Country</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Subregion</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Neighbours</TableCell>
              <TableCell>Languages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moves.map((move) => (
              <ResultRow key={move.guessedCountry.id} move={move} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const ResultRow = ({ move }: { move: Move }) => {
  const country = move.guessedCountry;
  const comp = move.result.comparison;
  return (
    <TableRow>
      <TableCell>{move.guessedCountry.name}</TableCell>
      <TableCell>
        {boolToIcon(comp.regionEqual)} {country.region}
      </TableCell>
      <TableCell>
        {boolToIcon(comp.subregionEqual)} {country.subregion}
      </TableCell>
      <TableCell>
        <DiffAsIcon diff={comp.areaDifference} />
        {bigNumberToString(country.area, 0)} km²
      </TableCell>
      <TableCell>
        <DiffAsIcon diff={comp.populationDifference} />
        {bigNumberToString(country.population, 0)}
      </TableCell>
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
    <TableCell>
      {correct.length !== 0 && (
        <Box>
          <CheckIcon />
          {correct.join(', ')}
        </Box>
      )}
      {wrong.length !== 0 && (
        <Box>
          <CloseIcon />
          {wrong.join(', ')}
        </Box>
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
