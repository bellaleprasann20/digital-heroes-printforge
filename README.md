
# Digital Heroes PrintForge

<p align="center">
  <strong>A Complete Web-to-Print Ordering & Production Management Platform</strong>
</p>

<p align="center">
  React · Tailwind CSS · Node.js · Express · Supabase · Razorpay
</p>

---

## Overview

**Digital Heroes PrintForge** is a modern web-to-print platform designed to simplify custom printing orders, artwork design, pricing, proof approval, and production management.

Customers can browse printing products, customize dimensions and materials, upload artwork, create designs, receive instant quotations, pay online, approve digital proofs, and track their orders.

Administrators can manage products, customers, orders, artwork, proof versions, production workflows, and business analytics through a centralized dashboard.

## Product Divisions

The platform supports six printing divisions:

| Division | Description |
|---|---|
| Labels & Stickers | Custom labels, stickers, and adhesive graphics |
| Race & Event Numbers | Race bibs and event identification numbers |
| MTB Boards | Mountain bike number plates |
| Stamps | Custom rubber stamps |
| Trophies | Personalized trophies and awards |
| Laser-cut Work | Custom laser-cut products and components |

## Features

### Customer Features

- Browse products and categories.
- Search and filter products.
- Configure product dimensions.
- Select materials and additional options.
- Calculate product prices dynamically.
- Create custom designs in the browser.
- Upload artwork files.
- Save and manage designs.
- Add products to cart.
- Place orders securely.
- Pay through Razorpay.
- View and approve digital proofs.
- Request artwork revisions.
- Track order progress.
- View order history.
- Reorder previous products.
- Access invoices and receipts.

### Online Designer

- Fabric.js-based design canvas.
- Add and edit text.
- Upload images and logos.
- Move, resize, and rotate objects.
- Change fonts and colors.
- Manage design layers.
- Preview printable areas.
- Save designs.
- Validate artwork boundaries.

### Pricing Engine

- Product-specific pricing.
- Dimension-based calculations.
- Material adjustments.
- Additional option charges.
- Quantity-based discounts.
- Tax calculations.
- Server-authoritative quotations.

### Production Management

- Artwork validation.
- Digital proof generation.
- Proof version management.
- Customer approval workflow.
- Print-ready PDF generation.
- High-resolution PNG generation.
- Bleed and safe-margin handling.
- Image resolution validation.
- CSV variable-data printing.
- Individual output generation.
- Production file management.

### Administrator Features

- Admin dashboard.
- Customer management.
- Product management.
- Category management.
- Product option management.
- Order management.
- Proof management.
- Production queue.
- Production status updates.
- Print-ready file downloads.
- Analytics and reports.
- Order activity history.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build |
| Tailwind CSS v4 | Styling |
| React Router | Routing |
| Framer Motion | Animations |
| Fabric.js | Design editor |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| Joi | Request validation |
| Multer | File uploads |
| Sharp | Image processing |
| pdf-lib | PDF generation |
| PapaParse | CSV processing |
| Fontkit | Font measurement and embedding |

### Database & Services

| Technology | Purpose |
|---|---|
| Supabase PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | File storage |
| Razorpay | Online payments |
| Vercel | Frontend deployment |
| Node-compatible cloud hosting | Backend deployment |

---

## Project Structure

```text
digital-heroes-printforge/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   ├── checkout/
│       │   ├── common/
│       │   ├── customer/
│       │   ├── designer/
│       │   ├── home/
│       │   ├── layout/
│       │   └── proofs/
│       │
│       ├── config/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── customer/
│       │   └── public/
│       │
│       ├── routes/
│       ├── services/
│       ├── styles/
│       └── utils/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── engines/
│   │   │   ├── designer/
│   │   │   ├── print/
│   │   │   └── variableData/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── storage/
│   │   └── temp/
│   │
│   ├── tests/
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── PRICING_LOGIC.md
│   ├── PRINT_GENERATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── TEST_CREDENTIALS.md
│
├── .gitignore
└── README.md
```

---

## User Roles

### Visitor
- Browse products.
- Explore categories.
- View product information.
- Register and log in.

### Customer
- Create and manage designs.
- Configure products.
- Place and pay for orders.
- Approve proofs.
- Request revisions.
- Track orders.
- Reorder products.

### Administrator
- Manage customers and products.
- Manage orders and proofs.
- Control production workflows.
- Generate and download production files.
- View analytics and reports.

---

## Order Workflow

