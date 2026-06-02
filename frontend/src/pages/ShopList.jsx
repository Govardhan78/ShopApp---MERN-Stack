import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/shops').then(res => {
      setShops(res.data);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Shops</h1>

      {shops.length === 0 ? (
        <p className="text-gray-500">No shops yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map(shop => (
            <div
              key={shop._id}
              onClick={() => navigate(`/shops/${shop._id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {shop.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{shop.name}</h3>
                  <p className="text-xs text-gray-400">{shop.category || 'General'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{shop.description || 'No description'}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{shop.products?.length || 0} products</span>
                <span className="text-indigo-500 font-medium">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
