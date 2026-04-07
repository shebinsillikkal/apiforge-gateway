/**
 * APIForge — Route Proxy Registry
 * Author: Shebin S Illikkal | Shebinsillikkal@gmail.com
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const SERVICES = {
  '/users': process.env.USERS_SERVICE_URL || 'http://localhost:3001',
  '/products': process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
  '/orders': process.env.ORDERS_SERVICE_URL || 'http://localhost:3003',
  '/payments': process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3004',
  '/notifications': process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3005',
};

Object.entries(SERVICES).forEach(([path, target]) => {
  router.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/api${path}`]: '' },
    on: {
      error: (err, req, res) => {
        console.error(`[Proxy Error] ${path}:`, err.message);
        res.status(502).json({ error: `Service unavailable: ${path}` });
      }
    }
  }));
  console.log(`Registered proxy: /api${path} → ${target}`);
});

module.exports = router;
