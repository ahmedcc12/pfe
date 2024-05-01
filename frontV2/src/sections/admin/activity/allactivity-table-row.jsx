import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Label from 'src/components/label';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Iconify from 'src/components/iconify';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export default function AllActivityTableRow({
  selected,
  handleClick,
  instance,
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            {instance.isScheduled ? (
              <Iconify
                icon="uil:clock"
                width={40}
                height={40}
                //color="orange"
              />
            ) : (
              <Iconify
                icon="uil:robot"
                width={40}
                height={40}
                //color="orange"
              />
            )}

            <Typography variant="subtitle2" noWrap>
              {instance.bot.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {instance.user.firstname + ' ' + instance.user.lastname}
          </Typography>
        </TableCell>

        <TableCell>
          {instance.status === 'active' ? (
            <Label color="success">Running</Label>
          ) : instance.status === 'inactive' && instance.isScheduled ? (
            <Label color="warning">
              {dayjs(instance.scheduledAt).format('D,MMMM, YYYY, h:mm:ss A')}
            </Label>
          ) : instance.status === 'inactive' ? (
            <Label color="error">Stopped</Label>
          ) : instance.status === 'success' ? (
            <Label color="success">Success</Label>
          ) : (
            <Label color="error">Error</Label>
          )}
        </TableCell>
        <TableCell>
          <Button
            href={instance.configuration.downloadURL}
            target="_blank"
            variant="contained"
          >
            <Iconify
              icon="material-symbols-light:download"
              width={20}
              height={20}
              sx={{ mr: 1 }}
            />
            <Typography variant="subtitle2" noWrap>
              Config
            </Typography>
          </Button>
        </TableCell>
        <TableCell>
          <Label color="info">
            {instance.isScheduled
              ? 'Scheduled'
              : `${dayjs(instance.StartedAt).format('D,MMMM, YYYY, h:mm:ss A')}`}
          </Label>
        </TableCell>

        <TableCell>
          <Label color="info">
            {instance.isScheduled
              ? 'Scheduled'
              : instance.status === 'active'
                ? 'Running'
                : `${dayjs(instance.StoppedAt).format('D,MMMM, YYYY, h:mm:ss A')}`}
          </Label>
        </TableCell>

        <TableCell>
          {instance.status === 'active' ? (
            <Typography
              variant="subtitle2"
              sx={{ color: 'error.main', cursor: 'pointer' }}
            >
              Bot is running
            </Typography>
          ) : (
            <IconButton onClick={handleOpen}>
              <Iconify icon="uil:file-alt" width={20} height={20} />
              <Typography variant="subtitle2" noWrap>
                View Logs
              </Typography>
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Logs</DialogTitle>
        <DialogContent>
          {instance.logs.map((log, index) => (
            <div key={index}>
              <Typography variant="subtitle1">
                Timestamp:
                <Label color="info">
                  {dayjs(log.timestamp).format('D,MMMM, YYYY, h:mm:ss A')}
                </Label>
              </Typography>
              <Typography variant="subtitle1">
                Status:{' '}
                {log.status === 'success' ? (
                  <Label color="success">Success</Label>
                ) : (
                  <Label color="error">Error</Label>
                )}
              </Typography>
              <Typography variant="subtitle1">
                <pre>{log.message}</pre>
              </Typography>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

AllActivityTableRow.propTypes = {
  instance: PropTypes.object,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};
