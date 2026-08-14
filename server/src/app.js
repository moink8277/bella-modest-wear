const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// ── Security ────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// ── General rate limit (auth routes get a stricter limiter in Phase 3) ──
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  })
);

// ── Parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(compression());

if (!env.isProduction) {
  app.use(morgan('dev'));
}

// ── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bella Modest Wear API', version: '1.0.0' });
});

app.use('/api', routes);

// ── 404 + error handling (must be last) ──────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
