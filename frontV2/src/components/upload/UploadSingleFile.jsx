import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Typography, IconButton, Button } from '@mui/material';
import { Card, Grid, Stack } from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
//
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';

import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  ...other
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    ...other,
  });

  const { setValue } = useFormContext();

  const handleDelete = () => {
    // Reset the file value to null
    setValue('file', null);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(file && {
            padding: '8% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        <BlockContent />
      </DropZoneStyle>

      {file && (
        <Card
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.neutral',
            color: 'text.secondary',
            borderRadius: 1,
          }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={9}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {isString(file)
                  ? file.split('\\').pop().split('/').pop()
                  : file.name}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => {
                    window.open(URL.createObjectURL(file));
                  }}
                >
                  <RemoveRedEyeIcon />
                </IconButton>

                <IconButton size="small" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      )}

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {helperText && helperText}
    </Box>
  );
}
