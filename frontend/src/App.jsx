import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import ProductForm from './pages/ProductForm'; // Corrected import path
import OrderForm from './pages/OrderForm'; // Corrected import path
import Header from './components/Header';
import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline
import Box from '@mui/material/Box'; // Import Box for loading spinner
import AccessDenied from './pages/AccessDenied'; // Import new AccessDenied component

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
        Loading...
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <CssBaseline />
      <Header />

      <main className="flex-grow p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:id" // New route for editing products
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/edit/:id" // New route for editing orders
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrderForm />
              </ProtectedRoute>
            }
          />
          {/* Admin routes example */}
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                {/* <NewProductPage /> */}
                <div>Admin New Product Page (TODO)</div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
