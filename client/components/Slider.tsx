import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 0,
    label: 'Very easy',
  },
  {
    value: 20,
    label: 'Easy'
  },
  {
    value: 50,
    label: 'Medium',
  },
  {
    value: 80,
    label: 'Hard',
  },
  {
    value: 100,
    label: 'Extremely hard',
  },
];

function valuetext(value: number) {
  return `${value}`;
}

interface DiscreteSliderLabelProps {
  onChange: (value: number) => void;
}

export default function DiscreteSliderLabel({ onChange }: DiscreteSliderLabelProps) {
  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '50px',
        fontSize: '16px', // Default font size
        '@media (max-width: 600px)': {
          fontSize: '14px', // Adjust font size for smaller screens
        },
      }}
    >
      <Slider
        aria-label="Always visible"
        defaultValue={80}
        getAriaValueText={valuetext}
        step={10}
        marks={marks}
        valueLabelDisplay="on"
        color="secondary"
        onChange={(event, value) => onChange(value as number)}
      />
    </Box>
  );
}
