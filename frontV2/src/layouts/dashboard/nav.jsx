import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import useAuth from 'src/hooks/useAuth';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import adminNavConfig from './admin-config-navigation';
import userNavConfig from './user-config-navigation';

import Iconify from 'src/components/iconify';

import useRefreshToken from 'src/hooks/useRefreshToken';

import { io } from 'socket.io-client';

import Swal from 'sweetalert2';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { useModeContext } from 'src/context/ModeContext';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav, section }) {
  const userNav = userNavConfig();

  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const account = auth.user;

  const refresh = useRefreshToken();

  const { themeMode } = useModeContext();

  const [errMsg, setErrMsg] = useState('');

  const [subject, setSubject] = useState('');

  const [message, setMessage] = useState('');

  const [open, setOpen] = useState(false);

  const ENDPOINT = 'http://localhost:9000';

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on('UserUpdated', ({ userId }) => {
      if (userId === account.userId) refresh();
    });

    return () => {
      socket.disconnect();
      Swal.close();
    };
  }, [refresh]);

  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    Swal.fire({
      customClass: {
        container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
      },
      title: 'Sending message...',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    Swal.showLoading();
    axiosPrivate
      .post('/adminmessage', {
        sender: account.userId,
        subject,
        message,
      })
      .then(() => {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Message sent',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          setOpen(false);
        });
      })
      .catch((error) => {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Error',
          text: error.response.data.error,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      });
  };

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      {account?.downloadURL ? (
        <Avatar src={account.downloadURL} alt="photoURL" />
      ) : (
        <Iconify icon="carbon:user-avatar" width={40} height={40} />
      )}

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">
          {account.firstname + ' ' + account.lastname}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {(section === 'admin' ? adminNavConfig : userNav).map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
      {auth.user.role !== 'admin' && (
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ mx: 2.5, mb: 3, borderColor: 'red', color: 'red' }}
        >
          Contact Admin
        </Button>
      )}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contact Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To contact the admin, please enter your message here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="subject"
            label="Subject"
            type="text"
            fullWidth
            required
            variant="standard"
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            id="message"
            label="Message"
            type="text"
            required
            fullWidth
            variant="standard"
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
  section: PropTypes.string,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active =
    item.path === pathname ||
    item.children?.some((child) => child.path === pathname);

  return (
    <>
      <ListItemButton
        component={RouterLink}
        href={item.path}
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(active && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>

        <Box component="span">{item.title} </Box>
      </ListItemButton>
      {item.children && (
        <Stack spacing={0.5} sx={{ pl: 3 }}>
          {item.children.map((subItem) => (
            <NavItem key={subItem.title} item={subItem} />
          ))}
        </Stack>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
