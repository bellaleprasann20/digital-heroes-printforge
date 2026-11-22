
# Digital Heroes PrintForge

## 1. Project Overview

Digital Heroes PrintForge is a web-to-print platform that allows customers to customize, design, order, and track professionally printed products.

The platform combines product configuration, browser-based design editing, automated pricing, online payments, digital proof approval, and production file generation.

## 2. Project Objectives

- Provide an online storefront for custom printing products.
- Support browser-based artwork customization.
- Allow customers to upload their own artwork.
- Calculate product prices dynamically.
- Support secure online payments.
- Generate digital proofs and manage approval versions.
- Automate print-ready PDF and PNG generation.
- Support CSV-based variable-data printing.
- Provide customers with order tracking and reorder functionality.
- Provide administrators with production and business management tools.

## 3. Product Divisions

The platform supports six divisions:

1. Labels & Stickers
2. Race & Event Numbers
3. MTB Boards
4. Stamps
5. Trophies
6. Laser-cut Work

Products, materials, dimensions, pricing, and print specifications are managed through the database.

## 4. User Roles

### Visitor
- Browse products and categories.
- View the gallery.
- View product specifications.
- Register or log in.

### Customer
- Manage profile and addresses.
- Configure products.
- Create and save designs.
- Upload artwork.
- Add products to cart.
- Place orders.
- Complete payments.
- Review and approve proofs.
- Request artwork revisions.
- Track order progress.
- Download permitted documents.
- Reorder previous products.

### Administrator
- Manage customers.
- Manage products and categories.
- Configure pricing options.
- Manage templates.
- Review orders.
- Upload and manage proofs.
- Monitor production.
- Download print-ready files.
- Update order statuses.
- View analytics and reports.

## 5. Main Features

### Product Catalogue
- Six product divisions.
- Product search and filtering.
- Product details and specifications.
- Material and size configuration.

### Online Designer
- Fabric.js-based design canvas.
- Text and image elements.
- Font, size, color, and alignment controls.
- Object positioning and rotation.
- Layer management.
- Design saving.
- Print-area validation.

### Pricing Engine
- Product-specific base pricing.
- Material adjustments.
- Dimension-based pricing.
- Quantity-based discounts.
- Additional options.
- Tax calculation.
- Server-authoritative quotations.

### Artwork and Proofing
- Customer artwork uploads.
- Artwork validation.
- Proof previews.
- Immutable proof versions.
- Approval and revision requests.
- Approval history.

### Production
- High-resolution PDF generation.
- PNG generation.
- Bleed and safe-margin handling.
- Resolution validation.
- CSV variable-data processing.
- Individual output generation.
- Production file management.

### Customer Dashboard
- Order history.
- Order details.
- Active proofs.
- Saved designs.
- Reordering.
- Profile management.
- Invoice and receipt access.

### Administration
- Customer management.
- Product management.
- Order pipeline.
- Proof management.
- Production queue.
- Analytics and reporting.
- Archive management.

## 6. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Animation | Framer Motion |
| Design Editor | Fabric.js |
| Backend | Node.js + Express |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Payments | Razorpay |
| PDF Generation | pdf-lib |
| Image Processing | Sharp |
| CSV Processing | PapaParse |
| Testing | Node.js Test Runner + Supertest |
| Frontend Hosting | Vercel |
| Backend Hosting | Node-compatible cloud hosting |

## 7. Architecture

The frontend communicates with the Express API for privileged business operations.

Supabase provides authentication, PostgreSQL, and private file storage.

The backend verifies authentication tokens and handles pricing, orders, payment verification, proof workflows, and production generation.

## 8. Order Workflow

Quote → Order → Artwork → Proof → Production → Completed

Payment and proof approval are separate requirements that must be satisfied before production begins.

## 9. Currency and Localization

- Default currency: INR
- Locale: en-IN
- Time zone: Asia/Kolkata
- Default tax configuration: 18%, subject to product and applicable tax rules.

## 10. Security Principles

- HTTPS for deployed applications.
- Supabase Row Level Security.
- Server-side authorization.
- Private file storage.
- Secure payment signature verification.
- Server-side price calculations.
- Customer ownership validation.
- Production access restricted to administrators.
- No secrets committed to source control.

## 11. Project Status

The project structure and initial implementation are being assembled.

Database migrations, service integrations, API contracts, security policies, and end-to-end testing must be completed before production deployment.
