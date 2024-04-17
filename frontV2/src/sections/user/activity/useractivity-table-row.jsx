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

import Iconify from 'src/components/iconify';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export default function UserBotTableRow({ selected, handleClick, instance }) {
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
          {instance.status === 'active' ? (
            <Label color="success">Running</Label>
          ) : instance.status === 'inactive' && instance.isScheduled ? (
            <Label color="warning">
              {dayjs(instance.scheduledAt).format('D,MMMM, YYYY, h:mm:ss A')}
            </Label>
          ) : instance.status === 'inactive' ? (
            <Label color="error">Stopped</Label>
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
      </TableRow>
    </>
  );
}

UserBotTableRow.propTypes = {
  instance: PropTypes.object,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};
