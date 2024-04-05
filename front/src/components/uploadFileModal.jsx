import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@mui/material";

const UploadFileModal = ({ isOpen, onClose, selectedBot, setBots }) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const abortController = new AbortController();
    const [errorMessage, setError] = useState(null);


    const handleClose = () => {
        setSelectedFile(null);
        setSelectedDate(null);
        onClose();
    };


    useEffect(() => {
        return () => {
            abortController.abort();
        }
    }, []);

    async function handleStart(ev) {
        ev.preventDefault();
        const title = selectedDate ? "Scheduling bot..." : "Starting bot...";

        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("bot", selectedBot);
            formData.append("user", auth.userId);
            if (selectedDate) {
                formData.append("scheduled", selectedDate);
            }

            Swal.fire({
                title: title,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            Swal.showLoading();
            try {
                if (selectedDate) {
                    console.log("schedule")
                    const response = await axiosPrivate.post(`/botinstances/scheduled`, formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Bot scheduled",
                            icon: "success",
                            confirmButtonText: "Ok",
                        });
                    }
                }
                else {
                    const response = await axiosPrivate.post(`/botinstances`, formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );

                    setBots(prevBots => prevBots.map(bot => {
                        if (bot._id === selectedBot) {
                            return { ...bot, status: 'active' };
                        } else {
                            return bot;
                        }
                    }));

                    if (response.status === 200) {
                        Swal.fire({
                            title: "Bot started",
                            icon: "success",
                            confirmButtonText: "Ok",
                        });
                    }
                }
            }
            catch (error) {
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
            finally {
                setSelectedFile(null);
                onClose();
            }
        }
        else {
            alert("Please select a file");
        }
    };

    const handlePreview = (e) => {
        e.preventDefault();
        const objectUrl = URL.createObjectURL(selectedFile);
        window.open(objectUrl, "_blank");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (!selectedDate) {
            setError(null);
        }
        if (selectedDate && selectedDate.isBefore(dayjs().add(0, 'minute'))) {
            setError("Time must be at least 5 minutes from now");
        }
        else {
            setError(null);
        }
    }, [selectedDate])

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ${isOpen ? "" : "hidden"}`}>
            <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
                <div className="flex flex-col w-80 px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue">
                    <form>
                        <div className="flex flex-col gap-4">

                            <h3 className="font-bold">Upload Config</h3>

                            {selectedFile &&
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        TextField={(props) => <TextField {...props} />}
                                        minDateTime={dayjs().add(0, 'day').add(0, 'minute')}
                                        maxDateTime={dayjs().add(2, 'month')}
                                        slotProps={{
                                            textField: {
                                                helperText: errorMessage,
                                            },
                                            field: { clearable: true }
                                        }}
                                        label="Schedule date and time"
                                        disablePast
                                        className="w-full"
                                    />
                                </LocalizationProvider>

                            }
                            <label
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:scale-105 "
                            >
                                <svg
                                    className="w-8 h-8"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                </svg>
                                <span className="mt-2 text-base leading-normal">Select a file</span>
                                <input type="file" required className="hidden" onChange={(ev) => setSelectedFile(ev.target.files[0])} />
                            </label>


                            {selectedFile && (
                                <>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={(e) => handlePreview(e)}
                                    >
                                        <span className="text-sm"> <FontAwesomeIcon icon={faEye} /> {selectedFile.name}</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className={selectedDate && selectedDate.isBefore(dayjs().add(0, 'minute')) ? "bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed" : "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}
                                        onClick={handleStart}
                                        disabled={selectedDate && selectedDate.isBefore(dayjs().add(0, 'minute'))}
                                    >
                                        {selectedDate ? "Schedule Bot" : "Start Bot"}
                                    </button>
                                </>
                            )}
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>

                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default UploadFileModal;
