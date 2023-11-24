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

import { FilterOptions, Subregion } from '../../../types/internal';

interface Props {
  subregions: Array<Subregion>;
  filterOptions: FilterOptions;
  setFilterOptions: (_: FilterOptions) => void;
}

const CountryFilter = ({
  subregions,
  filterOptions,
  setFilterOptions,
}: Props) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Filters
      </AccordionSummary>
      <AccordionDetails>
        <Box width="50%">
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
              <TableCell>Area</TableCell>
              <TableCell width="100%">
                <FilterByArea
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Population</TableCell>
              <TableCell width="100%">
                <FilterByPopulation
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
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
