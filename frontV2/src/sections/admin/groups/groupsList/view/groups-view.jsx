import { useState, useEffect } from 'react';
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

import GroupTableRow from '../group-table-row';

import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------

export default function GroupsPage() {
  const axiosPrivate = useAxiosPrivate();

  const [groups, setGroups] = useState([]);

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

  useEffect(() => {
    return () => {
      Swal.close();
    };
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/groups?page=${currentPage}&limit=${limit}&search=${filterName}&searchOption=${searchOption}&orderBy=${orderBy}&order=${order}`,
      );
      if (!response.data.groups) setGroups([]);
      else {
        setGroups(response.data.groups);
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
        await fetchGroups();
      };

      fetchData();
    }
  }, [searchOption]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchGroups();
    };
    fetchData();
  }, [currentPage, filterName, limit, orderBy, order]);

  const handleSort = async (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
      setCurrentPage(1);
      await fetchGroups();
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = groups.map((n) => n._id);
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

  const groupDeleted = (_id) => {
    const newGroups = groups.filter((group) => group._id !== _id);
    setGroups(newGroups);
    setTotalCount(totalCount - 1);
  };

  const notFound =
    (!groups || groups.length === 0) && !loading && filterName !== '';

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
        <Typography variant="h4">Groups</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => navigate('/admin/groups/new')}
        >
          New Group
        </Button>
      </Stack>

      <Card>
        <TableToolBar
          numSelected={selected.length}
          handleFilterByName={handleFilterByName}
          setSearchOption={setSearchOption}
          searchOption={searchOption}
          SEARCH_OPTIONS={null}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                loading={loading}
                order={order}
                orderBy={orderBy}
                rowCount={groups.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'bots', label: 'Bots' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {groups.length > 0 &&
                  groups.map((row, index) => (
                    <GroupTableRow
                      key={row._id}
                      groupDeleted={groupDeleted}
                      group={row}
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
                    groups.length > 0
                      ? limit - groups.length > 0
                        ? limit - groups.length
                        : 0
                      : 0
                  }
                />

                {notFound && (
                  <TableNoData query={filterName} searchOption={searchOption} />
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
