import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, Button, Typography } from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { TailSpin } from 'react-loader-spinner';
import { io } from 'socket.io-client';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const abortController = new AbortController();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const ENDPOINT = 'http://localhost:9000';
  const [paginationClicked, setPaginationClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unreadNotifications = async () => {
      try {
        const response = await axiosPrivate.get(`/notifications/unread/${auth.user.userId}`, {
          signal: abortController.signal,
        });
        setUnreadNotifications(response.data.unread);
        setLoading(false);
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
      abortController.abort();
      socket.off();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosPrivate.get(
        `/notifications/${auth.user.userId}/?page=${currentPage}&limit=4`,
        { signal: abortController.signal }
      );
      const unread = response.data.notifications.filter(
        (notification) => !notification.read
      ).length;
      if (unread > 0) setUnreadNotifications(unreadNotifications - unread);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (paginationClicked) fetchNotifications();
  }, [currentPage]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleCloseMenu = () => {
    console.log('close');
    setAnchorEl(null);
    setPaginationClicked(false);
    setCurrentPage(1);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axiosPrivate.delete(`/notifications/${notificationId}`);
      const newNotifications = notifications.filter(
        (notification) => notification._id !== notificationId
      );
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
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

  const timeDifference = (date) => {
    const now = dayjs();
    const notificationDate = dayjs(date);
    const diff = now.diff(notificationDate, 'minute');
    if (diff < 60) {
      return diff === 1 ? `${diff} minute ago` : `${diff} minutes ago`;
    } else if (diff < 1440) {
      const hours = Math.floor(diff / 60);
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else {
      const days = Math.floor(diff / 1440);
      return days === 1 ? `${days} day ago` : `${days} days ago`;
    }
  };

  const handleNotificationClick = (notification) => {
    //useNavigate(`/userActivity/${notification.user}`);
    localStorage.setItem('userActiveComponent', 'userActivity');
    navigate(`/`);
  };

  return (
    <div>
      <IconButton color="black" onClick={handleOpenMenu}>
        <Badge badgeContent={unreadNotifications} max={99} color="primary">
          <FontAwesomeIcon icon={faBell} size="xs" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ marginTop: '40px' }}
      >
        <div className="mb-4">
          <Button
            onClick={handleCloseMenu}
            style={{ position: 'absolute', top: 0, right: 0 }}
            disableRipple
          >
            <FontAwesomeIcon icon={faTimes} size="sm" color="Black" />
          </Button>
        </div>

        {loading ? (
          <MenuItem>
            <TailSpin color="black" height={50} width={50} />
          </MenuItem>
        ) : notifications.length === 0 ? (
          <div>
            <hr className="my-2" />
            <MenuItem disabled>No notifications</MenuItem>
            <hr className="my-2" />
          </div>
        ) : (
          <div className="ltr">
            <Typography variant="h6" align="center" color="black">
              Notifications
            </Typography>

            <hr className="my-2" />
            {notifications.map((notification) => (
              <div key={notification._id}>
                <MenuItem onClick={() => handleNotificationClick(notification)}>
                  <div className="notification-content">
                    <div
                      className="notification-message"
                      style={{ color: notification.read ? 'grey' : 'Blue' }}
                    >
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {notification.message}
                      </div>
                      <small>{timeDifference(notification.createdAt)}</small>
                    </div>
                    <Button
                      onClick={() => handleDeleteNotification(notification._id)}
                      style={{ position: 'absolute', bottom: 0, right: 0 }}
                      disableRipple
                    >
                      <FontAwesomeIcon icon={faTrash} size="sm" color="Black" />
                    </Button>
                  </div>
                </MenuItem>

                <hr className="my-2" />
              </div>
            ))}

            {totalPages > 1 && (
              <div>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => handlePagination(page)}
                  color="primary"
                  onClick={() => setPaginationClicked(true)}
                />
                <hr className="my-2" />
              </div>
            )}
            <Button onClick={handleClear} disableRipple>
              Clear all
            </Button>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default NotificationBell;
