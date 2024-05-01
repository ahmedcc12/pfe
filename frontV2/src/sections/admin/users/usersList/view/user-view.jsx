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
import TableToolbar from 'src/components/tables/table-toolbar';

import UserTableRow from '../user-table-row';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------

export default function UserPage() {
  const axiosPrivate = useAxiosPrivate();

  const [users, setUsers] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('matricule');

  const [filterName, setFilterName] = useState('');

  const [limit, setLimit] = useState(5);

  const [searchOption, setSearchOption] = useState('all');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      Swal.close();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/users?page=${currentPage}&limit=${limit}&search=${filterName}&searchOption=${searchOption}&orderBy=${orderBy}&order=${order}`,
      );
      if (!response.data.users) setUsers([]);
      else setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
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
        await fetchUsers();
      };

      fetchData();
    }
  }, [searchOption]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };
    fetchData();
  }, [currentPage, filterName, limit, orderBy, order]);

  const handleSort = async (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      setCurrentPage(1);
      await fetchUsers();
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
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

  const userDeleted = (_id) => {
    const newUsers = users.filter((user) => user._id !== _id);
    setUsers(newUsers);
    setTotalCount(totalCount - 1);
  };

  const notFound = (!users || users.length === 0) && !loading;

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
        <Typography variant="h4">Users</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => navigate('/admin/users/new')}
        >
          New User
        </Button>
      </Stack>

      <Card>
        <TableToolbar
          numSelected={selected.length}
          handleFilterByName={handleFilterByName}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
          SEARCH_OPTIONS={[
            { value: 'all', label: 'All' },
            { value: 'matricule', label: 'Matricule' },
            { value: 'firstname', label: 'Firstname' },
            { value: 'lastname', label: 'Lastname' },
            { value: 'email', label: 'Email' },
            { value: 'role', label: 'Role' },
            { value: 'department', label: 'Department' },
            { value: 'group', label: 'Group' },
          ]}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                loading={loading}
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'matricule', label: 'Matricule' },
                  { id: 'firstname', label: 'Firstname' },
                  { id: 'lastname', label: 'Lastname' },
                  { id: 'role', label: 'Role' },
                  { id: 'email', label: 'Email' },
                  { id: 'department', label: 'Department' },
                  { id: 'group', label: 'Group' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {users.length > 0 &&
                  users.map((row, index) => (
                    <UserTableRow
                      key={row._id}
                      userDeleted={userDeleted}
                      user={row}
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
                    users.length > 0
                      ? limit - users.length > 0
                        ? limit - users.length
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
