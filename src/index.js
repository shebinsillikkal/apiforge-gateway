/**
 * APIForge Gateway — Entry Point
 * Author: Shebin S Illikkal | Shebinsillikkal@gmail.com
 */
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('./middleware/rateLimit');
const auth = require('./middleware/auth');
const logger = require('./middleware/logger');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(logger);
app.use(rateLimit);

// Health check (no auth)
app.get('/health', (req, res) => res.json({ status: 'ok', gateway: 'APIForge v1.0' }));

// API routes
app.use('/api', auth, routes);

app.use((err, req, res, next) => {
  console.error('[Gateway Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Gateway error' });
});

app.listen(PORT, () => console.log(`APIForge Gateway running on port ${PORT}`));
module.exports = app;
