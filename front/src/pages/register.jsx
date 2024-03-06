import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate"; 
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const {id} = useParams();
  const [matricule, setMatricule] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [access, setAccess] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const userrole = auth.role;
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();

  useEffect (() => {
    if (!id) 
      return;

    const fetchUser = async () => {
      try {
        const { data } = await axiosPrivate.get(`/users/${id}`);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setDepartment(data.department);
        setMatricule(data.matricule);
        setEmail(data.email);
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching user", error);
        //redirect user to /missing route
        Navigate('/missing');
      }
    }
    fetchUser();
  }, [id]);

  useEffect(() => {
    setErrMsg('');
  }, [email])

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  async function registerUser(ev) {
    ev.preventDefault();
    setLoading(true);

    try {
      if (!validateEmail(email)) {
       setErrMsg("Please enter a valid email address");
        return;
      }

      if (id) {
        console.log("Updating user" , id , matricule, email, firstname, lastname, department, role, access, userrole);
        await axiosPrivate.put(`/users/${id}`, {
          matricule,
          email,
          firstname,
          lastname,
          department,
          role,
          access,
          userrole
        });
      } else {
        await axiosPrivate.post("/register", {
          matricule,
          email,
          firstname,
          lastname,
          department,
          role,
          access,
          userrole
        });
      }
      setSuccess(true);
    }  catch (err) {
      console.error("Error registering user", err);
      const errorMessage = err.response?.data?.message || "An error occurred";
      setErrMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {success ? (
        Navigate("/admin")
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
            <input
                required
                type="text"
                placeholder="matricule"
                value={matricule}
                onChange={(ev) => setMatricule(ev.target.value)}
              />
              <input
                required
                type="text"
                placeholder="firstname"
                value={firstname}
                onChange={(ev) => setFirstname(ev.target.value)}
              />
              <input
                required
                type="text"
                placeholder="lastname"
                value={lastname}
                onChange={(ev) => setLastname(ev.target.value)}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <input
                required
                type="text"
                placeholder="department"
                value={department}
                onChange={(ev) => setDepartment(ev.target.value)}
              />
              <select
                value={role || "user"}
                onChange={(ev) => setRole(ev.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {id ? (
                <button disabled={loading} className="primary">Update User</button>
              ) : (
                <button disabled={loading} className="primary">Sign Up</button>
              )}
              {errMsg && <div className="error">{errMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
