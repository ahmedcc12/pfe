import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/components/tables/table-no-data';
import CustomTableHead from 'src/components/tables/table-head';
import TableEmptyRows from 'src/components/tables/table-empty-rows';
import TableToolBar from 'src/components/tables/table-toolbar';

import UserBotTableRow from '../userbot-table-row';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import useAuth from 'src/hooks/useAuth';
import Swal from 'sweetalert2';
import io from 'socket.io-client';

// ----------------------------------------------------------------------

export default function UserBotsPage() {
  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  const [bots, setBots] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [limit, setLimit] = useState(5);

  const [searchOption, setSearchOption] = useState('all');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const ENDPOINT = 'http://localhost:9000';

  useEffect(() => {
    const socket = io(ENDPOINT);

    socket.on('botStarted', ({ userId }) => {
      if (userId === auth.user.userId) {
        fetchBots();
      }
    });

    socket.on('botFinished', ({ userId }) => {
      if (userId === auth.user.userId) {
        fetchBots();
      }
    });
    return () => {
      Swal.close();

      socket.disconnect();
    };
  }, [limit, currentPage, filterName, orderBy, order, searchOption]);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/groups/${auth.user.groupId}/bots?page=${currentPage}&limit=${limit}&search=${filterName}&searchOption=${searchOption}&orderBy=${orderBy}&order=${order}`,
      );

      if (!response.data.bots) setBots([]);
      else {
        await Promise.all(
          response.data.bots.map(async (bot) => {
            const response = await axiosPrivate.get(
              `/botinstances/status/${auth.user.userId}/${bot._id}`,
            );
            bot.status = response.data.status;
          }),
        );
        setBots(response.data.bots);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterName !== '') {
      setCurrentPage(1);
      const fetchData = async () => {
        await fetchBots();
      };

      fetchData();
    }
  }, [searchOption]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBots();
    };
    fetchData();
  }, [currentPage, filterName, limit, orderBy, order]);

  const handleSort = async (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      setCurrentPage(1);
      await fetchBots();
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bots.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setCurrentPage(1);
    setLimit(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setLoading(true);
    setFilterName(event);
    setCurrentPage(1);
  };

  const botStatus = (_id, newStatus) => {
    setBots((prevBots) =>
      prevBots.map((bot) => {
        if (bot._id === _id) {
          return {
            ...bot,
            status: newStatus,
          };
        } else {
          return bot;
        }
      }),
    );
  };

  const notFound = (!bots || bots.length === 0) && !loading;

  return (
    <Container
      sx={{
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Bots</Typography>
      </Stack>

      <Card>
        <TableToolBar
          numSelected={selected.length}
          handleFilterByName={handleFilterByName}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
          SEARCH_OPTIONS={[
            { value: 'all', label: 'All' },
            { value: 'name', label: 'Name' },
            { value: 'description', label: 'Description' },
          ]}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                loading={loading}
                order={order}
                orderBy={orderBy}
                rowCount={bots.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'guide', label: 'Guide' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {bots.length > 0 &&
                  bots.map((row, index) => (
                    <UserBotTableRow
                      key={row._id}
                      botStatus={botStatus}
                      bot={row}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#f7f7f7' : 'white',
                      }}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={
                    bots.length > 0
                      ? limit - bots.length > 0
                        ? limit - bots.length
                        : 0
                      : 0
                  }
                />

                {notFound && filterName !== '' && (
                  <TableNoData query={filterName} searchOption={searchOption} />
                )}
                {notFound && filterName == '' && (
                  <TableNoData query={null} searchOption={null} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Scrollbar>
          <TablePagination
            sx={{ overflow: 'unset' }}
            page={currentPage - 1}
            component="div"
            count={totalCount}
            rowsPerPage={limit}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={({ onPageChange }) => (
              <Box
                sx={{
                  flexShrink: 0,
                  ml: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  disabled={currentPage - 5 < 1 || !totalPages}
                  onClick={() => {
                    if (currentPage - 5 >= 1) {
                      onPageChange(null, currentPage - 5);
                    }
                  }}
                  sx={{
                    borderRadius: '50%',
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    padding: 0,
                    marginRight: 1,
                  }}
                >
                  <KeyboardDoubleArrowLeftIcon />
                </Button>

                <Pagination
                  count={totalPages}
                  page={currentPage}
                  color="primary"
                  onChange={onPageChange}
                />
                <Button
                  disabled={currentPage + 5 > totalPages || !totalPages}
                  onClick={() => {
                    if (currentPage + 5 <= totalPages) {
                      onPageChange(null, currentPage + 5);
                    }
                  }}
                  sx={{
                    borderRadius: '50%',
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    padding: 0,
                    marginRight: 1,
                  }}
                >
                  <KeyboardDoubleArrowRightIcon />
                </Button>
              </Box>
            )}
          />
        </Scrollbar>
      </Card>
    </Container>
  );
}
