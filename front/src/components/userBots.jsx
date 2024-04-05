import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import UploadFileModal from "../components/uploadFileModal";
import { io } from "socket.io-client";


const UserBots = () => {
    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");
    const [searchOption, setSearchOption] = useState("all");
    const axiosPrivate = useAxiosPrivate();
    const [bots, setBots] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [nextPageisLoading, setNextPageisLoading] = useState(false);
    const [selectedBot, setSelectedBot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const abortController = new AbortController();
    const ENDPOINT = 'http://localhost:9000';

    useEffect(() => {
        localStorage.setItem('userActiveComponent', 'userBots');
        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        const socket = io(ENDPOINT);

        socket.on('botStarted', ({ userId, botId }) => {
            if (userId === auth.userId) {
                setBots(prevBots => prevBots.map(bot => {
                    if (bot._id === botId) {
                        return { ...bot, status: 'active' };
                    } else {
                        return bot;
                    }
                }));
            }
        });

        return () => {
            socket.off();
        };
    }, []);


    const fetchBots = async (value) => {
        try {
            if (!nextPageisLoading)
                setLoading(true);
            const response = await axiosPrivate.get(
                `/groups/${auth.group}/bots?page=${currentPage + 1
                }&limit=${limit}&search=${value}&searchOption=${searchOption}`, {
                signal: abortController.signal
            }
            );

            await Promise.all(response.data.bots.map(async (bot) => {
                const response = await axiosPrivate.get(`/botinstances/status/${auth.userId}/${bot._id}`,
                    { signal: abortController.signal }
                );
                bot.status = response.data.status;
            }
            ));

            /* //batch method
            const batchSize = 10;
            const botIds = response.data.bots.map(bot => bot._id);
            const batches = [];
            for (let i = 0; i < botIds.length; i += batchSize) {
                batches.push(botIds.slice(i, i + batchSize));
            }

            // Fetch statuses for each batch of bot IDs
            const statusPromises = batches.map(async batch => {
                const batchResponse = await axiosPrivate.post('/botinstances/status', {
                    userId: auth.userId,
                    botIds: batch
                });
                return batchResponse.data;
            });

            // Wait for all status requests to complete
            const batchStatuses = await Promise.all(statusPromises);

            // Update bot statuses in the response data
            const updatedBots = response.data.bots.map((bot, index) => ({
                ...bot,
                status: batchStatuses[Math.floor(index / batchSize)].status[bot._id]
            })); */

            setBots(response.data.bots);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage - 1);
            setLoading(false);
        } catch (err) {

            console.error(err);
        } finally {
            setNextPageisLoading(false);
            setLoading(false);
        }
    };



    const request = debounce(async (value) => {
        await fetchBots(value);
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
                await fetchBots(search);
            };

            fetchData();
        }
    }, [searchOption]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchBots(search);
        };
        fetchData();
    }, [currentPage]);

    const handleStop = async (botId) => {
        try {
            Swal.fire({
                title: "Warning",
                text: "Are you sure you want to stop this bot?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Stopping bot...",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                    Swal.showLoading();
                    const respone = await axiosPrivate.delete(`/botinstances/status/${auth.userId}/${botId}`,
                        { signal: abortController.signal });
                    //update bot status 
                    setBots(prevBots => prevBots.map(bot => {
                        if (bot._id === botId) {
                            return { ...bot, status: 'inactive' };
                        } else {
                            return bot;
                        }
                    }));

                    if (respone.status === 200) {
                        Swal.fire({
                            title: "Bot stopped",
                            icon: "success",
                            confirmButtonText: "Ok",
                        });
                    }
                }
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    };

    const openModal = (id) => {
        setSelectedBot(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedBot(null);
        setShowModal(false);
    };

    useEffect(() => {
        if (showModal) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.paddingRight = '0';
            document.body.style.overflow = 'unset';
        }
    }, [showModal]);


    return (
        <div>
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
                            <option value="description">description</option>
                            <option value="status">status</option>
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
                    {bots?.length ? (
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
                                                Description
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
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bots.map((bot, index) => (
                                            <tr
                                                key={index}
                                                className={index % 2 === 0 ? "bg-gray-100" : ""}
                                            >
                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {currentPage * limit + index + 1}
                                                </td>

                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {bot.name}
                                                </td>

                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {bot.description}
                                                </td>

                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {bot.status}
                                                </td>

                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {bot.status === "inactive" ? (
                                                        <button onClick={() => openModal(bot._id)} className="bg-green-500  me-2 mb-2 px-5 py-2.5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" title="Start"
                                                        >
                                                            <FontAwesomeIcon icon={faPlay} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleStop(bot._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded me-2 mb-2 px-5 py-2.5" title="Stop" >
                                                            <FontAwesomeIcon icon={faStop} />
                                                        </button>
                                                    )
                                                    }
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
                        <p>No bots to display</p>
                    )}
                </>
            )}
            {showModal &&
                <UploadFileModal
                    isOpen={showModal}
                    onClose={closeModal}
                    selectedBot={selectedBot}
                    setBots={setBots}
                />
            }
        </div>
    );
}

export default UserBots;