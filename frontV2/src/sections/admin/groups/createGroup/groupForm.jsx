import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fData } from 'src/utils/format-number';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import Scrollbar from 'src/components/scrollbar';

import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from 'src/components/hook-form';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

import Swal from 'sweetalert2';

import { useModeContext } from 'src/context/ModeContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateGroup() {
  const { groupId } = useParams();

  const navigate = useNavigate();

  const isEdit = Boolean(groupId);

  const [currentGroup, setCurrentGroup] = useState(null);

  const [bots, setBots] = useState([]);

  const [errMsg, setErrMsg] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const NewGroupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    selectedBots: Yup.array().required('Select at least one bot'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentGroup?.name || '',
      selectedBots: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentGroup],
  );

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    setError,
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [nameWatch, selectedBotsWatch] = watch(['name', 'selectedBots']);

  useEffect(() => {
    setErrMsg('');
    return () => {
      Swal.close();
    };
  }, [nameWatch, selectedBotsWatch]);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroup = async () => {
      try {
        const { data } = await axiosPrivate.get(`/groups/${groupId}`);
        setCurrentGroup(data);
        const bots = await axiosPrivate.get(`/groups/${groupId}/bots`);
        const botsIds = bots.data.bots.map((bot) => bot._id);
        setValue('selectedBots', botsIds);
      } catch (error) {
        console.error('Error fetching Group', error);
        navigate('/missing');
      }
    };
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const { data } = await axiosPrivate.get('/bots');
        setBots(data.bots);
      } catch (error) {
        console.error('Error fetching bots', error);
      }
    };
    fetchBots();
  }, []);

  useEffect(() => {
    if (isEdit && currentGroup) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentGroup]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Updating group...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.put(`/groups/${groupId}`, {
          name: data.name,
          botIds: data.selectedBots,
        });

        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'group updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/groups');
        });
      } else {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Adding group...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.post('/groups', {
          name: data.name,
          botIds: data.selectedBots,
        });
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Group Added',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/groups');
        });
      }
    } catch (err) {
      Swal.close();
      console.error('Error adding group', err);
      const errorMessage = err.response?.data?.message || 'An error occurred';
      let errField = err.response?.data?.field;
      if (errField) {
        setError(errField, {
          type: 'manual',
          message: errorMessage,
        });
      } else {
        setErrMsg(errorMessage);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {isEdit ? 'Edit Group' : 'Create a new group'}
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

                  <Controller
                    name="selectedBots"
                    rules={{ required: 'Select at least one bot' }}
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.selectedBots)}>
                        <InputLabel
                          id="demo-multiple-checkbox-label"
                          htmlFor="demo-multiple-checkbox"
                        >
                          Bots
                        </InputLabel>
                        <Select
                          {...field}
                          label="Bots"
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={field.value || []}
                          onChange={(event) => {
                            field.onChange(
                              event.target.value.includes('all')
                                ? field.value.length === bots.length
                                  ? []
                                  : bots.map((bot) => bot._id)
                                : event.target.value,
                            );
                          }}
                          renderValue={(selected) =>
                            bots
                              .filter((bot) => selected.includes(bot._id))
                              .map((bot) => bot.name)
                              .join(', ')
                          }
                          MenuProps={MenuProps}
                          sx={{ width: '100%' }}
                        >
                          <MenuItem value="all">
                            <Checkbox
                              checked={field.value.length === bots.length}
                            />
                            <ListItemText primary="Select All" />
                          </MenuItem>
                          {bots.map((bot) => (
                            <MenuItem key={bot._id} value={bot._id}>
                              <Checkbox
                                checked={
                                  field.value
                                    ? field.value.includes(bot._id)
                                    : false
                                }
                              />
                              <ListItemText primary={bot.name} />
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.selectedBots && (
                          <Typography color="error">
                            {errors.selectedBots.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {!isEdit ? 'Create Group' : 'Save Changes'}
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
