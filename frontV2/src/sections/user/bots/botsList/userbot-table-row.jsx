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
import Label from 'src/components/label';

import Iconify from 'src/components/iconify';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useAuth from 'src/hooks/useAuth';

import Swal from 'sweetalert2';
import { useModeContext } from 'src/context/ModeContext';

import StartBotModal from './start-bot-modal';

// ----------------------------------------------------------------------

export default function UserBotTableRow({
  selected,
  botStatus,
  bot,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const { auth } = useAuth();

  const [startModalOpen, setStartModalOpen] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenStartModal = () => {
    setStartModalOpen(true);
  };

  const handleCloseStartModal = () => {
    setStartModalOpen(false);
  };

  const handleStop = async () => {
    try {
      Swal.fire({
        customClass: {
          container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Warning',
        text: 'Are you sure you want to stop this bot?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            customClass: {
              container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
            },
            title: 'Stopping bot...',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          Swal.showLoading();
          const respone = await axiosPrivate.delete(
            `/botinstances/status/${auth.user.userId}/${bot._id}`,
          );

          botStatus(bot._id, 'inactive');

          if (respone.status === 200) {
            Swal.fire({
              customClass: {
                container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
              },
              title: 'Bot stopped',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        customClass: {
          container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Error',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
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
          <Label color={(bot.status === 'inactive' && 'error') || 'success'}>
            {bot.status}
          </Label>
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
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            if (bot.status === 'inactive') {
              handleOpenStartModal();
            } else if (bot.status === 'active') handleStop();
          }}
          sx={{
            color: bot.status === 'inactive' ? 'success.main' : 'error.main',
          }}
        >
          {bot.status === 'active' && (
            <Iconify icon="eva:pause-circle-outline" sx={{ mr: 1 }} />
          )}
          {bot.status === 'inactive' && (
            <Iconify icon="eva:play-circle-outline" sx={{ mr: 1 }} />
          )}
          {bot.status === 'active' ? 'Pause' : 'Start'}
        </MenuItem>
      </Popover>
      <StartBotModal
        open={startModalOpen}
        onClose={handleCloseStartModal}
        bot={bot}
        botStatus={botStatus}
      />
    </>
  );
}

UserBotTableRow.propTypes = {
  botStatus: PropTypes.func,
  selected: PropTypes.bool,
  bot: PropTypes.object,
  handleClick: PropTypes.func,
};
