import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import Home from '@/pages/customer/Home';
import PlaceholderPage from '@/pages/customer/PlaceholderPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import AdminLogin from '@/pages/auth/AdminLogin';
import NotFound from '@/pages/NotFound';

const placeholders = [
  { path: 'shop', title: 'Shop', note: 'Full catalog with filters arrives with the product API.' },
  { path: 'categories', title: 'Categories', note: 'Category browsing arrives with the product API.' },
  { path: 'product/:slug', title: 'Product Detail', note: 'Product pages arrive with the product API.' },
  { path: 'lookbook', title: 'Lookbook', note: 'Editorial lookbook content arrives with the CMS.' },
  { path: 'about', title: 'About Bella Modest Wear' },
  { path: 'contact', title: 'Contact Us' },
  { path: 'account', title: 'My Account', note: 'Requires sign in — arrives with authentication.' },
  { path: 'cart', title: 'Your Cart', note: 'Cart arrives with the commerce engine.' },
  { path: 'checkout', title: 'Checkout', note: 'Checkout arrives with the commerce engine.' },
  { path: 'wishlist', title: 'Wishlist', note: 'Wishlist arrives with the commerce engine.' },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      ...placeholders.map(({ path, title, note }) => ({
        path,
        element: <PlaceholderPage title={title} note={note} />,
      })),
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'verify-email', element: <VerifyEmail /> },
    ],
  },
  {
    path: '/secure-panel',
    element: <AdminLogin />,
  },
]);