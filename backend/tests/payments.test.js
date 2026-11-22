
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';

describe('Payments API', () => {
  it('requires authentication to create a payment order', async () => {
    const response = await request(app)
      .post('/api/payments/create-order')
      .send({});

    assert.ok(
      [401, 403].includes(response.status),
      `Expected authentication failure, received ${response.status}`
    );
  });

  it('requires authentication to verify payment', async () => {
    const response = await request(app)
      .post('/api/payments/verify')
      .send({
        razorpay_order_id: 'order_test123',
        razorpay_payment_id: 'pay_test123',
        razorpay_signature: 'a'.repeat(64),
      });

    assert.ok(
      [401, 403].includes(response.status),
      `Expected authentication failure, received ${response.status}`
    );
  });

  it('does not accept an incomplete payment verification request', async () => {
    const response = await request(app)
      .post('/api/payments/verify')
      .send({
        razorpay_order_id: 'order_test123',
      });

    assert.ok(
      [400, 401, 403, 422].includes(response.status),
      `Unexpected status: ${response.status}`
    );
  });
});
