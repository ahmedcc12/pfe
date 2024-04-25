import axios from 'src/api/axios';
import useAuth from 'src/hooks/useAuth';
import { useState, useEffect } from 'react';

import Swal from 'sweetalert2';

import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from 'src/components/hook-form';

import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import { bgGradient } from 'src/theme/css';

import { useModeContext } from 'src/context/ModeContext';
import Logo from 'src/components/logo';

export default function ResetPassword() {
  const theme = useTheme();
  const { token } = useParams();

  const { themeMode } = useModeContext();

  const [tokenValid, setTokenValid] = useState(false);

  const [err, setErr] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      await axios
        .get(`/auth/resetpassword/${token}`)
        .then((response) => {
          setTokenValid(true);
        })
        .catch((error) => {
          setTokenValid(false);
          //navigate('/404');
        });
    };

    verifyToken();
  }, [token]);

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Password is required')
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .max(30, 'Password is too long - should be 30 chars maximum.')
      .matches(/[a-z]/, 'Password must contain at least one lowercase char.')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase char.')
      .matches(/[0-9]/, 'Password must contain at least one number.')
      .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol.')
      .test(
        'password',
        'Password must meet at least 4 complexity requirements.',
        (value) => {
          let score = 0;
          if (/[a-z]/.test(value)) score++;
          if (/[A-Z]/.test(value)) score++;
          if (/[0-9]/.test(value)) score++;
          if (/[^a-zA-Z0-9]/.test(value)) score++;
          return score >= 4;
        },
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    setError,
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const newPasswordWatch = watch('newPassword');
  const confirmPasswordWatch = watch('confirmPassword');

  useEffect(() => {
    setErr('');
    return () => {
      Swal.close();
    };
  }, [newPasswordWatch, confirmPasswordWatch]);

  const onSubmit = async (data) => {
    try {
      Swal.fire({
        customClass: {
          container: `swal2-shown ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Updating password...',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      Swal.showLoading();

      const response = await axios.post('/auth/resetpassword', {
        ...data,
        token: token,
      });
      Swal.fire({
        customClass: {
          container: `swal2-shown ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: 'Success',
        text: 'Password updated',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/';
        }
      });
    } catch (err) {
      Swal.close();
      console.error('Error registering user', err);
      const errorMessage = err.response?.data?.message || 'An error occurred';
      const errField = err.response?.data?.field;
      if (!errField) return setErr(errorMessage);
      setError(errField, {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  const renderForm = (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          fullWidth
          name="newPassword"
          label="New Password"
          type="password"
          variant="outlined"
          required
        />
        <RHFTextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          variant="outlined"
          required
        />
      </Stack>
      <LoadingButton
        sx={{ mt: 3 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isSubmitting}
      >
        Reset Password
      </LoadingButton>
      {err && (
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          {err}
        </Typography>
      )}
    </FormProvider>
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
        {tokenValid ? (
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4">Reset Your Password</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enter your new password below.
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
        ) : (
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4">Invalid Token</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              The token is invalid or has expired.
            </Typography>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
