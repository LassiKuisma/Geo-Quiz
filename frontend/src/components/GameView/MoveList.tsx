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
              <TableCell>Area</TableCell>
              <TableCell>Landlocked</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Driving side</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Subregion</TableCell>
              <TableCell>Continents</TableCell>
              <TableCell>Languages</TableCell>
              <TableCell>Neighbours</TableCell>
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
        {diffToStr(comp.areaDifference)} {country.area} km²
      </TableCell>
      <TableCell>
        {boolToIcon(comp.landlockedEquality)} {boolToStr(country.landlocked)}
      </TableCell>
      <TableCell>
        {diffToStr(comp.populationDifference)}{' '}
        {populationToStr(country.population)}
      </TableCell>
      <TableCell>
        {boolToIcon(comp.drivingSideEqual)} {country.drivingSide}
      </TableCell>
      <TableCell>
        {boolToIcon(comp.regionEqual)} {country.region}
      </TableCell>
      <TableCell>
        {boolToIcon(comp.subregionEqual)} {country.subregion}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

const populationToStr = (population: number): string => {
  if (population > 1_000_000) {
    const m = (population / 1_000_000).toFixed(1);
    return `${m} million`;
  }

  if (population > 1_000) {
    const k = (population / 1_000).toFixed(1);
    return `${k} thousand`;
  }

  return population.toString();
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
