import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AccountLayout from '@/layouts/AccountLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminRoute from '@/components/common/AdminRoute';
import Home from '@/pages/customer/Home';
import PlaceholderPage from '@/pages/customer/PlaceholderPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import AdminLogin from '@/pages/auth/AdminLogin';
import NotFound from '@/pages/NotFound';
import AccountOverview from '@/pages/account/Overview';
import AccountOrders from '@/pages/account/Orders';
import AccountOrderDetail from '@/pages/account/OrderDetail';
import AccountWishlist from '@/pages/account/Wishlist';
import AccountProfile from '@/pages/account/Profile';

const placeholders = [
  { path: 'shop', title: 'Shop', note: 'Full catalog with filters arrives with the product API.' },
  { path: 'categories', title: 'Categories', note: 'Category browsing arrives with the product API.' },
  { path: 'product/:slug', title: 'Product Detail', note: 'Product pages arrive with the product API.' },
  { path: 'lookbook', title: 'Lookbook', note: 'Editorial lookbook content arrives with the CMS.' },
  { path: 'about', title: 'About Bella Modest Wear' },
  { path: 'contact', title: 'Contact Us' },
  { path: 'cart', title: 'Your Cart', note: 'Cart arrives with the commerce engine.' },
  { path: 'checkout', title: 'Checkout', note: 'Checkout arrives with the commerce engine.' },
  { path: 'wishlist', title: 'Wishlist', note: 'Wishlist arrives with the commerce engine.' },
];

// /account/* — real pages get added to REAL_ACCOUNT_PAGES below as they're built;
// everything else still falls back to PlaceholderPage.
const accountPages = [
  { path: '', title: 'Account Overview', note: 'A summary of recent orders and account activity arrives with the orders API.' },
  { path: 'orders', title: 'Your Orders', note: 'Order history arrives with the orders API.' },
  { path: 'orders/:orderId', title: 'Order Detail', note: 'Order tracking arrives with the orders API.' },
  { path: 'wishlist', title: 'Your Wishlist', note: 'Synced wishlist arrives with the wishlist API.' },
  { path: 'profile', title: 'Profile', note: 'Profile editing arrives with the user API.' },
  { path: 'addresses', title: 'Addresses', note: 'Address book arrives with the address API.' },
  { path: 'security', title: 'Security', note: 'Password + session management arrives with the auth API.' },
  { path: 'notifications', title: 'Notifications', note: 'Notification preferences arrive with the user API.' },
];

// Real pages built so far for /account/* — keyed by path, same keys as accountPages above.
const REAL_ACCOUNT_PAGES = {
  '': <AccountOverview />,
  orders: <AccountOrders />,
  'orders/:orderId': <AccountOrderDetail />,
  wishlist: <AccountWishlist />,
  profile: <AccountProfile />,
};

// /admin/* — same idea: AdminLayout + AdminRoute gating are real, pages
// are placeholders until pages/admin/*.jsx are built one at a time.
// `handle.title` feeds AdminTopbar's page title via useMatches().
const adminPages = [
  { path: '', title: 'Dashboard', note: 'Live analytics arrive with the admin dashboard API.' },
  { path: 'products', title: 'Products', note: 'Product management arrives with the product API.' },
  { path: 'products/new', title: 'New Product', note: 'Product creation arrives with the product API.' },
  { path: 'products/:productId', title: 'Edit Product', note: 'Product editing arrives with the product API.' },
  { path: 'categories', title: 'Categories', note: 'Category management arrives with the product API.' },
  { path: 'inventory', title: 'Inventory', note: 'Stock management arrives with the inventory API.' },
  { path: 'orders', title: 'Orders', note: 'Order management arrives with the order API.' },
  { path: 'orders/:orderId', title: 'Order Detail', note: 'Order detail arrives with the order API.' },
  { path: 'customers', title: 'Customers', note: 'Customer records arrive with the user API.' },
  { path: 'reviews', title: 'Reviews', note: 'Review moderation arrives with the review API.' },
  { path: 'coupons', title: 'Coupons', note: 'Coupon management arrives with the coupon engine.' },
  { path: 'banners', title: 'Banners', note: 'Banner management arrives with the content API.' },
  { path: 'lookbooks', title: 'Lookbooks', note: 'Lookbook management arrives with the content API.' },
  { path: 'blog', title: 'Blog', note: 'Blog management arrives with the content API.' },
  { path: 'messages', title: 'Messages', note: 'Contact inbox arrives with the contact API.' },
  { path: 'quotations', title: 'Quotations', note: 'Custom-order requests arrive with the quotation API.' },
  { path: 'newsletter', title: 'Newsletter', note: 'Subscriber list arrives with the newsletter API.' },
  { path: 'settings', title: 'Settings', note: 'Store settings arrive with the settings API.' },
  { path: 'audit-logs', title: 'Audit Logs', note: 'Admin activity log arrives with the audit API.' },
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
  {
    path: '/account',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AccountLayout />,
        children: accountPages.map(({ path, title, note }) => ({
          ...(path === '' ? { index: true } : { path }),
          element: REAL_ACCOUNT_PAGES[path] ?? <PlaceholderPage title={title} note={note} />,
          handle: { title },
        })),
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: adminPages.map(({ path, title, note }) => ({
          ...(path === '' ? { index: true } : { path }),
          element: <PlaceholderPage title={title} note={note} />,
          handle: { title },
        })),
      },
    ],
  },
]);