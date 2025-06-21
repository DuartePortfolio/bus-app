const request = require('supertest');
const app = require('../app');

describe('CRUD /api/stops', () => {
  let createdStopId;

  it('GET /api/stops deve responder com 200 e um array', async () => {
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

  it('POST /api/stops deve criar uma nova paragem', async () => {
    const res = await request(app)
      .post('/api/stops')
      .send({ stop_name: 'Paragem Teste', stop_lat: 0, stop_lon: 0 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('stop_id');
    expect(res.body.stop_name).toBe('Paragem Teste');
    createdStopId = res.body.stop_id;
  });

  it('PATCH /api/stops/:id deve atualizar a paragem', async () => {
    const res = await request(app)
      .patch(`/api/stops/${createdStopId}`)
      .send({ stop_name: 'Paragem Editada' });
    expect(res.statusCode).toBe(200);
    if (res.body && res.body.stop_name) {
      expect(res.body.stop_name).toBe('Paragem Editada');
    }
  });

  it('DELETE /api/stops/:id deve apagar a paragem', async () => {
    const res = await request(app).delete(`/api/stops/${createdStopId}`);
    expect(res.statusCode).toBe(200);
  });
});