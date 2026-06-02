import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ShopDetail() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/shops/${id}`).then(res => {
      setShop(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) return <p className="text-center mt-10 text-gray-500">Shop not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
            {shop.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{shop.name}</h1>
            <p className="text-sm text-gray-400">{shop.category || 'General'} · {shop.address || 'No address'}</p>
          </div>
        </div>
        {shop.description && (
          <p className="mt-4 text-sm text-gray-600">{shop.description}</p>
        )}
        {shop.phone && (
          <p className="mt-2 text-sm text-gray-500">📞 {shop.phone}</p>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Products ({shop.products?.length || 0})</h2>

      {shop.products?.length === 0 ? (
        <p className="text-gray-400 text-sm">No products in this shop yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shop.products.map(product => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <span className="text-indigo-600 font-semibold text-sm">₹{product.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description || 'No description'}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-0.5 rounded">{product.category || 'General'}</span>
                <span>Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
