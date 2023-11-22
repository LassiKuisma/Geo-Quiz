import { Slider } from '@mui/material';
import { useState } from 'react';

const marks = [
  '0',
  '500 km²',
  '1 000 km²',
  '50 000 km²',
  '100 000 km²',
  '500 000 km²',
  '1 000 000 km²',
  'All',
].map((label, index) => ({
  value: index,
  label,
}));

const FilterByArea = () => {
  const minValue = marks.reduce((p, { value }) => Math.min(p, value), 0);
  const maxValue = marks.reduce((p, { value }) => Math.max(p, value), 0);

  const [value, setValue] = useState([minValue, maxValue]);

  return (
    <Slider
      value={value}
      onChange={(_, value) => setValue(value as number[])}
      defaultValue={0}
      valueLabelFormat={(value) => {
        // value = index (see mapping of labels to marks)
        return marks[value]?.label;
      }}
      min={minValue}
      max={maxValue}
      step={null}
      valueLabelDisplay="auto"
      marks={marks}
    />
  );
};

export default FilterByArea;
