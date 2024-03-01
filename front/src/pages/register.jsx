import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSignup from "../hooks/useSignup";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const { handleSignup, error, isLoading } = useSignup();

    const navigate = useNavigate();

 /* const showToastMessage = (message, type, redirectToLogin = false) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        if (redirectToLogin) {
          // Redirect to the login page after the toast is closed
          navigate('/login');
        }
      },
    });
  };*/

  async function registerUser(ev) {
    ev.preventDefault();
    const {error} = await handleSignup(email, name, password, role);
    console.log('error', error);
    if (!error) navigate("/admin");
  }

  return (
    <div>
      <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
          <h1 className="text-4xl text-center mb-4">Register</h1>
          <form className="max-w-md mx-auto" onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <select
              value={role}
              onChange={(ev) => setRole(ev.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          
            <button diabled={isLoading} className="primary">Sign up user</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}