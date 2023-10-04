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
import { Hint, Hints } from '../../types';

interface Props {
  hints: Hints;
}

const HintsView = ({ hints }: Props) => {
  return (
    <Box>
      <Typography variant="h5" marginY={2}>
        Hints
      </Typography>
      <TableContainer>
        <Table sx={{ width: 400 }}>
          <TableBody>
            <HintRow
              name="Landlocked"
              hint={hints.landlocked}
              hintToStr={(hint) => boolToStr(hint)}
            />
            <HintRow
              name="Driving side"
              hint={hints.drivingSide}
              hintToStr={(s) => s}
            />
            <HintRow
              name="Capital city"
              hint={hints.capital}
              hintToStr={(capital) => (!capital ? 'Unknown' : capital)}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

interface HintRowProps<T> {
  name: string;
  hint: Hint<T>;
  hintToStr: (hint: T) => string;
}

const HintRow = <T,>({ name, hint, hintToStr }: HintRowProps<T>) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = !hint.locked;

  const hintText = answerAvailable ? hintToStr(hint.value) : 'Unknown';
  const buttonText = answerAvailable
    ? 'Click to reveal'
    : `Unlocks in ${hint.unlocksIn} guesses`;

  return (
    <TableRow>
      <TableCell sx={{ fontSize: 'medium' }}>{name}</TableCell>
      <TableCell>
        {revealed ? (
          <Box>{hintText}</Box>
        ) : (
          <Button
            size="small"
            onClick={() => setRevealed(true)}
            disabled={!answerAvailable}
          >
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
