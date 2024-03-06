import {  useNavigate } from "react-router-dom";
import {  useEffect, useState} from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setpwd] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const { auth,setAuth,persist,setPersist } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setError('');
}, [email, pwd])

  useEffect(() => {
    if (auth.accessToken) {
      navigate("/");
    }
  }, [auth, navigate]);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    try{
      const response = await axios.post("/auth", 
      JSON.stringify({ email, pwd }),
      {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
      }
      );
      if(response.status === 200){
          const accessToken = response?.data?.accessToken;
          const role = response?.data?.role;
          const access = response?.data?.access;
                          
          setAuth({ email, accessToken, role, access });
      
      }
  } 
  catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "An error occurred");
  }
  setLoading(false);

  console.log('Loading:', loading, 'Error:', error)

}

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem('persist', persist);
  },[persist])

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
                required
              />
              <input
                type="password"
                placeholder="password"
                value={pwd}
                onChange={(ev) => setpwd(ev.target.value)}
                required
              />
<div className="flex items-center justify-between">
  <div className="flex items-center">
    <input
      type="checkbox"
      id="persist"
      checked={persist}
      onChange={togglePersist}
    />
    <label htmlFor="persist" className="ml-2">
      Remember Me
    </label>
  </div>
  <div className="text-center py-2 text-gray-500">
    <Link className="underline text-black" to={"/forgotpassword"}>
      Forgot your password?
    </Link>
  </div>
</div>


              <button disabled={loading} className="primary">Login</button>
              {error && <div className="text-red-500">{error}</div>}

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
    </div>
  );
}