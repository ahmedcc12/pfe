import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Swal from 'sweetalert2';
import { useModeContext } from 'src/context/ModeContext';

// ----------------------------------------------------------------------

export default function BotTableRow({
  selected,
  botDeleted,
  bot,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const deleteBot = async () => {
    const result = await Swal.fire({
      customClass: {
        container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
      },
      title: 'Are you sure?',
      text: 'You will not be able to recover this bot!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Deleting bot...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.delete(`/bots/${bot._id}`);
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Bot deleted!',
          icon: 'success',
        });
        botDeleted(bot._id);
      } catch (error) {
        console.error('error ', error);
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Error',
          text: 'An error occurred',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    } else {
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify
              icon="uil:robot"
              width={40}
              height={40}
              //color="orange"
            />

            <Typography variant="subtitle2" noWrap>
              {bot.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell> {bot.description} </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="material-symbols-light:download" />}
            href={bot.configuration?.downloadURL}
            target="_blank"
          >
            Download
          </Button>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { sx: { width: 140 } },
        }}
      >
        <MenuItem onClick={() => navigate(`/admin/bots/${bot._id}`)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={deleteBot} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

BotTableRow.propTypes = {
  botDeleted: PropTypes.func,
  selected: PropTypes.bool,
  bot: PropTypes.object,
  handleClick: PropTypes.func,
};
