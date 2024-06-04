import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------
RHFTextField.propTypes = {
  name: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
};

export default function RHFTextField({
  name,
  multiline = false,
  rows,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          multiline={multiline}
          rows={rows}
          {...other}
        />
      )}
    />
  );
}
