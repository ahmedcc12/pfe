import React, { useEffect, useState } from "react";
import { Pagination } from '@mui/material';

const BotModal = ({ isOpen, onClose, botNames, groupName }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const botsPerPage = 5;

    useEffect(() => {
        console.log("BotModal");
    }, []);

    const indexOfLastBot = currentPage * botsPerPage;
    const indexOfFirstBot = indexOfLastBot - botsPerPage;
    const currentBots = botNames.slice(indexOfFirstBot, indexOfLastBot);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-70 ${isOpen ? "" : "hidden"
                }`}
        >
            <div className="relative w-auto min-w-[300px] max-w-xl mx-auto my-6">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="text-3xl font-semibold "><span className="font-bold uppercase">{groupName}</span> Bots </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>
                    <div className="relative p-6 flex-auto">
                        <ul>
                            {(currentBots.length === 0 || !currentBots) && <li>No bots found</li>}
                            {currentBots.map((botName, index) => (
                                <div key={index}>
                                    <li className="mb-2">
                                        {botName}
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-between items-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <div>
                            <Pagination
                                count={Math.ceil(botNames.length / botsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                        <button
                            className="text-blue-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                            type="button"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BotModal;
