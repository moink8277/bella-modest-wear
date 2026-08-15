const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Phase 5+: router.use('/products', productRoutes);
// Phase 5+: router.use('/categories', categoryRoutes);

module.exports = router;