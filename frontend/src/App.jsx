import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ShopList from './pages/ShopList';
import ShopDetail from './pages/ShopDetail';
import MyShop from './pages/MyShop';
import Products from './pages/Products';
import Chat from './pages/Chat';
import AdminLayout from './pages/Admin/AdminLayout';
import ShopOwners from './pages/Admin/ShopOwners';
import AdminChat from './pages/Admin/AdminChat';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User routes with Navbar */}
      <Route path="/" element={
        <PrivateRoute>
          <div>
            <Navbar />
            <Navigate to="/shops" />
          </div>
        </PrivateRoute>
      } />

      <Route path="/shops" element={
        <PrivateRoute>
          <div><Navbar /><ShopList /></div>
        </PrivateRoute>
      } />

      <Route path="/shops/:id" element={
        <PrivateRoute>
          <div><Navbar /><ShopDetail /></div>
        </PrivateRoute>
      } />

      <Route path="/my-shop" element={
        <PrivateRoute>
          <div><Navbar /><MyShop /></div>
        </PrivateRoute>
      } />

      <Route path="/products" element={
        <PrivateRoute>
          <div><Navbar /><Products /></div>
        </PrivateRoute>
      } />

      <Route path="/chat" element={
        <PrivateRoute>
          <div><Navbar /><Chat /></div>
        </PrivateRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<ShopOwners />} />
        <Route path="chat" element={<AdminChat />} />
      </Route>

      <Route path="*" element={<Navigate to="/shops" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
