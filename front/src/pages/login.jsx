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
    if (auth.accessToken) {
      navigate("/");
    }
  }, [auth, navigate]);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    if (useAuth.accessToken) {
      console.log('accessToken',useAuth.accessToken)
      console.log('auth',useAuth)
    }
    const {error}=await handleLogin(email, password);
    if(!error)
    navigate("/");
  }

  return (
    <div>
      {redirect ? (
        <Navigate to={"/"} />
      ) : (
        <div className="flex items-center justify-center h-screen">
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