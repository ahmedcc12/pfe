import { useState , useEffect} from "react";
import axios from "../api/axios.jsx";

const   Users = () => {
    const [ users, setUsers ] = useState();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axios.get("/users", { signal: controller.signal });
                if (isMounted) {
                    console.log(response.data);
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('Error getting users:', error);
            }
        };
        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    return (
        <div>
            <article>
                <h1>Users list :    </h1>
                {users?.length
                ?(
                    <ul>
                        {users.map((user,i) => (
                            <li key={i}>{user.name}</li>
                        ))}
                    </ul>
                ):(
                    <p>No users</p>
                )
            }         
            <br />  
            </article>
        </div>
    
    )
};

export default Users;