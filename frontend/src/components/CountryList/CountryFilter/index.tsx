import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import FilterByArea from './FilterByArea';
import FilterByName from './FilterByName';
import FilterByPopulation from './FilterByPopulation';
import FilterByRegion from './FilterByRegion';

import { FilterOptions, Subregion } from '../../../types/filter';

interface Props {
  subregions: Array<Subregion>;
  filterOptions: FilterOptions;
  setFilterOptions: (_: FilterOptions) => void;
  hasSmallDevice: boolean;
}

const CountryFilter = ({
  subregions,
  filterOptions,
  setFilterOptions,
  hasSmallDevice,
}: Props) => {
  const cellPadding = hasSmallDevice ? 'none' : 'normal';

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Filters
      </AccordionSummary>
      <AccordionDetails>
        <Box width={hasSmallDevice ? '100%' : '50%'}>
          <FilterByName
            setNameFilter={(name) => {
              setFilterOptions({
                ...filterOptions,
                nameFilter: name,
              });
            }}
          />
          <FilterByRegion
            subregions={subregions}
            selectedSubregions={filterOptions.shownSubregions}
            setSelectedSubregions={(selected) => {
              setFilterOptions({
                ...filterOptions,
                shownSubregions: selected,
              });
            }}
          />
        </Box>
        <Table size="small" sx={{ marginTop: '0.75em' }}>
          <TableBody>
            <TableRow>
              <TableCell padding={cellPadding}>Area</TableCell>
              <TableCell width="100%" padding={cellPadding}>
                <FilterByArea
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                  hasSmallDevice={hasSmallDevice}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell padding={cellPadding}>Population</TableCell>
              <TableCell width="100%" padding={cellPadding}>
                <FilterByPopulation
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                  hasSmallDevice={hasSmallDevice}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

export default CountryFilter;
