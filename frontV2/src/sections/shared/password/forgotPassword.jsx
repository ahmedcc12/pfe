import { useState, useEffect } from 'react';
import axios from 'src/api/axios';
import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import { useModeContext } from 'src/context/ModeContext';
import Logo from 'src/components/logo';
import { set } from 'react-hook-form';

export default function ForgotPassword() {
  const theme = useTheme();
  const { themeMode } = useModeContext();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
    return () => {
      Swal.close();
    };
  }, [email]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    Swal.fire({
      customClass: {
        container: `swal2-shown ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
      },
      title: 'Sending email...',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    Swal.showLoading();
    try {
      setLoading(true);
      const response = await axios.post('/auth/forgotpassword', { email });
      Swal.fire({
        customClass: {
          container: `swal2-shown ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Email sent',
        text: 'Please check your email to reset your password',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Swal.close();
      setError(err.response?.data?.message);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </Stack>

      <LoadingButton
        sx={{ mt: 3 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleForgotPassword}
        loading={loading}
      >
        Send Email
      </LoadingButton>
      {error && (
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          {error}
        </Typography>
      )}
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '100vh' }}
      >
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Forgot Your Password?</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter your email address below and we'll send you a link to reset
            your password.
          </Typography>

          <Divider sx={{ my: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            ></Typography>
          </Divider>

          {renderForm}

          <Divider sx={{ my: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            ></Typography>
          </Divider>
        </Card>
      </Stack>
    </Box>
  );
}
