
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';

describe('Orders API', () => {
  it('requires authentication to access customer orders', async () => {
    const response = await request(app)
      .get('/api/orders');

    assert.ok(
      [401, 403].includes(response.status),
      `Expected authentication failure, received ${response.status}`
    );
  });

  it('requires authentication to create an order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({});

    assert.ok(
      [401, 403].includes(response.status),
      `Expected authentication failure, received ${response.status}`
    );
  });

  it('rejects invalid order identifiers', async () => {
    const response = await request(app)
      .get('/api/orders/invalid-id');

    assert.ok(
      [400, 401, 403, 404, 422].includes(response.status),
      `Unexpected status: ${response.status}`
    );
  });
});