```text
Product Selection
       |
       v
Product Configuration
       |
       v
Price Quotation
       |
       v
Cart & Checkout
       |
       v
Payment
       |
       v
Artwork Submission
       |
       v
Proof Generation
       |
       v
Customer Approval
       |
       v
Production
       |
       v
Completed
```

Production is permitted only when the required payment and proof-approval conditions are satisfied.

---

## Getting Started

### Prerequisites

Install the following:

- Node.js 20 or later
- npm
- Git
- Supabase account
- Razorpay account

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd digital-heroes-printforge
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure Backend Environment

Create `backend/.env` using the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure:

```env
NODE_ENV=development
PORT=5000
APP_NAME=Digital Heroes PrintForge
CLIENT_URL=http://localhost:5173

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
STORAGE_BUCKET=printforge-files

RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

### 5. Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_APP_NAME=Digital Heroes PrintForge
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api

VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
```

Never expose the Supabase service-role key or Razorpay secret in frontend variables.

### 6. Configure Supabase

1. Create a Supabase project.
2. Configure Supabase Authentication.
3. Apply database migrations in order.
4. Apply `seed.sql`.
5. Create the required storage buckets.
6. Configure storage policies.
7. Configure authentication redirect URLs.
8. Create the administrator account securely.

### 7. Start Backend

```bash
cd backend
npm run dev
```

Backend:

http://localhost:5000

Health endpoint:

http://localhost:5000/api/health

### 8. Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Frontend:

http://localhost:5173

---

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Backend Syntax Check

```bash
npm run check
```

### Frontend Production Build

```bash
cd frontend
npm run build
```

### Important Testing Areas

- Authentication and authorization.
- Product browsing and configuration.
- Pricing and discount calculations.
- Design editor and print-area validation.
- Order creation and ownership.
- Razorpay payment verification.
- Proof versioning and approval.
- PDF and PNG generation.
- CSV variable-data processing.
- Production access restrictions.
- Responsive design.

---

## API Overview

Base URL:

```text
http://localhost:5000/api
```

| Module | Endpoint |
|---|---|
| Authentication | `/auth` |
| Products | `/products` |
| Pricing | `/pricing` |
| Designs | `/designs` |
| Orders | `/orders` |
| Payments | `/payments` |
| Proofs | `/proofs` |
| Production | `/production` |
| Users | `/users` |
| Analytics | `/analytics` |

See [API Documentation](docs/API_DOCUMENTATION.md) for endpoint details.

---

## Security

PrintForge follows these security principles:

- Supabase Row Level Security.
- Secure authentication and authorization.
- Customer data isolation.
- Private file storage.
- Backend price calculation.
- Server-side payment verification.
- Input validation.
- File validation.
- API rate limiting.
- Production approval enforcement.
- Protected environment variables.

---

## Documentation

Detailed project documentation is available in the `docs/` directory.

| Document | Description |
|---|---|
| [Project Overview](docs/PROJECT_OVERVIEW.md) | Project goals and features |
| [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Technical architecture |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Database tables and relationships |
| [API Documentation](docs/API_DOCUMENTATION.md) | Backend API endpoints |
| [Pricing Logic](docs/PRICING_LOGIC.md) | Pricing calculations |
| [Print Generation](docs/PRINT_GENERATION.md) | Print processing workflow |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Deployment instructions |
| [Test Credentials](docs/TEST_CREDENTIALS.md) | Test setup and checklist |

---

## Deployment

### Frontend
Deploy the React application using Vercel.

### Backend
Deploy the Express application to a Node-compatible hosting provider that supports the required image-processing dependencies.

### Database
Use Supabase PostgreSQL and private Supabase Storage buckets.

### Payments
Use Razorpay test mode during development. Enable live payments only after completing payment verification and security testing.

Refer to [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md).

---

## Development Status

The initial project structure, core implementation files, and documentation are being assembled.

Features must be integrated and tested before being considered production-ready.

| Module | Status |
|---|---|
| Project structure | In progress |
| Frontend UI | In progress |
| Backend API | In progress |
| Supabase database | In progress |
| Authentication | Integration pending |
| Product management | Integration pending |
| Pricing engine | Integration pending |
| Design editor | Integration pending |
| Orders | Integration pending |
| Razorpay payments | Integration pending |
| Proof management | Integration pending |
| Print generation | Integration pending |
| Variable-data printing | Integration pending |
| Admin dashboard | Integration pending |
| Automated testing | Pending |
| Deployment | Pending |

---

## License

All rights reserved.

This project is developed for Digital Heroes PrintForge.

Unauthorized copying, redistribution, or commercial use is prohibited without permission.
