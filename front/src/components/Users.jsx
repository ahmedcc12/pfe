import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { _id } = useParams();

    const fetchUsers = async () => {
      try {
          const response = await axiosPrivate.get('/users');
          setUsers(response.data);
      } catch (err) {
          console.error(err);
          navigate('/login', { state: { from: location }, replace: true });
      }
  };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (_id) => {
      console.log('delete user', _id);
      await axiosPrivate.delete(`/users/${_id}`);
      fetchUsers();
  }

    const editUser =() => {
        console.log('edit user');
    }


    return (
        <article>
            <h2>Users List</h2>
            {users?.length ? (
  <table className="min-w-full">
    <thead className="bg-white border-b">
      <tr>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
          #
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
          Email
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
          Role
        </th>
        <th scope="col" className="text-sm font-bold text-gray-900 px-6 py-4 text-left">
        Action
        </th>
    </tr>
    </thead>
    <tbody>
    {users.map((user, index) => (
        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{index + 1}</td>

        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{user.email}</td>
        
        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">{user.role}</td>          
        
        <td className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
        
        <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={() => deleteUser(user._id)}>Delete</button>
        
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
        onClick={() => editUser(user._id)}>Edit</button>

        </td>
        </tr>
      ))}
    </tbody>
  </table>
) : <p>No users to display</p>}

        </article>
    );
};

export default Users;