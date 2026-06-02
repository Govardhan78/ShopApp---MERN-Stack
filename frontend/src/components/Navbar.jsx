import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">ShopApp</Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/shops" className="text-sm text-gray-600 hover:text-indigo-600">Shops</Link>
              <Link to="/my-shop" className="text-sm text-gray-600 hover:text-indigo-600">My Shop</Link>
              <Link to="/products" className="text-sm text-gray-600 hover:text-indigo-600">Products</Link>
              <Link to="/chat" className="text-sm text-gray-600 hover:text-indigo-600">Chat</Link>
              <span className="text-sm text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
