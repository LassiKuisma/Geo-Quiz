import { Box, Slider } from '@mui/material';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { FilterOptions } from '../../../types/filter';

const marks = [0, 500, 1_000, 50_000, 100_000, 500_000, 1_000_000, 'All'].map(
  (label, index) => {
    const isNumber = typeof label === 'number';
    const areaValue = isNumber ? label : undefined;

    return {
      value: index,
      label: isNumber ? `${label.toLocaleString()} km²` : label,
      areaValue,
    };
  }
);

interface Props {
  filterOptions: FilterOptions;
  setFilterOptions: (_: FilterOptions) => void;
  hasSmallDevice: boolean;
}

const FilterByArea = ({
  filterOptions,
  setFilterOptions,
  hasSmallDevice,
}: Props) => {
  const minValue = marks.reduce((p, { value }) => Math.min(p, value), 0);
  const maxValue = marks.reduce((p, { value }) => Math.max(p, value), 0);

  const [value, setValue] = useState([minValue, maxValue]);
  const debounced = useDebouncedCallback((value: number[]) => {
    const min = Math.min(value[0], value[1]);
    const minimum = marks[min].areaValue;

    const max = Math.max(value[0], value[1]);
    const maximum = marks[max].areaValue;

    setFilterOptions({
      ...filterOptions,
      area: { minimum, maximum },
    });
  }, 500);

  const handleValueChange = (event: Event, value: number | number[]) => {
    setValue(value as number[]);
    debounced(value as number[]);
  };

  const marksToShow = marks.map((mark, index) => {
    if (!hasSmallDevice) {
      return mark;
    }

    const isFirst = index === 0;
    const isLast = index === marks.length - 1;
    const showLabel = isFirst || isLast;

    return {
      value: mark.value,
      label: showLabel ? mark.label : '',
    };
  });

  return (
    <Box marginX="1em">
      <Slider
        value={value}
        onChange={handleValueChange}
        defaultValue={0}
        valueLabelFormat={(value) => {
          // value = index (see mapping of labels to marks)
          return marks[value]?.label;
        }}
        min={minValue}
        max={maxValue}
        step={null}
        valueLabelDisplay={hasSmallDevice ? 'on' : 'auto'}
        marks={marksToShow}
      />
    </Box>
  );
};

export default FilterByArea;
