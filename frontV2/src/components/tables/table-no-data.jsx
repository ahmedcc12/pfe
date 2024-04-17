import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query, searchOption }) {
  return (
    <TableRow
      sx={{
        height: 360,
        '& > *': {
          borderBottom: 'unset',
        },
      }}
    >
      <TableCell
        colSpan={6}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            Not found
          </Typography>

          <Typography variant="body2">
            No results found for &nbsp;
            <strong>
              {searchOption === 'all' ? null : `"${searchOption}" :`}
              &quot;
              {query}
              &quot;
            </strong>
            .
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
