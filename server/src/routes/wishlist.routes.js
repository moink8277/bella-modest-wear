const express = require('express');
const wishlistController = require('../controllers/wishlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Every wishlist route requires a logged-in user. Unlike cart, this doesn't
// mean guests can't wishlist at all — guests use a localStorage-only
// wishlist entirely on the client side (WishlistContext.jsx), and these
// endpoints only come into play once they're authenticated (including the
// merge call right after login).
router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/items', wishlistController.addItem);
router.delete('/items/:productId', wishlistController.removeItem);
router.post('/merge', wishlistController.mergeWishlist);

module.exports = router;