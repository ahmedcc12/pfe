import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fData } from 'src/utils/format-number';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Container, Typography } from '@mui/material';

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

import Swal from 'sweetalert2';

import useAuth from 'src/hooks/useAuth';

import { useModeContext } from 'src/context/ModeContext';

export default function HomePage() {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const [errMsg, setErrMsg] = useState('');

  const NewUserSchema = Yup.object().shape({
    subject: Yup.string()
      .required('Subject is required')
      .min(3, 'Subject is too short')
      .max(50, 'Subject is too long'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message is too short')
      .max(200, 'Message is too long'),
    type: Yup.string()
      .required('Message type is required')
      .oneOf(['demande', 'reclamation', 'feedback'], 'Invalid message type'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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

  const [subjectWatch, messageWatch, messageTypeWatch] = watch([
    'subject',
    'message',
    'messageType',
  ]);

  useEffect(() => {
    setErrMsg('');
    return () => {
      Swal.close();
    };
  }, [subjectWatch, messageWatch, messageTypeWatch]);

  const onSubmit = async (data) => {
    try {
      const newData = { ...data, sender: auth.user.userId };
      const response = await axiosPrivate.post('/tickets', newData);

      if (response.status === 201) {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          icon: 'success',
          title: 'Ticket sent successfully',
          confirmButtonText: 'Ok',
        });
      }
    } catch (error) {
      if (error.response) {
        setErrMsg(error.response.data.message);
      } else {
        setErrMsg('An error occurred');
      }
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Contact RH
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFSelect name="type" label="Type">
                    <option value="" hidden>
                      Select type
                    </option>
                    <option value="demande">Demande</option>
                    <option value="reclamation">Reclamation</option>
                    <option value="feedback">Feedback</option>
                  </RHFSelect>
                  <RHFTextField name="subject" label="Subject" />

                  <RHFTextField
                    name="message"
                    label="Message"
                    multiline={true}
                    rows={4}
                  />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Send
                  </LoadingButton>
                  {errMsg && (
                    <Box sx={{ mt: 3 }}>
                      <Typography color="error">{errMsg}</Typography>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Container>
  );
}
