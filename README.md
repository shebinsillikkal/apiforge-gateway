# APIForge — Enterprise API Gateway

> Central API gateway handling auth, routing, rate limiting and analytics for a microservices architecture — 500K+ daily API calls, 99.98% uptime.

## The Problem
A product with multiple backend services where each one was doing its own auth and rate limiting inconsistently. Built this central gateway so all requests go through one place — clean, auditable, consistent.

## Features
- 🔐 JWT + OAuth2 authentication with refresh token rotation
- 🚦 Redis-based rate limiting per user/IP/endpoint
- 🔀 Smart request routing to microservices
- 📊 Real-time API usage analytics + latency tracking
- 📝 Auto-generated Swagger docs
- 🔔 Alerting when error rates spike

## Stack
```
Node.js | Express | Redis | JWT | Nginx | PostgreSQL | Prometheus
```

**Built by Shebin S Illikkal** — Shebinsillikkal@gmail.com
