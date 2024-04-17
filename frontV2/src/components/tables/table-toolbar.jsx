import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Iconify from 'src/components/iconify';

import { useEffect, useCallback, useState } from 'react';

import debounce from 'lodash.debounce';

// ----------------------------------------------------------------------

export default function TableToolbar({
  numSelected,
  handleFilterByName,
  SEARCH_OPTIONS,
  setSearchOption,
  searchOption,
}) {
  const [search, setSearch] = useState('');

  const [option, setOption] = useState(searchOption || 'all');

  const debouncedHandleFilterByName = useCallback(
    debounce(handleFilterByName, 500),
    [handleFilterByName],
  );

  const onChangeSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedHandleFilterByName(value);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    setSearchOption(option);
    setOpen(false);
  };

  const handleRest = () => {
    setSearchOption('all');
    setOption('all');
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box>
          <OutlinedInput
            value={search}
            inputProps={{ maxLength: 50 }}
            onChange={onChangeSearch}
            placeholder="Search ..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
          <FormControl variant="outlined" sx={{ ml: 1, minWidth: 120 }}>
            {!SEARCH_OPTIONS ? null : (
              <>
                <InputLabel variant="outlined" onClick={handleClickOpen}>
                  Search By
                </InputLabel>
                <Select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  label="Search By"
                  startAdornment={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 1,
                      }}
                    >
                      <Iconify
                        icon="ic:round-filter-list"
                        sx={{ color: 'text.disabled', width: 20, height: 20 }}
                      />
                    </Box>
                  }
                >
                  {SEARCH_OPTIONS?.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
        </Box>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  handleFilterByName: PropTypes.func,
  SEARCH_OPTIONS: PropTypes.array,
  setSearchOption: PropTypes.func,
  searchOption: PropTypes.string,
};
