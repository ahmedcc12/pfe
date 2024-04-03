import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Swal from "sweetalert2";
import useAuth from '../hooks/useAuth';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    setMessage('');
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setTokenValid(true);
    axios.get(`/auth/resetpassword/${token}`)
      .then(response => {
        setTokenValid(true);
      })
      .catch(error => {
        setTokenValid(false);
      });
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      Swal.fire({
        title: 'Updating password...',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      Swal.showLoading();

      const response = await axios.post('/auth/resetpassword', { token, newPassword, confirmPassword });
      Swal.fire({
        title: 'Success',
        text: 'Password updated',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/';
        }
      });

    } catch (error) {
      setMessage(error.response.data.message);
      return;
    }

  };
  return (
    <>
      {tokenValid ? (

        <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
          <h1 className="text-4xl font-medium">Reset password</h1>
          <p className="text-slate-500">Fill up the form to reset the password</p>

          <form className="my-10" onSubmit={handleResetPassword}>
            <div className="flex flex-col space-y-5">

              <label for="Password">
                <input id="Password" name="Password" type="Password" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="New password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
              </label>

              <label for="Password">
                <input id="Password" name="Password" type="Password" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Confirm password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required />
              </label>

              <button type="submit" className="w-full py-3 font-medium text-white primary hover:bg-red-600 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
                <span>Reset password</span>
              </button>
              {!auth.accessToken ? (
                <p className="text-center"> <a href="/login" className="text-black font-medium inline-flex space-x-1 items-center"><span>Login</span><span><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg></span></a></p>
              ) : (
                null
              )}
              {message && <p>{message}</p>}
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-medium">Invalid or expired token</h1>
          <Link to="/login" className="text-blue-500">Go back</Link>
        </div>
      )}

    </>
  )
}
export default ResetPassword;
