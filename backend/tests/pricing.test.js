
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';

describe('Pricing API', () => {
  it('rejects an empty pricing request', async () => {
    const response = await request(app)
      .post('/api/pricing/quote')
      .send({});

    assert.ok(
      [400, 401, 422].includes(response.status),
      `Unexpected status: ${response.status}`
    );
  });

  it('rejects invalid quantity values', async () => {
    const response = await request(app)
      .post('/api/pricing/quote')
      .send({
        productId: 'invalid-id',
        quantity: -10,
        width: -100,
        height: 0,
      });

    assert.ok(
      [400, 401, 422].includes(response.status),
      `Unexpected status: ${response.status}`
    );
  });

  it('does not expose server errors for invalid input', async () => {
    const response = await request(app)
      .post('/api/pricing/quote')
      .send({
        quantity: 'invalid',
      });

    assert.notEqual(response.status, 500);
  });
});
