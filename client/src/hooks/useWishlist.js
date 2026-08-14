// Thin re-export so existing imports (@/hooks/useWishlist) keep working
// while the real implementation lives in context/WishlistContext.jsx.
export { useWishlistContext as useWishlist } from '@/context/WishlistContext';