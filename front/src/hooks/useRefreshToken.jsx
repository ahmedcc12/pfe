import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            return {
                ...prev,
                role: response.data.role,
                matricule: response.data.matricule,
                accessToken: response.data.accessToken,
                group: response.data.group,
                userId: response.data.userId
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;