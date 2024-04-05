import { useState, useEffect } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const abortController = new AbortController();


    useEffect(() => {
        return () => {
            abortController.abort();
            Swal.close();
        };
    }, []);

    useEffect(() => {
        setMessage('');
    }, [email]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Sending email...',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        Swal.showLoading();
        try {
            const response = await axios.post('/auth/forgotpassword', { email }, { signal: abortController.signal });
            Swal.fire({
                title: 'Email sent',
                text: 'Please check your email to reset your password',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            setEmail('');
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Request aborted');
                return;
            }
            Swal.close();
            setMessage(err.response?.data?.message);
            return;
        }
    }

    return (
        <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">

            <>
                <h1 className="text-4xl font-medium">Forgot Your Password?</h1>
                <br />
                <p className="text-slate-500">Enter your email address below and we'll send you a link to reset your password.</p>

                <form className="my-10" onSubmit={handleForgotPassword}>
                    <div className="flex flex-col space-y-5">
                        <label htmlFor="email">
                            <p className="font-medium text-slate-700 pb-2">Email address</p>
                            <input id="email" name="email" type="email" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter email address" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </label>

                        <button type="submit" className="w-full py-3 font-medium text-white primary hover:bg-red-600 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                            <span>Send mail</span>
                        </button>
                        <p className="text-center"> <a href="/login" className="text-black font-medium inline-flex space-x-1 items-center"><span>Login</span><span><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg></span></a></p>
                    </div>
                </form>
            </>
            {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
    )
}

export default ForgotPassword;