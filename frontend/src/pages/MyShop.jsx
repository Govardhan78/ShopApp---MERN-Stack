import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyShop() {
  const [shop, setShop] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', address: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/shops/my')
      .then(res => {
        setShop(res.data);
        setForm(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      if (shop) {
        const res = await api.put(`/shops/${shop._id}`, form);
        setShop(res.data);
        setSuccess('Shop updated successfully');
      } else {
        const res = await api.post('/shops', form);
        setShop(res.data);
        setSuccess('Shop created successfully');
      }
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{shop ? 'My Shop' : 'Create Shop'}</h1>
        {shop && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
          >
            Edit Shop
          </button>
        )}
      </div>

      {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      {shop && !isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {shop.name[0]}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{shop.name}</h2>
              <p className="text-sm text-gray-400">{shop.category || 'No category'}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{shop.description || 'No description'}</p>
          <p className="text-sm text-gray-500">📍 {shop.address || 'No address'}</p>
          <p className="text-sm text-gray-500">📞 {shop.phone || 'No phone'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {[
            { name: 'name', label: 'Shop Name', placeholder: 'My Awesome Shop', required: true },
            { name: 'description', label: 'Description', placeholder: 'What do you sell?' },
            { name: 'category', label: 'Category', placeholder: 'Electronics, Clothing...' },
            { name: 'address', label: 'Address', placeholder: 'Shop address' },
            { name: 'phone', label: 'Phone', placeholder: '+91 9876543210' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : shop ? 'Update Shop' : 'Create Shop'}
            </button>
            {shop && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
