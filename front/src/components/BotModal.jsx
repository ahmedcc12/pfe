import React, { useEffect } from "react";

const BotModal = ({ isOpen, onClose, botNames, groupName }) => {
    useEffect(() => {
        console.log("BotModal");
    }, []);
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-70 ${isOpen ? "" : "hidden"
                }`}
        >

            <div className="relative w-auto min-w-[300px] max-w-xl mx-auto my-6">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="text-3xl font-semibold">{groupName} Bots :</h3>
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
                            {(botNames?.length === 0 || !botNames) && <li>No bots found</li>}
                            {botNames?.map((botName, index) => (
                                <li key={index} className="mb-2">
                                    {botName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
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
