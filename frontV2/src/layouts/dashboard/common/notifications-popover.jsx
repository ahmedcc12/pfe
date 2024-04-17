import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useAuth from 'src/hooks/useAuth';
import { io } from 'socket.io-client';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationClicked, setPaginationClicked] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();
  const abortController = new AbortController();
  const ENDPOINT = 'http://localhost:9000';

  useEffect(() => {
    const unreadNotifications = async () => {
      try {
        const response = await axiosPrivate.get(
          `/notifications/unread/${auth.user.userId}`,
        );
        console.log('Unread notifications:', response.data.unread);
        setUnreadNotifications(response.data.unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    unreadNotifications();

    const socket = io(ENDPOINT);

    socket.on('newNotification', ({ userId }) => {
      if (userId === auth.user.userId) {
        setUnreadNotifications((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosPrivate.get(
        `/notifications/${auth.user.userId}/?page=${currentPage}&limit=4`,
        { signal: abortController.signal },
      );
      if (!response.data.notifications) return;
      const unread = response.data.notifications.filter(
        (notification) => !notification.read,
      ).length;
      if (unread > 0) setUnreadNotifications(unreadNotifications - unread);
      setNotifications(
        response.data.notifications.filter((notification) => notification.read),
      );
      setNewNotifications(
        response.data.notifications.filter(
          (notification) => !notification.read,
        ),
      );
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (paginationClicked) fetchNotifications();
  }, [currentPage]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setOpen(null);
    setPaginationClicked(false);
    setCurrentPage(1);
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClear = async () => {
    try {
      await axiosPrivate.delete(`/notifications/clear/${auth.user.userId}`);
      setNotifications([]);
      setUnreadNotifications(0);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  NotificationItem.propTypes = {
    notification: PropTypes.shape({
      createdAt: PropTypes.instanceOf(Date),
      _id: PropTypes.string,
      read: PropTypes.bool,
      message: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
    }),
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axiosPrivate.delete(`/notifications/${notificationId}`);
      const newNotifications = notifications?.filter(
        (notification) => notification._id !== notificationId,
      );
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  function NotificationItem({ notification }) {
    const { title } = renderContent(notification);

    return (
      <ListItemButton
        sx={{
          py: 1.5,
          px: 2.5,
          mt: '1px',
          ...(!notification.read && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'background.neutral' }}>
            <Iconify
              icon="ion:notifications-outline"
              width={24}
              height={24}
              color="black"
            />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify
                icon="eva:clock-outline"
                sx={{ mr: 0.5, width: 16, height: 16 }}
              />
              {fToNow(notification.createdAt)}
              <IconButton
                sx={{ ml: 1 }}
                edge="end"
                size="small"
                onClick={() => handleDeleteNotification(notification._id)}
              >
                <Iconify icon="ph:trash" width={20} height={20} />
              </IconButton>
            </Typography>
          }
        />
      </ListItemButton>
    );
  }

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={unreadNotifications} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              ml: 0.75,
              width: 360,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {unreadNotifications} unread messages
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {!notifications?.length && !newNotifications?.length ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              No notifications
            </Typography>
          </Box>
        ) : (
          <>
            <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
              {newNotifications.length > 0 && (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader
                      disableSticky
                      sx={{ py: 1, px: 2.5, typography: 'overline' }}
                    >
                      New
                    </ListSubheader>
                  }
                >
                  {newNotifications?.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                </List>
              )}
              <List
                disablePadding
                subheader={
                  <ListSubheader
                    disableSticky
                    sx={{ py: 1, px: 2.5, typography: 'overline' }}
                  >
                    Read
                  </ListSubheader>
                }
              >
                {notifications?.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </List>
            </Scrollbar>

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => handlePagination(page)}
                color="primary"
                onClick={() => setPaginationClicked(true)}
              />
            )}

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleClear}
              >
                Clear all
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography
      variant="subtitle2"
      style={{
        overflowWrap: 'break-word',
        textOverflow: 'ellipsis',
        overflow: 'auto',
      }}
    >
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{
          color: 'text.secondary',
          overflowWrap: 'break-word',
          textOverflow: 'ellipsis',
          overflow: 'auto',
        }}
      >
        <br /> {notification.message}
      </Typography>
    </Typography>
  );

  if (notification.type === 'Alert') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_alert.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: notification.avatar ? (
      <img alt={notification.title} src={notification.avatar} />
    ) : null,
    title,
  };
}
