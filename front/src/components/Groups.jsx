import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import debounce from 'lodash.debounce';
import BotModal from '../components/BotModal';
import { TailSpin } from 'react-loader-spinner';

const Groups = () => {
  const [groups, setGroups] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchOption, setSearchOption] = useState('all');
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [botNames, setBotNames] = useState([]);
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [nextPageisLoading, setNextPageisLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const abortController = new AbortController();

  useEffect(() => {
    localStorage.setItem('adminActiveComponent', 'groups');
  }, []);

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const fetchGroups = async (value) => {
    try {
      if (!nextPageisLoading) setLoading(true);
      const response = await axiosPrivate.get(
        `/groups?page=${
          currentPage + 1
        }&limit=${limit}&search=${value}&searchOption=${searchOption}`,
        { signal: abortController.signal }
      );
      setGroups(response.data.groups);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      //navigate('/login', { state: { from: location }, replace: true });
    } finally {
      setNextPageisLoading(false);
      setLoading(false);
    }
  };

  const request = debounce(async (value) => {
    await fetchGroups(value);
  }, 500);

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    setLoading(true);
    debounceRequest(e.target.value);
    setCurrentPage(0);
  };

  const debounceRequest = useCallback((search) => request(search), [searchOption]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchGroups(search);
    };
    fetchData();
  }, [currentPage]);

  const deleteGroup = async (_id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this group!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting group...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        setNextPageisLoading(true);
        await axiosPrivate.delete(`/groups/${_id}`, { signal: abortController.signal });
        Swal.fire('Deleted!', 'Group has been deleted.', 'success');
        setGroups(groups.filter((group) => group._id !== _id));
        setNextPageisLoading(false);
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete group.', 'error');
      }
    } else {
    }
  };

  const editGroup = (groupId) => {
    navigate(`/admin/group/editGroup/${groupId}`);
  };

  const viewBots = async (_id, name) => {
    try {
      setModalIsLoading(true);
      const response = await axiosPrivate.get(`/groups/${_id}/bots`, {
        signal: abortController.signal,
      });
      setModalIsLoading(false);
      setSelectedGroup(name);
      openModal(response?.data?.bots?.map((bot) => bot?.name));
    } catch (error) {
      console.error(error);
      setModalIsLoading(false);
      Swal.fire('Error!', 'Failed to get bots', 'error');
    }
  };

  const openModal = (names) => {
    setBotNames(names);
    setShowModal(true);
  };

  const closeModal = () => {
    setBotNames([]);
    setShowModal(false);
  };

  return (
    <article>
      <h2>Groups List</h2>
      <hr className="my-4" />

      <div className="p-4">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1 flex items-center">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          <input
            maxLength={50}
            value={search}
            onChange={onChangeSearch}
            type="text"
            id="table-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 pl-10 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-10"
            placeholder="Search for users"
          />
          <div className="relative h-10 w-72 min-w-[200px]">
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 disabled:border-0 disabled:bg-blue-gray-50"
            >
              <option value="all">All</option>
              <option value="name">name</option>
            </select>
            <label className="pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r">
              Search by
            </label>
          </div>
          <Link
            to="/admin/group/createGroup"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-6 border border-gray-400 rounded shadow ml-4"
          >
            add group
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <TailSpin color="#3B82F6" height={50} width={50} />
        </div>
      ) : (
        <>
          {groups?.length ? (
            <>
              {nextPageisLoading ? (
                <div className="flex justify-center items-center h-40">
                  <TailSpin color="#3B82F6" height={50} width={50} />
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                      >
                        Bots
                      </th>

                      {auth.user.role == 'admin' ? (
                        <th
                          scope="col"
                          className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                        >
                          Action
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          {currentPage * limit + index + 1}
                        </td>

                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          {group.name}
                        </td>
                        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                          <button
                            type="button"
                            title="viewBots"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={() => viewBots(group._id, group.name)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span className="ml-2">{group.bots.length} Bots</span>
                          </button>
                          {modalIsLoading ? (
                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                              <TailSpin color="#3B82F6" height={50} width={50} />
                            </div>
                          ) : null}
                        </td>
                        {auth.user.role == 'user' ? null : (
                          <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                            <button
                              type="button"
                              title="Delete"
                              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                              onClick={() => deleteGroup(group._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button
                              type="button"
                              title="Edit"
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              onClick={() => editGroup(group._id)}
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setNextPageisLoading={setNextPageisLoading}
              />
            </>
          ) : (
            <p>No groups to display</p>
          )}
        </>
      )}
      {showModal && (
        <BotModal
          isOpen={showModal}
          onClose={closeModal}
          botNames={botNames}
          groupName={selectedGroup}
        />
      )}
    </article>
  );
};

export default Groups;
