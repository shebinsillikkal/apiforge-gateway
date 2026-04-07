/**
 * APIForge — Redis Rate Limiter Middleware
 * Author: Shebin S Illikkal | Shebinsillikkal@gmail.com
 */
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const LIMITS = {
  free:       { rpm: 60,   burst: 10 },
  pro:        { rpm: 1000, burst: 50 },
  enterprise: { rpm: 10000, burst: 200 },
};

async function rateLimit(req, res, next) {
  const tier  = req.user?.tier || 'free';
  const key   = `rl:${tier}:${req.user?.id || req.ip}`;
  const limit = LIMITS[tier];
  const now   = Date.now();
  const window = 60000; // 1 minute

  try {
    const pipe = client.multi();
    pipe.zRemRangeByScore(key, 0, now - window);
    pipe.zCard(key);
    pipe.zAdd(key, { score: now, value: String(now) });
    pipe.expire(key, 120);
    const results = await pipe.exec();
    const count = results[1];

    res.set({
      'X-RateLimit-Limit':     limit.rpm,
      'X-RateLimit-Remaining': Math.max(0, limit.rpm - count),
      'X-RateLimit-Reset':     Math.ceil((now + window) / 1000),
    });

    if (count > limit.rpm) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil(window / 1000),
        tier, limit: limit.rpm
      });
    }
    next();
  } catch (err) {
    console.error('Rate limit error:', err);
    next(); // Fail open — don't block requests if Redis is down
  }
}

module.exports = rateLimit;
