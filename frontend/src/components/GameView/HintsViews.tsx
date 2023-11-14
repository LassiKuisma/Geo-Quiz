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
  Tooltip,
  Typography,
  keyframes,
} from '@mui/material';
import { useState } from 'react';

import { Hint, Hints } from '../../types/shared';

interface Props {
  hints: Hints;
  newHintsUnlocked: boolean;
  clearAnimation: () => void;
}

const expandAnimation = keyframes`
  30%, 70% {
    scale: 1;
  }
  50% {
    scale: 1.5;
  }
`;

const HintsView = ({ hints, newHintsUnlocked, clearAnimation }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Accordion
      sx={{ width: '400px', maxWidth: '100%' }}
      expanded={expanded}
      onChange={(_event, isOpening) => {
        setExpanded(isOpening);

        if (isOpening) {
          clearAnimation();
        }
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              animation:
                newHintsUnlocked && !expanded
                  ? `${expandAnimation} 2s linear infinite`
                  : 'none',
            }}
          />
        }
      >
        <Typography>Hints</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <HintRow
                name="Driving side"
                hint={hints.drivingSide}
                hintToStr={(s) => s}
              />
              <HintRow
                name="Landlocked"
                hint={hints.landlocked}
                hintToStr={(hint) => boolToStr(hint)}
              />
              <HintRow
                name="Amount of neighbours"
                hint={hints.neighbourCount}
                hintToStr={(count) =>
                  count === 1 ? `${count} neighbour` : `${count} neighbours`
                }
                tooltip="Only includes independent countries"
              />
              <HintRow
                name="Amount of languages"
                hint={hints.languageCount}
                hintToStr={(count) =>
                  count === 1 ? `${count} language` : `${count} languages`
                }
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
  tooltip?: string;
}

const HintRow = <T,>({ name, hint, hintToStr, tooltip }: HintRowProps<T>) => {
  const [revealed, setRevealed] = useState(false);

  const answerAvailable = !hint.locked;

  const hintText = answerAvailable ? hintToStr(hint.value) : 'Unknown';
  const buttonText = answerAvailable
    ? 'Click to reveal'
    : `Unlocks in ${hint.unlocksIn} guesses`;

  const cell = tooltip ? (
    <Tooltip title={<Box>{tooltip}</Box>}>
      <TableCell
        sx={{
          fontSize: 'medium',
          textDecorationStyle: 'dotted',
          textDecorationLine: 'underline',
        }}
      >
        {name}
      </TableCell>
    </Tooltip>
  ) : (
    <TableCell sx={{ fontSize: 'medium' }}>{name}</TableCell>
  );

  return (
    <TableRow>
      {cell}
      <TableCell>
        {revealed ? (
          <Box whiteSpace="nowrap">{hintText}</Box>
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
