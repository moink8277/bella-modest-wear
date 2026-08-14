import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from '@/routes';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}