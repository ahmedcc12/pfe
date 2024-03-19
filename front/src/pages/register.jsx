import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { MultiSelect } from "react-multi-select-component";

export default function RegisterPage() {
  const { matricule } = useParams();
  const [newMatricule, setNewMatricule] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const userrole = auth.role;
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();
  const [allBots, setAllBots] = useState([]);
  const [selectedBots, setSelectedBots] = useState([]);


  useEffect(() => {
    if (!matricule)
      return;

    const fetchUser = async () => {
      try {
        console.log("fetching user with id ", matricule)
        const { data } = await axiosPrivate.get(`/users/${matricule}`);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setDepartment(data.department);
        setNewMatricule(data.matricule);
        setEmail(data.email);
        setRole(data.role);
        /*         setSelectedBots(data.access.map(bot => {
                  return {
                    label: bot.name,
                    value: bot._id
                  };
                })); */

        console.log("selectedBots", selectedBots);
      } catch (error) {
        console.error("Error fetching user", error);
        //redirect user to /missing route
        Navigate('/missing');
      }
    }
    fetchUser();
  }, [matricule]);

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

      if (matricule) {
        await axiosPrivate.put(`/users/${matricule}`, {
          newMatricule,
          email,
          firstname,
          lastname,
          department,
          role,
          selectedBots,
          userrole
        });
      } else {
        await axiosPrivate.post("/register", {
          newMatricule,
          email,
          firstname,
          lastname,
          department,
          role,
          selectedBots,
          userrole
        });
      }
      setSuccess(true);
    } catch (err) {
      console.error("Error registering user", err);
      const errorMessage = err.response?.data?.message || "An error occurred";
      setErrMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const { data } = await axiosPrivate.get("/bots");
        setAllBots(data.bots);
      } catch (error) {
        console.error("Error fetching bots", error);
      }
    };
    fetchBots();
  }, []);

  const options = allBots.map((bot) => ({
    label: bot.name,
    value: bot._id,
  }));

  const handleChange = (selectedOptions) => {
    setSelectedBots(selectedOptions);
  };

  return (
    <div>
      {success ? (
        Navigate("/admin")
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">{matricule ? <>Edit</> : <>Register</>}</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
              <input
                required
                type="text"
                placeholder="matricule"
                value={newMatricule}
                onChange={(ev) => setNewMatricule(ev.target.value)}
                maxLength={50}
              />
              <input
                required
                type="text"
                placeholder="firstname"
                value={firstname}
                onChange={(ev) => setFirstname(ev.target.value)}
                maxLength={20}
              />
              <input
                required
                type="text"
                placeholder="lastname"
                value={lastname}
                onChange={(ev) => setLastname(ev.target.value)}
                maxLength={20}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                maxLength={254}
              />
              <input
                required
                type="text"
                placeholder="department"
                value={department}
                onChange={(ev) => setDepartment(ev.target.value)}
                maxLength={50}
              />
              <select
                value={role || "user"}
                onChange={(ev) => setRole(ev.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <MultiSelect
                options={options}
                value={selectedBots}
                onChange={handleChange}
                labelledBy="Select"
              />
              {matricule ? (
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
