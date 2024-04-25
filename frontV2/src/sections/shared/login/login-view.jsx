import { useState, useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import axios from 'src/api/axios';
import ReCAPATCHA from 'react-google-recaptcha';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pwd, setpwd] = useState('');
  const { auth, setAuth, persist, setPersist } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(null);

  useEffect(() => {
    setError('');
  }, [email, pwd]);

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        '/auth',
        JSON.stringify({ email, pwd, recaptchaToken: captcha }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        const accessToken = response?.data?.accessToken;
        const user = response?.data?.user;

        setAuth({ accessToken, user });
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'An error occurred');
    }
    setLoading(false);
  }

  const togglePersist = () => {
    setPersist((prev) => !prev);
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

        <TextField
          name="password"
          label="Password"
          value={pwd}
          onChange={(ev) => setpwd(ev.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <ReCAPATCHA
          sitekey="6LfJJpgpAAAAAJdpjY7H-y2y1wakE7-XMAK2D6hk"
          onChange={(value) => setCaptcha(value)}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 3 }}
      >
        <Typography variant="body2">
          <Checkbox
            variant="body2"
            checked={persist}
            onChange={togglePersist}
            color="primary"
          />
          Remember me
        </Typography>

        <Button
          variant="subtitle2"
          underline="hover"
          onClick={() => router.push('/forgot-password')}
        >
          Forgot password?
        </Button>
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleLoginSubmit}
        loading={loading}
      >
        Login
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

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
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
