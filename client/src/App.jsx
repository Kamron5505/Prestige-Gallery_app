import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Orders = lazy(() => import('./pages/Orders'));
const Admin = lazy(() => import('./pages/Admin'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contacts = lazy(() => import('./pages/Contacts'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/favorites" element={<Favorites />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
