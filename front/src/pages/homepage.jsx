import React from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPlay, faStop, faCalendar, faC } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import CustomCalendar from "../components/customCalendar";


const Homepage = () => {
    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");
    const [searchOption, setSearchOption] = useState("all");
    const axiosPrivate = useAxiosPrivate();
    const [bots, setBots] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const MySwal = withReactContent(Swal)

    const fetchBots = async (value) => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get(
                `/users/userbots?page=${currentPage + 1
                }&limit=${limit}&search=${value}&searchOption=${searchOption}&matricule=${auth.matricule
                }`
            );
            setBots(response.data.bots);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            console.error(err);
            //navigate('/login', { state: { from: location }, replace: true });
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

    const debounceRequest = useCallback((search) => request(search), []);

    useEffect(() => {
        if (search !== "") {
            setCurrentPage(0);
            const fetchData = async () => {
                await fetchBots(search);
                setLoading(false);
            };

            fetchData();
        }
    }, [searchOption]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchBots(search);
        };
        fetchData();
        setLoading(false);
    }, [currentPage]);

    const handleCalendar = (name) => async (e) => {
        e.preventDefault();
        MySwal.fire({
            title: 'Select a date',
            html: <CustomCalendar onSelect={setSelectedDate} />,
            showCancelButton: true,
            confirmButtonText: `Save`,
            cancelButtonText: "Cancel",
            icon: "info",
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log('Selected date:', selectedDate);
                await axiosPrivate.post("/bots/schedule", { name, schedule: selectedDate });
                Swal.close();
            }
        });
    };

    const runOrStopBot = (status, name) => async (e) => {
        e.preventDefault();
        try {
            let action = null;
            if (status === "active") action = "run";
            else action = "stop";
            Swal.fire({
                title: `Are you sure you want to ${action} the bot?`,
                showCancelButton: true,
                confirmButtonText: `Yes, ${action} it`,
                cancelButtonText: "No, cancel",
                icon: "warning",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axiosPrivate.post("/bots/status", { status, name });

                    setBots((prevBots) => {
                        return prevBots.map((bot) => {
                            if (bot.name === name) {
                                return {
                                    ...bot,
                                    status: status === "active" ? "active" : "inactive",
                                };
                            }
                            return bot;
                        });
                    });
                }
            });

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <article>
            <div className="container mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">Homepage</h2>
                <p>Welcome to the homepage</p>
                <br />

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
                    <p>Loading...</p>
                ) : (
                    <>
                        {bots?.length ? (
                            <>
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
                                                Configuration
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
                                                    <a className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                                        href={bot.configuration?.downloadURL}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Download"
                                                    >
                                                        <FontAwesomeIcon className="fill-current w-4 h-4 mr-2" icon={faDownload} />
                                                        <span>Download</span>
                                                    </a>
                                                </td>
                                                <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                                    {bot.status === "inactive" ? (
                                                        <button onClick={runOrStopBot('active', bot.name)} className="bg-green-500  me-2 mb-2 px-5 py-2.5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" title="Start"
                                                        >
                                                            <FontAwesomeIcon icon={faPlay} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={runOrStopBot('inactive', bot.name)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded me-2 mb-2 px-5 py-2.5" title="Stop" >
                                                            <FontAwesomeIcon icon={faStop} />                                                        </button>
                                                    )
                                                    }
                                                    <>
                                                        <button onClick={handleCalendar(bot.name)} className="bg-blue-500 me-2 mb-2 px-5 py-2.5 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" title="Stop" >
                                                            <FontAwesomeIcon icon={faCalendar} />                                                        </button>

                                                    </>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div>
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                </div>
                            </>
                        ) : (
                            <p>No bots to display</p>
                        )}
                    </>
                )}
            </div>
        </article >
    );
};

export default Homepage;
