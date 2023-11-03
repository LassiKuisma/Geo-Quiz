import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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

import { Hint, Hints } from '../../types/shared';

interface Props {
  hints: Hints;
}

const HintsView = ({ hints }: Props) => {
  return (
    <Accordion sx={{ width: '400px', maxWidth: '100%', marginY: '1em' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Hints</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table size="small">
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
      </AccordionDetails>
    </Accordion>
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
