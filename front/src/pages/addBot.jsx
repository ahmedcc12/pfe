import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
export default function AddBot() {
  const { botId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState('');
  const axiosPrivate = useAxiosPrivate();
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
    if (!botId) return;

    const fetchBot = async () => {
      try {
        console.log(botId);
        const { data } = await axiosPrivate.get(`/bots/${botId}`, {
          signal: abortController.signal,
        });
        setName(data.name);
        setDescription(data.description);
        if (data?.configuration?.downloadURL) setDownloadURL(data?.configuration?.downloadURL);
      } catch (error) {
        console.error('Error fetching bot', error);
        Navigate('/missing');
      }
    };
    fetchBot();
  }, [botId]);

  async function addBot(ev) {
    ev.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);
    try {
      if (botId) {
        Swal.fire({
          title: 'Updating bot...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();
        await axiosPrivate.put(`/bots/${botId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire({
          title: 'Bot updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          setSuccess(true);
        });
      } else {
        Swal.fire({
          title: 'Adding bot...',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        Swal.showLoading();

        await axiosPrivate.post('/bots', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire({
          title: 'Bot added',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(() => {
          setSuccess(true);
        });
      }
    } catch (err) {
      Swal.close();
      console.error('Error registering bot', err);
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setErrMsg(errorMessage);
    }
  }

  return (
    <div>
      {success ? (
        Navigate('/admin')
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">
              {botId ? <p>Edit bot</p> : <p>Add bot</p>}
            </h1>
            <form className="max-w-md mx-auto" onSubmit={addBot}>
              <input
                required
                type="text"
                maxLength={10}
                placeholder="name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <input
                maxLength={50}
                required
                type="text"
                placeholder="description"
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
              />
              <div className="flex items-center">
                {downloadURL && (
                  <a href={downloadURL} target="_blank" rel="noopener noreferrer" title="Download">
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                )}
                <input
                  type="file"
                  required={botId ? false : true}
                  onChange={(ev) => setFile(ev.target.files[0])}
                  className="w-full text-black text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-black rounded"
                />
              </div>
              {botId ? (
                <button disabled={loading} className="primary">
                  Update Bot
                </button>
              ) : (
                <button disabled={loading} className="primary">
                  add bot
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
