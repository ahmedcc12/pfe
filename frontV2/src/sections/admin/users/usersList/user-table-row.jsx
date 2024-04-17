import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Swal from 'sweetalert2';
import { useModeContext } from 'src/context/ModeContext';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  userDeleted,
  user,
  handleClick,
  //avatarUrl,
}) {
  const [open, setOpen] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  const { themeMode } = useModeContext();

  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const deleteUser = async () => {
    const result = await Swal.fire({
      customClass: {
        container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
      },
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
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
          title: 'Deleting user...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.delete(`/users/${user._id}`);
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'User deleted!',
          icon: 'success',
        });
        userDeleted(user._id);
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
            {user?.avatarUrl ? (
              <Avatar alt={user.firstname} src={user?.avatarUrl.downloadURL} />
            ) : (
              <Iconify
                icon="carbon:user-avatar"
                width={40}
                height={40}
                //color="orange"
              />
            )}
            <Typography variant="subtitle2" noWrap>
              {user.matricule}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell> {user.firstname} </TableCell>
        <TableCell> {user.lastname} </TableCell>
        <TableCell> {user.role} </TableCell>
        <TableCell> {user.email} </TableCell>
        <TableCell> {user.department} </TableCell>
        <TableCell> {user.group.name} </TableCell>

        {/* <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>
            {status}
          </Label>
        </TableCell> */}

        {user._id === auth.user.userId || user.role !== 'admin' ? (
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell align="right" />
        )}
      </TableRow>

      {user._id === auth.user.userId || user.role !== 'admin' ? (
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
          <MenuItem onClick={() => navigate(`/admin/users/${user._id}`)}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          {user.role === 'user' && (
            <MenuItem onClick={deleteUser} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          )}
        </Popover>
      ) : null}
    </>
  );
}

UserTableRow.propTypes = {
  userDeleted: PropTypes.func,
  selected: PropTypes.bool,
  user: PropTypes.object,
  handleClick: PropTypes.func,
  //avatarUrl: PropTypes.string,
};
