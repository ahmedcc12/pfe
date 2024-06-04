import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fData } from 'src/utils/format-number';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Container } from '@mui/material';

import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
  RHFSelect,
} from 'src/components/hook-form';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

import Swal from 'sweetalert2';

import { useModeContext } from 'src/context/ModeContext';

export default function CreateBot() {
  const { botId } = useParams();

  const navigate = useNavigate();

  const isEdit = Boolean(botId);

  const [currentBot, setCurrentBot] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!botId) return;

    const fetchBot = async () => {
      try {
        const { data } = await axiosPrivate.get(`/bots/${botId}`);
        setCurrentBot(data);
        let configTypeValue = '';
        switch (data.configType.MIMEType) {
          case 'application/json':
            configTypeValue = 'json';
            break;
          case 'application/pdf':
            configTypeValue = 'pdf';
            break;
          case 'text/csv':
            configTypeValue = 'csv';
            break;
          default:
            break;
        }
        setValue('configtype', configTypeValue);
      } catch (error) {
        console.error('Error fetching Bot', error);
        navigate('/missing');
      }
    };
    fetchBot();
  }, [botId]);

  const NewBotSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    guide: Yup.string().required('Guide is required'),
    file: Yup.mixed().test(
      'required',
      'Script is required',
      (value) => value !== '',
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentBot?.name || '',
      description: currentBot?.description || '',
      file: currentBot?.configuration.downloadURL || '',
      guide: currentBot?.guide || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBot],
  );

  const methods = useForm({
    resolver: yupResolver(NewBotSchema),
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

  const values = watch();

  const [nameWatch, descriptionWatch, fileWatch] = watch([
    'name',
    'description',
    'file',
  ]);

  useEffect(() => {
    setErrMsg('');
    return () => {
      Swal.close();
    };
  }, [nameWatch, descriptionWatch, fileWatch]);

  useEffect(() => {
    if (isEdit && currentBot) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBot]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Updating bot...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.put(`/bots/${botId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'bot updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/bots');
        });
      } else {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Adding bot...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.post('/bots', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire({
          title: 'Bot Added',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/bots');
        });
      }
    } catch (err) {
      Swal.close();
      console.error('Error adding bot', err);
      const errorMessage = err.response?.data?.message || 'An error occurred';
      const errField = err.response?.data?.field;
      if (errField === 'file' || !errField) return setErrMsg(errorMessage);
      setError(errField, {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

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

  return (
    <Container>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {isEdit ? 'Edit Bot' : 'Create a new bot'}
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="description" label="Description" />
                  <RHFSelect name="configtype" label="Config Type">
                    <option value="" hidden></option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                  </RHFSelect>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <RHFTextField multiline rows={4} name="guide" label="Guide" />
                </Box>
                <Card
                  sx={{
                    py: 5,
                    px: 3,
                    mt: 5,
                  }}
                  elevation={3}
                >
                  <Box>
                    <RHFUploadSingleFile
                      name="file"
                      acceptedFiles={{
                        'text/x-python': ['.py'],
                        'application/x-python-code': ['.pyc'],
                      }}
                      maxSize={3145728}
                      onDrop={handleDrop}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 2,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.secondary',
                          }}
                        >
                          <br />
                          Upload bot script
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  </Box>
                </Card>
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {!isEdit ? 'Create Bot' : 'Save Changes'}
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
