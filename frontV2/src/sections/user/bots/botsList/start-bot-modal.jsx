import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useAuth from 'src/hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputLabel from '@mui/material/InputLabel';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Modal,
  Container,
  TextField,
  Button,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { FormProvider, RHFUploadSingleFile } from 'src/components/hook-form';
import Swal from 'sweetalert2';
import { useModeContext } from 'src/context/ModeContext';

export default function StartBotModal({ open, onClose, bot, botStatus }) {
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const [errorMessage, setErrorMessage] = useState(null);

  const startBotSchema = Yup.object().shape({
    file: Yup.mixed().test(
      'required',
      'Config is required',
      (value) => value !== '',
    ),
  });
  const methods = useForm({
    resolver: yupResolver(startBotSchema),
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

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const watchFile = watch('file');

  const watchSelectedDate = watch('selectedDate');

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'file',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
      }
    },
    [setValue],
  );

  useEffect(() => {
    if (!watchSelectedDate) {
      setError(null);
    }
    if (
      watchSelectedDate &&
      watchSelectedDate.isBefore(dayjs().add(0, 'minute'))
    ) {
      setError('file', {
        type: 'manual',
        message: 'Time must be at least 5 minutes from now',
      });
    } else {
      setError(null);
    }
  }, [watchSelectedDate]);

  const onSubmit = async (data) => {
    const title = data.selectedDate ? 'Scheduling bot...' : 'Starting bot...';

    if (data.file) {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('bot', bot._id);
      formData.append('user', auth.user.userId);
      if (data.selectedDate) {
        formData.append('scheduled', data.selectedDate);
      }

      Swal.fire({
        customClass: {
          container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
        },
        title: title,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      Swal.showLoading();
      try {
        if (data.selectedDate) {
          const response = await axiosPrivate.post(
            `/botinstances/scheduled`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          if (response.status === 200) {
            Swal.fire({
              customClass: {
                container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
              },
              title: 'Bot scheduled',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
          }
        } else {
          const response = await axiosPrivate.post(`/botinstances`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          botStatus(bot._id, 'active');

          if (response.status === 200) {
            Swal.fire({
              customClass: {
                container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
              },
              title: 'Bot started',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
          }
        }
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
      } finally {
        setValue('file', null);
        onClose();
      }
    } else {
      setError('file', {
        type: 'manual',
        message: 'Config is required',
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <Box sx={{ p: 5 }}>
            <Typography variant="h5" paragraph>
              Start Bot {bot.name}
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel>Config</InputLabel>
                  <RHFUploadSingleFile
                    /* acceptedFiles={{
                      'application/json': ['.json'],
                    }} */
                    acceptedFiles={{
                      [bot.configType.MIMEType]: bot.configType.extensions,
                    }}
                    name="file"
                    control={control}
                    onDrop={handleDrop}
                  />
                </Grid>
                {watchFile && (
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="selectedDate"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <DateTimePicker
                            value={value}
                            onChange={onChange}
                            TextField={(props) => <TextField {...props} />}
                            minDateTime={dayjs().add(0, 'day').add(0, 'minute')}
                            maxDateTime={dayjs().add(2, 'month')}
                            /* slotProps={{
                              textField: {
                                helperText: errorMessage,
                              },
                              field: { clearable: true },
                            }} */
                            label="Schedule date and time"
                            disablePast
                            className="w-full"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                )}
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {watchSelectedDate ? 'Schedule' : 'Start'}
                </LoadingButton>
                <Button variant="contained" onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </FormProvider>
          </Box>
        </Card>
      </Container>
    </Modal>
  );
}

StartBotModal.propTypes = {
  botStatus: PropTypes.func,
  bot: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
