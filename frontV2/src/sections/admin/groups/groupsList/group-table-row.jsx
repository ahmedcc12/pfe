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
import Box from '@mui/material/Box';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Swal from 'sweetalert2';
import { useModeContext } from 'src/context/ModeContext';

// ----------------------------------------------------------------------

export default function GroupTableRow({
  selected,
  groupDeleted,
  group,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [botNames, setBotNames] = useState([]);

  const [modalIsLoading, setModalIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const deleteGroup = async () => {
    const result = await Swal.fire({
      customClass: {
        container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
      },
      title: 'Are you sure?',
      text: 'You will not be able to recover this group!',
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
          title: 'Deleting group...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.delete(`/groups/${group._id}`);
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'group deleted!',
          icon: 'success',
        });
        groupDeleted(group._id);
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

  const viewBots = async (_id, name) => {
    try {
      setModalIsLoading(true);
      const response = await axiosPrivate.get(`/groups/${_id}/bots`);
      setModalIsLoading(false);
      openModal(response?.data?.bots?.map((bot) => bot?.name));
    } catch (error) {
      console.error(error);
      setModalIsLoading(false);
      Swal.fire('Error!', 'Failed to get bots', 'error');
    }
  };

  const openModal = (names) => {
    setBotNames(names);
    setModalOpen(true);
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
              icon="material-symbols:group"
              width={40}
              height={40}
              //color="orange"
            />

            <Typography variant="subtitle2" noWrap>
              {group.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Button variant="contained" onClick={() => viewBots(group._id)}>
              <Iconify icon="mdi:eye-outline" sx={{ mr: 1 }} />
              <Box sx={{ mr: 1 }}>{group.bots.length} Bots</Box>
            </Button>
          </Box>
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
        <MenuItem onClick={() => navigate(`/admin/groups/${group._id}`)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={deleteGroup} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: 400,
            maxHeight: 500,
          },
        }}
      >
        <DialogTitle>{group.name} Bots</DialogTitle>

        <Table>
          <TableBody>
            {botNames.slice(page * 5, page * 5 + 5).map((bot, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Iconify icon="mdi:robot" />
                    <Typography variant="body2">{bot}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={group.bots.length}
          rowsPerPage={5}
          rowsPerPageOptions={[]}
          page={page}
          onPageChange={handleChangePage}
        />
      </Dialog>
    </>
  );
}

GroupTableRow.propTypes = {
  groupDeleted: PropTypes.func,
  selected: PropTypes.bool,
  group: PropTypes.object,
  handleClick: PropTypes.func,
};
