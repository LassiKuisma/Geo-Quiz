import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableSortLabel,
  Box,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Country } from '../../types';
import { useState } from 'react';

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

const getComparator = <Key extends keyof CountryRow>(
  order: Order,
  orderBy: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

interface CountryRow {
  Country: string;
  Region: string;
  Subregion: string;
  Area: number;
  Population: number;
  Neighbours: string;
  Languages: string;
}

interface Props {
  countries: Array<Country>;
}

const CountryTable = ({ countries }: Props) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CountryRow>('Country');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof CountryRow
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
    Neighbours: country.neighbours.join(', '),
    Languages: country.languages.join(', '),
  }));

  const rowsSorted = countriesAsRows.sort(getComparator(order, orderBy));

  return (
    <TableContainer sx={{ maxHeight: 800 }}>
      <Table stickyHeader>
        <HeaderRow
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {rowsSorted.map((country) => (
            <TableRow key={country.Country}>
              <TableCell>{country.Country}</TableCell>
              <TableCell>{country.Region}</TableCell>
              <TableCell>{country.Subregion}</TableCell>
              <TableCell>{country.Area}</TableCell>
              <TableCell>{country.Population}</TableCell>
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
    property: keyof CountryRow
  ) => void;
}

const HeaderRow = ({ order, orderBy, onRequestSort }: HeaderRowProps) => {
  const headers: {
    name: keyof CountryRow;
    sortable: boolean;
  }[] = [
    { name: 'Country', sortable: true },
    { name: 'Region', sortable: true },
    { name: 'Subregion', sortable: true },
    { name: 'Area', sortable: true },
    { name: 'Population', sortable: true },
    { name: 'Neighbours', sortable: false },
    { name: 'Languages', sortable: false },
  ];

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => {
          return (
            <HeaderCell
              key={header.name}
              name={header.name}
              sortable={header.sortable}
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
  name: keyof CountryRow;
  sortable: boolean;
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof CountryRow
  ) => void;
}

const HeaderCell = ({
  name,
  sortable,
  order,
  orderBy,
  onRequestSort,
}: HeaderCellProps) => {
  const createSortHandler =
    (property: keyof CountryRow) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const sortByThisColumn = orderBy === name;

  return (
    <TableCell
      sortDirection={sortByThisColumn ? order : false}
      sx={{ fontSize: 'large', fontWeight: 'bold', background: 'grey' }}
    >
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
    </TableCell>
  );
};

export default CountryTable;
