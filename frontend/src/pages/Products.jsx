import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name: '', description: '', price: '', stock: '', category: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = () => {
    api.get('/products/my').then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        setSuccess('Product updated');
      } else {
        await api.post('/products', form);
        setSuccess('Product added');
      }
      setForm(emptyForm);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{editId ? 'Edit Product' : 'Add Product'}</h1>

      {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Product name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Electronics, Clothing..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="0.00"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Product description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60">
            {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">My Products ({products.length})</h2>

      {products.length === 0 ? (
        <p className="text-gray-400 text-sm">No products yet. Add your first product above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <span className="text-indigo-600 font-semibold text-sm">₹{product.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{product.category || 'General'}</span>
                  <span>Stock: {product.stock}</span>
                </div>
                <button onClick={() => handleEdit(product)}
                  className="text-xs text-indigo-600 hover:underline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
