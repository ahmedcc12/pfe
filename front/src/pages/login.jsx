import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import ReCAPATCHA from "react-google-recaptcha";
import { TailSpin } from 'react-loader-spinner';


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setpwd] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth, persist, setPersist } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);



  useEffect(() => {
    setError('');
  }, [email, pwd])


  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/auth",
        JSON.stringify({ email, pwd, recaptchaToken: captcha }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        const matricule = response?.data?.matricule;
        const group = response?.data?.group;
        const userId = response?.data?.userId;

        setAuth({ matricule, accessToken, role, group, userId });
        console.log('auth', auth);

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
  }, [persist])

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
                maxLength={254}
              />
              <input id="Password" name="Password" type="Password" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Password"
                value={pwd}
                onChange={(ev) => setpwd(ev.target.value)}
                required
                maxLength={100}
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

              <ReCAPATCHA
                sitekey="6LfJJpgpAAAAAJdpjY7H-y2y1wakE7-XMAK2D6hk"
                onChange={(value) => setCaptcha(value)}
              />

              <button disabled={loading || !captcha} className="primary">Login</button>
              {error && <div className="text-red-500">{error}</div>}

              {loading && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <TailSpin color="#3B82F6" height={50} width={50} />
                </div>
              )}

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