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
import { Hint, Hints, Side } from '../../types';

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

const LandlockedRow = ({ landlocked }: { landlocked: Hint<boolean> }) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = !landlocked.locked;

  const hintText = answerAvailable ? boolToStr(landlocked.value) : 'Unknown';
  const buttonText = answerAvailable
    ? 'Click to reveal'
    : `Unlocks in ${landlocked.unlocksIn} guesses`;

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

const DrivingSideRow = ({ drivingSide }: { drivingSide: Hint<Side> }) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = !drivingSide.locked;

  const hintText = answerAvailable ? drivingSide.value : 'Unknown';
  const buttonText = answerAvailable
    ? 'Click to reveal'
    : `Unlocks in ${drivingSide.unlocksIn} guesses`;

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

const CapitalRow = ({ capital }: { capital: Hint<null | string> }) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = !capital.locked;

  const hintText =
    !answerAvailable || !capital.value ? 'Unknown' : capital.value;

  const buttonText = answerAvailable
    ? 'Click to reveal'
    : `Unlocks in ${capital.unlocksIn} guesses`;

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
