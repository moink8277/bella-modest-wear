const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { testConnection } = require('../config/db');

const router = express.Router();

// GET /api/health
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const db = await testConnection();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: db.connected ? 'connected' : 'disconnected',
          databaseError: db.connected ? undefined : db.error,
        },
        'Bella Modest Wear API is healthy'
      )
    );
  })
);

module.exports = router;
