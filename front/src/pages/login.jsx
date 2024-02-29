import {  useNavigate } from "react-router-dom";
import { useContext, useEffect, useState} from "react";
import useLogin from "../hooks/useLogin";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { handleLogin, loading, error } = useLogin();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const showToastMessage = (message, type, redirectToLogin = false) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        if (redirectToLogin) {
          // Redirect to the login page after the toast is closed
          navigate('/login');
        }
      },
    });
  };

  useEffect(() => {
    // If user is logged in, redirect to homepage
    if (auth.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    if (useAuth.token) {
      console.log('token',useAuth.token)
      console.log('auth',useAuth)
    }
    await handleLogin(email, password);

    navigate("/");
  }

  return (
    <div>
      {redirect ? (
        <Navigate to={"/"} />
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
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
              <button disabled={loading} className="primary">Login</button>
            {/*  <div className="text-center py-2 text-gray-500">
                Don't have an account yet?{" "}
                <Link className="underline text-black" to={"/register"}>
                  Register now
                </Link>
      </div>*/}
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}