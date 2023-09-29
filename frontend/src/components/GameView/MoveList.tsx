import {
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

interface Props {
  moves: Array<Move>;
}

const MoveList = ({ moves }: Props) => {
  const _a = moves;

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
              <TableCell>Landlocked</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Driving side</TableCell>
              <TableCell>Neighbours</TableCell>
              <TableCell>Continents</TableCell>
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
        {diffToStr(comp.areaDifference)} {bigNumberToString(country.area, 0)}{' '}
        km²
      </TableCell>
      <TableCell>
        {boolToIcon(comp.landlockedEquality)} {boolToStr(country.landlocked)}
      </TableCell>
      <TableCell>
        {diffToStr(comp.populationDifference)}{' '}
        {bigNumberToString(country.population, 0)}
      </TableCell>
      <TableCell>
        {boolToIcon(comp.drivingSideEqual)} {country.drivingSide}
      </TableCell>
      <ArrayCell
        values={country.neighbours}
        correctValues={comp.sameNeighbours}
      />
      <ArrayCell
        values={country.continents}
        correctValues={comp.sameContinents}
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
      Correct: {correct.join(', ')}
      <br />
      Wrong: {wrong.join(', ')}
    </TableCell>
  );
};

const bigNumberToString = (number: number, digits: number): string => {
  if (number > 1_000_000) {
    const m = (number / 1_000_000).toFixed(digits);
    return `${m} million`;
  }

  if (number > 1_000) {
    const k = (number / 1_000).toFixed(1);
    return `${k} thousand`;
  }

  return number.toString();
};

const diffToStr = (diff: Difference) => {
  if (diff === 'more') {
    return '>';
  } else if (diff === 'less') {
    return '<';
  } else {
    return '=';
  }
};

const boolToIcon = (b: boolean) => {
  return b ? <CheckIcon /> : <CloseIcon />;
};

const boolToStr = (b: boolean): string => {
  return b ? 'yes' : 'no';
};

export default MoveList;
