/**
 * APIForge — Request Logger
 * Author: Shebin S Illikkal | Shebinsillikkal@gmail.com
 */
module.exports = function logger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    console.log(`${color}[${new Date().toISOString()}] ${method} ${url} ${status} ${duration}ms[0m`);
  });

  next();
};
