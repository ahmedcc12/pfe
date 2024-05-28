import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from 'src/components/chart';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export default function AppWebsiteVisits({
  title,
  subheader,
  chart,
  years,
  onYearChange,
  ...other
}) {
  const { labels, colors, series, options } = chart;

  const [selectedYear, setSelectedYear] = useState(years[0]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    onYearChange(year);
  };

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'category',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} runs`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{ mb: 3 }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>

        <Chart
          type="line" // or 'bar', 'area', etc.
          series={series}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string.isRequired,
  years: PropTypes.array.isRequired,
  onYearChange: PropTypes.func.isRequired,
};
