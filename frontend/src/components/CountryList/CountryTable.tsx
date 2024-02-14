import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  styled,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useMemo, useState } from 'react';

import { prefixNumber } from '../../util/utils';

import { FilterOptions } from '../../types/filter';
import { Country } from '@common/api';

type Order = 'asc' | 'desc';

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = <Key extends SortableColumn>(
  order: Order,
  orderBy: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) => {
  const orderMult = order === 'desc' ? 1 : -1;
  // direction should be reversed if comparing numeric values:
  // "A" < "Z" => true ("A" should be at top when desc)
  // 999 < 1 => false (999 should be at top when desc -> reverse)
  const numericMult = orderBy === 'Area' || orderBy === 'Population' ? -1 : 1;
  const direction = orderMult * numericMult;

  return (a, b) => direction * descendingComparator(a, b, orderBy);
};

interface CountryRow {
  Country: string;
  Region: string;
  Subregion: string;
  Area: number;
  Population: number;
  Neighbours: string;
  Languages: string;
  Location: { lat: number; lng: number };
}

type SortableColumn =
  | 'Country'
  | 'Region'
  | 'Subregion'
  | 'Area'
  | 'Population';

const isSortable = (param: string): param is SortableColumn => {
  return ['Country', 'Region', 'Subregion', 'Area', 'Population'].includes(
    param
  );
};

interface Props {
  countries: Array<Country>;
  filters: FilterOptions;
}

const CountryTable = ({ countries, filters }: Props) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<SortableColumn>('Country');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: SortableColumn
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const countriesAsRows: Array<CountryRow> = countries.map((country) => ({
    Country: country.name,
    Region: country.region,
    Subregion: country.subregion,
    Area: country.area,
    Population: country.population,
    Neighbours: country.neighbours
      .slice()
      .map((c) => c.name)
      .sort()
      .join(', '),
    Languages: country.languages.slice().sort().join(', '),
    Location: { lat: country.location_lat, lng: country.location_lng },
  }));

  const rowsSorted = useMemo(
    () => countriesAsRows.sort(getComparator(order, orderBy)),
    [order, orderBy]
  );

  const subregionFilter = (row: CountryRow) => {
    if (filters.shownSubregions.length === 0) {
      return true;
    }

    return filters.shownSubregions.some(
      ({ subregion }) => subregion === row.Subregion
    );
  };

  const nameFilter = (row: CountryRow) => {
    if (filters.nameFilter.length === 0) {
      return true;
    }

    const name = filters.nameFilter.trim().toLowerCase();
    return row.Country.toLowerCase().includes(name);
  };

  const areaFilter = (row: CountryRow) => {
    const largerThanMin = filters.area.minimum
      ? row.Area >= filters.area.minimum
      : true;

    const smallerThanMax = filters.area.maximum
      ? row.Area <= filters.area.maximum
      : true;

    return largerThanMin && smallerThanMax;
  };

  const populationFilter = (row: CountryRow) => {
    const moreThanMin = filters.population.minimum
      ? row.Population >= filters.population.minimum
      : true;

    const lessThanMax = filters.population.maximum
      ? row.Population <= filters.population.maximum
      : true;

    return moreThanMin && lessThanMax;
  };

  const rowsFiltered = rowsSorted
    .filter(subregionFilter)
    .filter(areaFilter)
    .filter(populationFilter)
    .filter(nameFilter);

  return (
    <TableContainer
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
        marginTop: '1em',
      }}
    >
      <Table stickyHeader>
        <HeaderRow
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {rowsFiltered.map((country) => (
            <TableRow key={country.Country}>
              <TableCell>{country.Country}</TableCell>
              <TableCell>{country.Region}</TableCell>
              <TableCell>{country.Subregion}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }} align="right">
                {country.Area.toLocaleString()} km²
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {prefixNumber(country.Population, 0)}
              </TableCell>
              <TableCell>{country.Neighbours}</TableCell>
              <TableCell>{country.Languages}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface HeaderRowProps {
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: SortableColumn
  ) => void;
}

const HeaderRow = ({ order, orderBy, onRequestSort }: HeaderRowProps) => {
  const headers = [
    'Country',
    'Region',
    'Subregion',
    'Area',
    'Population',
    'Neighbours',
    'Languages',
  ];

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => {
          return (
            <HeaderCell
              key={header}
              name={header}
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
            />
          );
        })}
      </TableRow>
    </TableHead>
  );
};

interface HeaderCellProps {
  name: string;
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: SortableColumn
  ) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 'large',
  fontWeight: 'bold',
  background: theme.palette.primary.contrastText,
}));

const HeaderCell = ({
  name,
  order,
  orderBy,
  onRequestSort,
}: HeaderCellProps) => {
  const createSortHandler =
    (property: SortableColumn) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const sortable = isSortable(name);

  const sortByThisColumn = orderBy === name;

  return (
    <StyledTableCell sortDirection={sortByThisColumn ? order : false}>
      {sortable ? (
        <TableSortLabel
          active={sortByThisColumn}
          direction={sortByThisColumn ? order : 'asc'}
          onClick={createSortHandler(name)}
        >
          {name}
          {sortByThisColumn ? (
            <Box component="span" sx={visuallyHidden}>
              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          ) : null}
        </TableSortLabel>
      ) : (
        <>{name}</>
      )}
    </StyledTableCell>
  );
};

export default CountryTable;
