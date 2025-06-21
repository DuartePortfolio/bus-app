const request = require('supertest');
const app = require('../app');

describe('GET /api/routes', () => {
  it('deve responder com 200 e um array', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});