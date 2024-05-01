import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Label from 'src/components/label';
import IconButton from '@mui/material/IconButton';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';

import Iconify from 'src/components/iconify';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export default function AdminMessagesTableRow({
  selected,
  handleClick,
  markSolved,
  message,
}) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSolve = async () => {
    try {
      setLoading(true);
      await axiosPrivate.put(`/adminmessage/${message._id}`);
      markSolved(message._id);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify icon="tabler:message" width={40} height={40} />

            <Typography variant="subtitle2" noWrap>
              {message?.sender.firstname + ' ' + message?.sender.lastname}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {message?.subject}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {message?.message}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {dayjs(message?.sentAt).format('DD/MM/YYYY' + ' ' + 'HH:mm')}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Label variant="filled" color={message?.solved ? 'success' : 'error'}>
            {message?.solved ? 'Solved' : 'Unsolved'}
          </Label>
        </TableCell>

        <TableCell>
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:expand-outline" width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            padding: 2.5,
            position: 'relative',
            p: 3,
          },
        }}
      >
        <DialogTitle sx={{ mb: 2 }}>Message</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" noWrap sx={{ mb: 1 }}>
            <strong>From: </strong>
            {message?.sender.firstname + ' ' + message?.sender.lastname}
          </Typography>
          <Typography variant="subtitle2" noWrap sx={{ mb: 1 }}>
            <strong>Subject: </strong>
            {message?.subject}
          </Typography>
          <Typography variant="subtitle2" noWrap sx={{ mb: 2 }}>
            <strong>Message: </strong>
            {message?.message}
          </Typography>
          <LoadingButton onClick={handleSolve} sx={{ mt: 2 }} loading={loading}>
            Mark Solved
          </LoadingButton>
        </DialogContent>
      </Dialog>
    </>
  );
}

AdminMessagesTableRow.propTypes = {
  message: PropTypes.object,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  markSolved: PropTypes.func,
};
