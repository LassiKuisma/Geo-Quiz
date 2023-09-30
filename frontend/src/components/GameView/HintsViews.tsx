import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Hints, Side } from '../../types';

interface Props {
  hints: Hints;
}

const HintsView = ({ hints }: Props) => {
  const _a = hints;
  return (
    <Box>
      <Typography variant="h5">Hints</Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <LandlockedRow landlocked={hints.landlocked} />
            <DrivingSideRow drivingSide={hints.drivingSide} />
            <CapitalRow capital={hints.capital} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const LandlockedRow = ({ landlocked }: { landlocked: null | boolean }) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = landlocked !== null;

  const hintText = answerAvailable ? boolToStr(landlocked) : 'Unknown';
  const buttonText = answerAvailable ? 'Click to reveal' : 'Not yet available';

  return (
    <TableRow>
      <TableCell sx={{ width: 300 }}>Landlocked</TableCell>
      <TableCell>
        {revealed ? (
          <Box>{hintText}</Box>
        ) : (
          <Button onClick={() => setRevealed(true)} disabled={!answerAvailable}>
            {buttonText}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const DrivingSideRow = ({ drivingSide }: { drivingSide: null | Side }) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = drivingSide !== null;

  const hintText = answerAvailable ? drivingSide : 'Unknown';
  const buttonText = answerAvailable ? 'Click to reveal' : 'Not yet available';

  return (
    <TableRow>
      <TableCell sx={{ width: 300 }}>Driving side</TableCell>
      <TableCell>
        {revealed ? (
          <Box>{hintText}</Box>
        ) : (
          <Button onClick={() => setRevealed(true)} disabled={!answerAvailable}>
            {buttonText}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const CapitalRow = ({ capital }: { capital: null | string }) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = capital !== null;

  const hintText = answerAvailable ? capital : 'Unknown';
  const buttonText = answerAvailable ? 'Click to reveal' : 'Not yet available';

  return (
    <TableRow>
      <TableCell sx={{ width: 300 }}>Capital city</TableCell>
      <TableCell>
        {revealed ? (
          <Box>{hintText}</Box>
        ) : (
          <Button onClick={() => setRevealed(true)} disabled={!answerAvailable}>
            {buttonText}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const boolToStr = (b: boolean): string => {
  return b ? 'yes' : 'no';
};

export default HintsView;
