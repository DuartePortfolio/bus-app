const request = require('supertest');
const app = require('../app');

describe('GET /api/stops', () => {
  it('deve responder com 200 e um array', async () => {
    const res = await request(app).get('/api/stops');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('cada paragem deve ter pelo menos um id e um nome', async () => {
    const res = await request(app).get('/api/stops');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      res.body.forEach(stop => {
        expect(stop).toHaveProperty('stop_id');
        expect(stop).toHaveProperty('stop_name');
      });
    }
  });
});