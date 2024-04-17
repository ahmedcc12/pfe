import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Select from 'react-select';
import { TailSpin } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Swal from 'sweetalert2';

export default function CreateGroup() {
  const { groupId } = useParams();
  const [name, setName] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const userrole = auth.user.role;
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();
  const [allBots, setAllBots] = useState([]);
  const [selectedBots, setSelectedBots] = useState([]);
  const [botsLoading, setBotsLoading] = useState(false);
  const abortController = new AbortController();

  useEffect(() => {
    return () => {
      abortController.abort();
      Swal.close();
    };
  }, []);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroup = async () => {
      try {
        setBotsLoading(true);
        console.log('fetching group with id ', groupId);
        const { data } = await axiosPrivate.get(`/groups/${groupId}`, {
          signal: abortController.signal,
        });
        setName(data.name);
        const bots = await axiosPrivate.get(`/groups/${groupId}/bots`, {
          signal: abortController.signal,
        });
        setSelectedBots(
          bots?.data?.bots?.map((bot) => {
            return {
              label: bot.name,
              value: bot._id,
            };
          })
        );
        setBotsLoading(false);
      } catch (error) {
        console.error('Error fetching group', error);
        Navigate('/missing');
      }
    };
    fetchGroup();
  }, [groupId]);

  async function createGroup(ev) {
    ev.preventDefault();
    setErrMsg('');

    if (groupId) {
      try {
        Swal.fire({
          title: 'Updating group...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        const { data } = await axiosPrivate.put(`/groups/${groupId}`, {
          name: name,
          botIds: selectedBots.map((bot) => bot.value),
        });
        Swal.fire({
          title: 'Group updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          setSuccess(true);
        });
      } catch (error) {
        Swal.close();
        console.error('Error updating group', error);
        setErrMsg(error.response.data.message);
      }
      return;
    }

    try {
      Swal.fire({
        title: 'Creating group...',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      Swal.showLoading();
      const { data } = await axiosPrivate.post('/groups', {
        name: name,
        botIds: selectedBots.map((bot) => bot.value),
      });
      Swal.fire({
        title: 'Group created',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then(() => {
        setSuccess(true);
      });
    } catch (error) {
      Swal.close();
      console.error('Error creating group', error);
      setErrMsg(error.response.data.message);
    }
  }

  useEffect(() => {
    const fetchBots = async () => {
      setBotsLoading(true);
      try {
        const { data } = await axiosPrivate.get('/bots', { signal: abortController.signal });
        setAllBots(data.bots);
        setBotsLoading(false);
      } catch (error) {
        console.error('Error fetching bots', error);
        setBotsLoading(false);
      }
    };
    fetchBots();
  }, []);

  const options = allBots?.map((bot) => ({
    label: bot.name,
    value: bot._id,
  }));

  const handleChange = (selectedOptions) => {
    setSelectedBots(selectedOptions);
  };

  return (
    <div>
      {success ? (
        Navigate('/admin')
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">{groupId ? <>Edit</> : <>Create</>}</h1>
            <form className="max-w-md mx-auto" onSubmit={createGroup}>
              <input
                required
                type="text"
                placeholder="name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                maxLength={50}
              />
              <MultiSelect
                options={options}
                value={selectedBots}
                onChange={handleChange}
                labelledBy="Select"
                isLoading={botsLoading}
              />
              {groupId ? (
                <button disabled={loading} className="primary">
                  Update Group
                </button>
              ) : (
                <button disabled={loading} className="primary">
                  Create Group
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
