import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

import { useModeContext } from 'src/context/ModeContext';

import Swal from 'sweetalert2';

import { io } from 'socket.io-client';
import { useEffect } from 'react';

import useRefreshToken from 'src/hooks/useRefreshToken';

export default function ProfileModal({ open, onClose }) {
  const { auth } = useAuth();
  const user = auth.user;
  const email = user.email;
  const axiosPrivate = useAxiosPrivate();
  const { themeMode } = useModeContext();
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

  const handleClose = () => {
    onClose();
  };

  const handleResetPassword = async () => {
    try {
      Swal.fire({
        customClass: {
          container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Sending email...',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      Swal.showLoading();

      await axiosPrivate.post('/auth/forgotpassword', { email });
      Swal.fire({
        customClass: {
          container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Email sent',
        text: 'Please check your email to reset your password',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } catch (err) {
      console.error('error ', err);
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
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: 500,
          padding: 2,
          borderRadius: 2,
        },
        '& .MuiDivider-root': {
          marginBottom: 1.5,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Profile
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Matricule:
            </Typography>
            <Typography variant="body1">{user.matricule}</Typography>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              First Name:
            </Typography>
            <Typography variant="body1">{user.firstname}</Typography>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Last Name:
            </Typography>
            <Typography variant="body1">{user.lastname}</Typography>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Email:
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Group:
            </Typography>
            <Typography variant="body1">{user.groupname}</Typography>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Department:
            </Typography>
            <Typography variant="body1">{user.department}</Typography>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Role:
            </Typography>
            <Typography variant="body1">{user.role}</Typography>
          </Box>
          <Divider />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetPassword} color="primary">
          Reset Password
        </Button>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
