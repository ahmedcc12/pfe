
import React from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload} from '@fortawesome/free-solid-svg-icons';

const Homepage = () => {
    const [limit , setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [bots, setBots] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const {auth} = useAuth();

    const fetchBots = async () => {
        try {
            const response = await axiosPrivate.get(`/users/userbots?page=${currentPage+1}&limit=${limit}&search=${search}&matricule=${auth.matricule}`);
            setBots(response.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error(err);
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

    useEffect(() => {
        setCurrentPage(0);
    }, [search]);

    useEffect(() => {
        fetchBots();
    }, [currentPage, search]);

    return (
        <article>
        <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Homepage</h2>
        <p>Welcome to the homepage</p>
        <br />
        <div className="p-4">
    <label htmlFor="table-search" className="sr-only">Search</label>
    <div className="relative mt-1 flex items-center">
        
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
        </div>
        
        <input 
            onChange={(e) => setSearch(e.target.value)}
            type="text" 
            id="table-search" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 pl-10 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-10" 
            placeholder="Search for users"
        />
        <Link to="/admin/bot/add" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-6 border border-gray-400 rounded shadow ml-4">
            add bot
        </Link>
    </div>
</div>

{bots?.length ? (
            <>

<table className="min-w-full">

    <thead className="bg-white border-b">
    <tr>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        #
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        Name
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        Description
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        Status
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        Configure
        </th>
        {auth.role == "admin" ?
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        Action
        </th>
        :
        null
}
    </tr>
    </thead>
    <tbody>
    {
    bots.map((bot, index) => (

        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{currentPage * limit + index + 1 }</td>

        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{bot.name}</td>

        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{bot.description}</td>
        
        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{bot.status}</td>

        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">  <a href={bot.configuration?.downloadURL} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faDownload} />
</a></td>
        </tr>
    )
    )}
    </tbody>
</table>
<div>
<Pagination             
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage} />
</div>
</>
) : <p>No bots to display</p>}

        </div>
        </article>



    );
};

export default Homepage;