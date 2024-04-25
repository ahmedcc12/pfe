import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import useLogout from 'src/hooks/useLogout';

import ProfileModal from '../../profileModal';

import Iconify from 'src/components/iconify';

import useRefreshToken from 'src/hooks/useRefreshToken';

import { io } from 'socket.io-client';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
];

// ----------------------------------------------------------------------

export default function userPopover() {
  const [open, setOpen] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth.user;
  const refresh = useRefreshToken();

  const ENDPOINT = 'http://localhost:9000';

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on('UserUpdated', ({ userId }) => {
      if (userId === user.userId) refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [refresh]);

  const logout = useLogout();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const hanedeLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const handleOpenProfileModal = () => {
    setOpenProfileModal(true);
    handleClose();
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        {user?.downloadURL ? (
          <Avatar
            src={user?.downloadURL}
            alt={user.firstname}
            sx={{
              width: 36,
              height: 36,
              border: (theme) =>
                `solid 2px ${theme.palette.background.default}`,
            }}
          >
            {user.firstname + ' ' + user.lastname}
          </Avatar>
        ) : (
          <Iconify icon="teenyicons:user-outline" width={40} height={40} />
        )}
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user.firstname + ' ' + user.lastname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={
              option.label === 'Profile' ? handleOpenProfileModal : handleClose
            }
          >
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={hanedeLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>

      {openProfileModal && (
        <ProfileModal
          open={openProfileModal}
          onClose={handleCloseProfileModal}
          user={user}
        />
      )}
    </>
  );
}
