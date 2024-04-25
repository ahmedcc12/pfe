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

import { useModeContext } from 'src/context/ModeContext';

export default function CreateUser() {
  const { userId } = useParams();

  const navigate = useNavigate();

  const isEdit = Boolean(userId);

  const [currentUser, setCurrentUser] = useState(null);

  const [allGroups, setAllGroups] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  const { themeMode } = useModeContext();

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axiosPrivate.get('/groups');
        setAllGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups', error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const { data } = await axiosPrivate.get(`/users/${userId}`);
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching user', error);
        navigate('/missing');
      }
    };
    fetchUser();
  }, [userId]);

  const NewUserSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    matricule: Yup.string().required('Matricule is required'),
    department: Yup.string().required('Department is required'),
    group: Yup.string().required('Group is required'),
    email: Yup.string()
      .email('Email must be a valid email')
      .required('Email is required'),
    role: Yup.string().required('Role Number is required'),
    /* avatarUrl: Yup.mixed().test(
      'required',
      'Avatar is required',
      (value) => value !== '',
    ), */
  });

  const defaultValues = useMemo(
    () => ({
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      matricule: currentUser?.matricule || '',
      department: currentUser?.department || '',
      group: currentUser?.group?._id || '',
      email: currentUser?.email || '',
      avatarUrl: currentUser?.avatarUrl?.downloadURL || '',
      role: currentUser?.role || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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

  const [
    firstnameWatch,
    lastnameWatch,
    matriculeWatch,
    departmentWatch,
    groupWatch,
    emailWatch,
    roleWatch,
    avatarUrlWatch,
  ] = watch([
    'firstname',
    'lastname',
    'matricule',
    'department',
    'group',
    'email',
    'role',
    'avatarUrl',
  ]);

  useEffect(() => {
    setErrMsg('');
    return () => {
      Swal.close();
    };
  }, [
    firstnameWatch,
    lastnameWatch,
    matriculeWatch,
    departmentWatch,
    groupWatch,
    emailWatch,
    roleWatch,
    avatarUrlWatch,
  ]);

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Updating user...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.put(`/users/${userId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'User updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/users');
        });
      } else {
        Swal.fire({
          customClass: {
            container: `swal-z-index ${themeMode === 'dark' ? 'swal-dark-theme' : ''}`,
          },
          title: 'Registering user...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.post('/register', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire({
          title: 'User registered',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/users');
        });
      }
    } catch (err) {
      Swal.close();
      console.error('Error registering user', err);
      const errorMessage = err.response?.data?.message || 'An error occurred';
      const errField = err.response?.data?.field;
      if (errField === 'avatarUrl' || !errField) return setErrMsg(errorMessage);
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
          'avatarUrl',
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
          {isEdit ? 'Edit User' : 'Create a new user'}
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <RHFUploadAvatar
                    name="avatarUrl"
                    acceptedFiles={{
                      'image/jpeg': ['.jpeg'],
                      'image/jpg': ['.jpg'],
                      'image/png': ['.png'],
                      'image/gif': ['.gif'],
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
                        <span style={{ fontWeight: 'bold' }}>Not Required</span>
                        <br />
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>
              </Card>
            </Grid>

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
                  <RHFTextField name="firstname" label="First Name" />
                  <RHFTextField name="lastname" label="Last Name" />
                  <RHFTextField name="matricule" label="Matricule" />
                  <RHFTextField name="department" label="Department" />
                  <RHFSelect name="group" label="Group">
                    <option value="" />
                    {allGroups.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                  </RHFSelect>

                  <RHFTextField name="email" label="Email" />

                  <RHFSelect name="role" label="Role">
                    <option value="" />
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </RHFSelect>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {!isEdit ? 'Create User' : 'Save Changes'}
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
