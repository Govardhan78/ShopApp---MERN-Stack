import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ShopOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/chat/owners').then(res => {
      setOwners(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Shop Owners</h1>

      {owners.length === 0 ? (
        <p className="text-gray-400 text-sm">No shop owners registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners.map(owner => (
            <div key={owner._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {owner.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{owner.name}</p>
                  <p className="text-xs text-gray-400">{owner.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/admin/chat?userId=${owner._id}&name=${owner.name}`)}
                className="w-full text-sm bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
