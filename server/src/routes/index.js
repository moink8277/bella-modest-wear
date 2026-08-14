const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use('/health', healthRoutes);

// Phase 3+: router.use('/auth', authRoutes);
// Phase 5+: router.use('/products', productRoutes);
// Phase 5+: router.use('/categories', categoryRoutes);

module.exports = router;
