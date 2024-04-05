import { useEffect, useState, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Swal from 'sweetalert2';
import { TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination";
import debounce from "lodash.debounce";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const UserActivity = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPageisLoading, setNextPageisLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchOption, setSearchOption] = useState("all");
    const abortController = new AbortController();
    const ENDPOINT = 'http://localhost:9000';

    useEffect(() => {
        localStorage.setItem('userActiveComponent', 'userActivity');
    }, []);

    useEffect(() => {
        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        const socket = io(ENDPOINT);

        socket.on('botStarted', ({ userId, botId }) => {
            if (userId === auth.userId) {
                fetchActivity(search);
            }
        });

        return () => {
            socket.off();
        }
    }, []);


    const fetchActivity = async (value) => {
        try {
            if (!nextPageisLoading)
                setLoading(true);
            const response = await axiosPrivate.get(`/botinstances/user/${auth.userId}?page=${currentPage + 1
                }&limit=${limit}&search=${value}&searchOption=${searchOption}`,
                { signal: abortController.signal });
            setActivity(response.data.botInstances);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setNextPageisLoading(false);
            setLoading(false);
        }
    };


    const request = debounce(async (value) => {
        await fetchActivity(value);
    }, 500);

    const onChangeSearch = (e) => {
        setSearch(e.target.value);
        setLoading(true);
        debounceRequest(e.target.value);
        setCurrentPage(0);
    };

    const debounceRequest = useCallback((search) => request(search), [searchOption]);

    useEffect(() => {
        if (search !== "") {
            setCurrentPage(0);
            const fetchData = async () => {
                await fetchActivity(search);
            };

            fetchData();
        }
    }, [searchOption]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchActivity(search);
        };
        fetchData();
    }, [currentPage]);


    return (
        <div className="mt-8">
            <h2 className="text-xl">Activity</h2>
            <hr className="my-4" />
            <div>
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
                        </select>
                        <label className="pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r">
                            Search by
                        </label>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <TailSpin color="#3B82F6" height={50} width={50} />
                </div>
            ) : (
                <>
                    {activity?.length ? (
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
                                                Bot name
                                            </th>
                                            <th
                                                scope="col"
                                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                                            >
                                                Config
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activity.map((instance, index) => (
                                            <tr
                                                key={index}
                                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                                            >
                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {currentPage * limit + index + 1}
                                                </td>
                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {instance.bot.name}
                                                </td>
                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {instance.status === "active" ? (
                                                        <span className="text-green-500">Running</span>
                                                    )
                                                        : instance.status === "inactive" && instance.isScheduled ? (
                                                            <span className="text-yellow-500">Scheduled for {dayjs(instance.scheduledAt).format('D,MMMM, YYYY, h:mm:ss A')}</span>
                                                        )
                                                            : instance.status === "inactive" ? (
                                                                <span className="text-red-500">Stopped</span>
                                                            )
                                                                : (
                                                                    <span className="text-red-500">Error</span>
                                                                )}
                                                </td>
                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    <a
                                                        href={instance.configuration.downloadURL}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-500"
                                                    >
                                                        View config <FontAwesomeIcon icon={faEye} />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </>
                    ) : (
                        <p>No Activity to display</p>
                    )}
                </>
            )}
        </div>
    );
};

export default UserActivity;