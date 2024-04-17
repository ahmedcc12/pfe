import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Select from 'react-select';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { userId } = useParams();
  const [matricule, setMatricule] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const axiosPrivate = useAxiosPrivate();
  const [group, setGroup] = useState('');
  const [allGroups, setAllGroups] = useState([]);
  const { auth } = useAuth();
  const userrole = auth.user.role;
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();
  const abortController = new AbortController();

  useEffect(() => {
    return () => {
      abortController.abort();
      Swal.close();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        console.log('fetching user with id ', userId);
        const { data } = await axiosPrivate.get(`/users/${userId}`, {
          signal: abortController.signal,
        });
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setDepartment(data.department);
        setMatricule(data.matricule);
        setEmail(data.email);
        setRole(data.role);
        setGroup({
          label: data.group.name,
          value: data.group._id,
        });
      } catch (error) {
        console.error('Error fetching user', error);
        //redirect user to /missing route
        Navigate('/missing');
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    setErrMsg('');
  }, [email]);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  async function registerUser(ev) {
    ev.preventDefault();

    try {
      if (!validateEmail(email)) {
        setErrMsg('Please enter a valid email address');
        return;
      }

      if (userId) {
        Swal.fire({
          title: 'Updating user...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.put(`/users/${userId}`, {
          matricule,
          email,
          firstname,
          lastname,
          department,
          role,
          userrole,
          group: group.value,
        });
        Swal.fire({
          title: 'User updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          setSuccess(true);
        });
      } else {
        Swal.fire({
          title: 'Registering user...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.post('/register', {
          matricule,
          email,
          firstname,
          lastname,
          department,
          role,
          userrole,
          group: group.value,
        });
        Swal.fire({
          title: 'User registered',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          setSuccess(true);
        });
      }
    } catch (err) {
      Swal.close();
      console.error('Error registering user', err);
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setErrMsg(errorMessage);
    }
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axiosPrivate.get('/groups', { signal: abortController.signal });
        console.log('data', data);
        setAllGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups', error);
      }
    };
    fetchGroups();
  }, []);

  const groupOptions = allGroups.map((group) => {
    return {
      label: group.name,
      value: group._id,
    };
  });

  return (
    <div>
      {success ? (
        Navigate('/admin')
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">{userId ? <>Edit</> : <>Register</>}</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
              <input
                required
                type="text"
                placeholder="matricule"
                value={matricule}
                onChange={(ev) => setMatricule(ev.target.value)}
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
              <select value={role || 'user'} onChange={(ev) => setRole(ev.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <Select
                options={groupOptions}
                value={group}
                onChange={(selectedOption) => setGroup(selectedOption)}
                placeholder="Select group"
                required
                isLoading={!allGroups.length}
                loadingMessage={() => 'Loading groups...'}
              />

              {userId ? (
                <button disabled={loading} className="primary">
                  Update User
                </button>
              ) : (
                <button disabled={loading} className="primary">
                  Sign Up
                </button>
              )}

              {loading && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <TailSpin color="#3B82F6" height={50} width={50} />
                </div>
              )}

              {errMsg && <div className="text-red-500">{errMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
