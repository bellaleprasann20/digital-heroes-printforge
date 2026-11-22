
# API Documentation

## 1. Base URL

Development:

http://localhost:5000/api

Production:

https://YOUR_BACKEND_DOMAIN/api

## 2. Authentication

Protected endpoints require:

Authorization: Bearer SUPABASE_ACCESS_TOKEN

Content-Type: application/json

The backend validates the Supabase access token.

## 3. Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register customer |
| POST | /auth/login | Authenticate customer |
| POST | /auth/logout | Logout |
| GET | /auth/me | Current user |
| POST | /auth/forgot-password | Password reset |

Note: If Supabase Auth is used directly by the frontend, registration and login can be handled by Supabase while the backend exposes profile and verification endpoints.

## 4. Product Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /products | Public |
| GET | /products/:id | Public |
| POST | /products | Admin |
| PUT | /products/:id | Admin |
| DELETE | /products/:id | Admin |

## 5. Pricing Routes

| Method | Endpoint | Access |
|---|---|---|
| POST | /pricing/quote | Customer |
| POST | /pricing/validate | Customer |

Example quote request:

```json
{
  "productId": "PRODUCT_UUID",
  "quantity": 100,
  "width": 100,
  "height": 50,
  "unit": "mm",
  "material": "vinyl",
  "options": {}
}
```

The backend must calculate the final price.

The frontend must not submit a trusted total amount.

## 6. Design Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /designs | Customer |
| GET | /designs/:id | Owner/Admin |
| POST | /designs | Customer |
| PUT | /designs/:id | Owner |
| DELETE | /designs/:id | Owner |
| POST | /designs/:id/duplicate | Owner |

## 7. Order Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /orders | Customer/Admin |
| GET | /orders/:id | Owner/Admin |
| POST | /orders | Customer |
| POST | /orders/:id/cancel | Owner/Admin |
| POST | /orders/:id/reorder | Owner |

Order creation must validate:
- Customer ownership.
- Quote validity.
- Product availability.
- Quantity.
- Product configuration.
- Server-calculated totals.

## 8. Payment Routes

| Method | Endpoint | Access |
|---|---|---|
| POST | /payments/create-order | Customer |
| POST | /payments/verify | Customer |
| GET | /payments/status/:orderId | Owner/Admin |

Payment verification must validate:
- Razorpay signature.
- Razorpay order association.
- Payment amount.
- Currency.
- Order ownership.
- Idempotency.

Never trust a successful frontend payment callback alone.

## 9. Proof Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /proofs | Customer |
| GET | /proofs/:orderId/versions | Owner/Admin |
| POST | /proofs/:id/approve | Owner |
| POST | /proofs/:id/request-changes | Owner |

Proof approval must be associated with a specific version.

## 10. Production Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /production/queue | Admin |
| PATCH | /production/orders/:id/stage | Admin |
| GET | /production/files/:id | Admin |
| POST | /production/orders/:id/generate | Admin |

Production generation requires:
- Paid order.
- Approved latest proof.
- Valid artwork.
- Valid print dimensions.
- Sufficient image resolution.

## 11. User Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /users/profile | Customer |
| PUT | /users/profile | Customer |
| GET | /users/customers | Admin |
| PATCH | /users/:id/role | Admin |

## 12. Analytics Routes

| Method | Endpoint | Access |
|---|---|---|
| GET | /analytics/dashboard | Admin |
| GET | /analytics/revenue | Admin |

## 13. Standard Response Format

Success:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## 14. HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | No content |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 422 | Validation error |
| 429 | Too many requests |
| 500 | Internal server error |

## 15. API Security

- Validate all incoming data.
- Authenticate protected requests.
- Enforce role and ownership checks.
- Rate-limit sensitive endpoints.
- Verify payment signatures server-side.
- Keep private files behind authorization.
- Avoid returning secrets or internal storage paths.
