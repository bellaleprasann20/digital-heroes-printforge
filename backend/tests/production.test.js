
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';

describe('Production API', () => {
  it('requires authentication to access the production queue', async () => {
    const response = await request(app)
      .get('/api/production/queue');

    assert.ok(
      [401, 403].includes(response.status),
      `Expected authentication failure, received ${response.status}`
    );
  });

  it('does not allow unauthenticated production status changes', async () => {
    const response = await request(app)
      .patch('/api/production/orders/invalid-id/stage')
      .send({
        stage: 'production',
      });

    assert.ok(
      [401, 403, 404].includes(response.status),
      `Unexpected status: ${response.status}`
    );
  });

  it('does not allow unauthenticated production file downloads', async () => {
    const response = await request(app)
      .get('/api/production/files/invalid-id');

    assert.ok(
      [401, 403, 404].includes(response.status),
      `Unexpected status: ${response.status}`
    );
  });
});
