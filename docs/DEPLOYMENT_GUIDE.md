
# Deployment Guide

## 1. Overview

PrintForge uses separate frontend, backend, database, and storage deployments.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Node-compatible cloud hosting |
| Database | Supabase |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Payment | Razorpay |

## 2. Prerequisites

Install:
- Node.js 20 or later
- npm
- Git

Required accounts:
- GitHub
- Vercel
- Supabase
- Razorpay
- Backend hosting provider

## 3. Local Setup

Clone the repository.

Install frontend dependencies:

```powershell
cd frontend
npm install
```

Install backend dependencies:

```powershell
cd ../backend
npm install
```

## 4. Backend Environment

Create:

backend/.env

Configure:

```env
NODE_ENV=development
PORT=5000
APP_NAME=Digital Heroes PrintForge
CLIENT_URL=http://localhost:5173

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
STORAGE_BUCKET=printforge-files

RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

Never commit this file.

## 5. Frontend Environment

Create:

frontend/.env

Configure:

```env
VITE_APP_NAME=Digital Heroes PrintForge
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api

VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
```

Only public credentials belong in frontend variables.

## 6. Supabase Setup

1. Create a Supabase project.
2. Configure authentication.
3. Apply database migrations in order.
4. Apply seed data.
5. Create private storage buckets.
6. Configure storage access policies.
7. Configure authentication redirect URLs.
8. Create the initial administrator securely.

## 7. Local Development

Start backend:

```powershell
cd backend
npm run dev
```

Start frontend in another terminal:

```powershell
cd frontend
npm run dev
```

Frontend:

http://localhost:5173

Backend:

http://localhost:5000

Health endpoint:

http://localhost:5000/api/health

## 8. Backend Deployment

1. Push source code to GitHub.
2. Create a Node.js web service.
3. Configure the backend root directory.
4. Install dependencies using npm install.
5. Set the start command to npm start.
6. Configure environment variables.
7. Deploy.
8. Verify the health endpoint.

The hosting environment must support the native dependencies required by Sharp.

Production generation workers may require a separate worker process.

## 9. Frontend Deployment

1. Import the repository into Vercel.
2. Set the frontend root directory.
3. Configure build command:

npm run build

4. Configure output directory:

dist

5. Add frontend environment variables.
6. Deploy.
7. Configure SPA route fallback behavior.
8. Verify the deployed application.

## 10. Razorpay Setup

1. Create a Razorpay account.
2. Start with test mode.
3. Configure key ID and secret on the backend.
4. Configure webhook endpoint.
5. Verify webhook signatures.
6. Test successful and failed payments.
7. Switch to live credentials only after payment testing.

## 11. Production Security Checklist

- HTTPS enabled.
- Environment variables configured.
- Service-role key protected.
- RLS enabled.
- Private storage configured.
- CORS restricted.
- Rate limiting enabled.
- Authentication verified.
- Admin authorization verified.
- Payment verification tested.
- Production approval gate tested.
- Backups enabled.
- Logs monitored.

## 12. Deployment Validation

Verify:

- Public pages load.
- Registration works.
- Login works.
- Product data loads.
- Pricing calculations work.
- Customer ownership is enforced.
- Orders are created correctly.
- Payments are verified.
- Proof versions are preserved.
- Production files generate correctly.
- Admin routes are protected.
- Mobile layouts work.

## 13. Rollback

Keep the previous stable deployment available.

For failed releases:
1. Stop further rollout.
2. Review logs.
3. Roll back frontend or backend.
4. Restore database from backup if required.
5. Verify application health.

Database migrations should be backward-compatible where possible.
