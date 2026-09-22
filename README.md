# BrewPoint

BrewPoint is a multi-tenant cloud POS and back-office platform built for coffee shops.

## Current product model

- 30-day free trial
- Starter — ₱799/month
- Pro — ₱1,199/month
- Business — ₱1,999/month
- Cash and GCash checkout
- Recipe-based ingredient deduction
- Inventory, costing, expenses, reports, customers, promos, staff, branches
- Tenant subscription controls
- Platform-owner landlord console

## Tech stack

- React + Vite
- Node.js + Express
- PostgreSQL
- Railway

## Local development

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and `JWT_SECRET`.
3. Run `npm install`.
4. Run `npm run dev`.

The server automatically applies idempotent schema migrations at startup.

## Security

Secrets are never committed. `.env`, private keys, database dumps, Railway state and build artifacts are excluded by `.gitignore`.

## Production

Railway builds the Vite frontend and serves it from the Express server. The application expects `DATABASE_URL` and `JWT_SECRET`.
