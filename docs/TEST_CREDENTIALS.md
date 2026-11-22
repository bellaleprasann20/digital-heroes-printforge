
# Test Credentials

## 1. Purpose

This document describes the test accounts and environment needed to verify Digital Heroes PrintForge.

## 2. Important Security Rule

Never store real production passwords, API secrets, Razorpay secrets, or Supabase service-role keys in this document.

Use test-only accounts.

## 3. Local Test Environment

Frontend:

http://localhost:5173

Backend:

http://localhost:5000

Health check:

http://localhost:5000/api/health

## 4. Test User Accounts

Create test accounts through Supabase Auth.

| Role | Email | Password |
|---|---|---|
| Administrator | admin-test@example.com | Set locally |
| Customer | customer-test@example.com | Set locally |

These are example account identifiers, not pre-created accounts.

The administrator role must be assigned through a trusted administrative operation.

Never allow users to choose their own admin role during registration.

## 5. Supabase

Use a dedicated development Supabase project.

Required configuration:
- Supabase URL
- Public anon/publishable key
- Backend service-role key

The service-role key must remain on the backend.

## 6. Razorpay Testing

Use Razorpay test mode.

Configure test credentials through environment variables.

Test:
- Successful payment.
- Failed payment.
- Invalid signature.
- Incorrect amount.
- Repeated verification.
- Payment for another customer's order.

Use the current official Razorpay test-payment instructions for payment methods and test scenarios.

## 7. Functional Test Checklist

### Authentication
- [ ] Customer registration.
- [ ] Customer login.
- [ ] Logout.
- [ ] Password reset.
- [ ] Unauthorized API access.
- [ ] Admin role enforcement.

### Products
- [ ] Product listing.
- [ ] Product details.
- [ ] Category filtering.
- [ ] Product configuration.
- [ ] Product availability.

### Pricing
- [ ] Base pricing.
- [ ] Material pricing.
- [ ] Dimension pricing.
- [ ] Quantity discounts.
- [ ] Tax calculation.
- [ ] Invalid quote rejection.
- [ ] Expired quote rejection.

### Designer
- [ ] Add text.
- [ ] Upload image.
- [ ] Move and resize elements.
- [ ] Rotate elements.
- [ ] Save design.
- [ ] Validate printable area.
- [ ] Reject invalid artwork.

### Orders
- [ ] Create order.
- [ ] View order history.
- [ ] View order details.
- [ ] Cancel eligible order.
- [ ] Reorder previous product.
- [ ] Prevent access to another customer's order.

### Payments
- [ ] Create Razorpay order.
- [ ] Verify successful payment.
- [ ] Reject invalid signatures.
- [ ] Reject incorrect amounts.
- [ ] Prevent duplicate payment processing.

### Proofs
- [ ] Upload initial proof.
- [ ] View proof.
- [ ] Approve proof.
- [ ] Request changes.
- [ ] Create new proof version.
- [ ] Preserve older versions.
- [ ] Prevent unauthorized approval.

### Production
- [ ] Validate artwork.
- [ ] Validate resolution.
- [ ] Apply bleed.
- [ ] Generate PDF.
- [ ] Generate PNG.
- [ ] Generate variable-data files.
- [ ] Reject unapproved proofs.
- [ ] Reject unpaid orders.
- [ ] Restrict production downloads.

### Administration
- [ ] View dashboard.
- [ ] Manage products.
- [ ] Manage customers.
- [ ] Manage orders.
- [ ] Manage proofs.
- [ ] Update production status.
- [ ] Download production files.
- [ ] View reports.

### Responsive Design
- [ ] Mobile.
- [ ] Tablet.
- [ ] Desktop.

## 8. Automated Tests

Run backend tests:

```powershell
cd backend
npm test
```

Check backend syntax:

```powershell
npm run check
```

Build frontend:

```powershell
cd frontend
npm run build
```

## 9. Test Completion Criteria

The application is ready for production acceptance only when:

- All critical authentication tests pass.
- Pricing is calculated on the backend.
- Customer data isolation is verified.
- Payment verification is secure.
- Proof version history is preserved.
- Production requires payment and proof approval.
- Generated files meet print specifications.
- Admin authorization is enforced.
- Responsive layouts are verified.

## 10. Test Result Record

| Test Area | Status | Notes |
|---|---|---|
| Authentication | Pending | |
| Products | Pending | |
| Pricing | Pending | |
| Designer | Pending | |
| Orders | Pending | |
| Payments | Pending | |
| Proofs | Pending | |
| Production | Pending | |
| Administration | Pending | |
| Responsive UI | Pending | |

Do not mark a test as passed until it has actually been executed.
