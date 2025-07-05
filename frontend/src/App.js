import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginForm, RegisterForm } from './components/AuthForms';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Index from './components/index';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import Products from './components/visitors/Products';
import EditProduct from './components/EditProduct';
import ViewProduct from './components/visitors/ViewProduct';
import AddBrand from './components/brand/AddBrand';
import BrandList from './components/brand/BrandList';
import ViewBrand from './components/brand/ViewBrand';
import Brands from './components/visitors/brands';
import AddCategory from './components/Category/AddCategory';
import CategoryList from './components/Category/CategoryList';
import Category from './components/visitors/Category';
import AddSlider from './components/Slider/AddSlider';
import SliderList from './components/Slider/SliderList';
function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* UnProtected Route */}
          <Route path="/login" element={
            <>
              <Navbar />
              {!currentUser ? <LoginForm /> : <Navigate to="/dashboard" replace />}
            </>
          } />

          <Route path="/register" element={
            <>
              <Navbar />
              {!currentUser ? <RegisterForm /> : <Navigate to="/dashboard" replace />}
            </>
          } />

          <Route path="/products/view/all" element={
            <>
              <Products />
            </>
          } />
          <Route path="/products/view/:id" element={
            <>
              <ViewProduct />
            </>
          } />
          {/**Brand */}
          <Route path="/brands/view/all" element={
            <>
              <Brands />
            </>
          } />
          <Route path="/brands/product/:id" element={
            <>
              <ViewBrand />
            </>
          } />

          {/**Category */}
          <Route path="/categories/view/all" element={
            <>
              <Category />
            </>
          } />



          {/* Routes that show full page (Navbar + content) */}
          <Route path="/" element={
            <>
              <Navbar />
              <Index />
            </>
          } />

          {/* Protected Route */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/products/new" element={
            <ProtectedRoute requiredRole="admin">
              <AddProduct />
            </ProtectedRoute>
          } />

          <Route path="/products/get/all" element={
            <ProtectedRoute requiredRole="admin">
              <ProductList />
            </ProtectedRoute>
          } />

          {/* Add the edit product route */}
          <Route path="/products/:id" element={
            <ProtectedRoute requiredRole="admin">
              <EditProduct />
            </ProtectedRoute>
          } />

          {/**Brand Route */}
          <Route path="/brands/new" element={
            <ProtectedRoute requiredRole="admin">
              <AddBrand />
            </ProtectedRoute>
          } />

          <Route path="/brands/get/all" element={
            <ProtectedRoute requiredRole="admin">
              <BrandList />
            </ProtectedRoute>
          } />

          {/**Category Route */}
          <Route path="/categories/new" element={
            <ProtectedRoute requiredRole="admin">
              <AddCategory />
            </ProtectedRoute>
          } />

          <Route path="/categories/get/all" element={
            <ProtectedRoute requiredRole="admin">
              <CategoryList />
            </ProtectedRoute>
          } />

          {/**Slider Route */}
          <Route path="/admin/slider/new" element={
            <ProtectedRoute requiredRole="admin">
              <AddSlider />
            </ProtectedRoute>
          } />
          <Route path="/admin/slider/get/all" element={
            <ProtectedRoute requiredRole="admin">
              <SliderList />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;