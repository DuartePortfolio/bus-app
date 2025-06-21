const request = require('supertest');
const app = require('../app');

describe('CRUD /api/trips', () => {
  let token;
  let createdTripId;
  const route_id = 6;
  const vehicle_id = 6;
  const driver_id = 12;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    token = res.body.token;
  });

  it('GET /api/trips deve responder com 200 e um array', async () => {
    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/trips deve criar uma nova viagem', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        route_id,
        vehicle_id,
        driver_id,
        start_time: new Date().toISOString()
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('trip_id');
    createdTripId = res.body.trip_id;
  });

  it('GET /api/trips/:id deve devolver a viagem criada', async () => {
    const res = await request(app)
      .get(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('trip_id', createdTripId);
  });

  it('PATCH /api/trips/:id deve atualizar a viagem', async () => {
    const res = await request(app)
      .patch(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ start_time: new Date(Date.now() + 3600000).toISOString() });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/trips/:id deve apagar a viagem', async () => {
    const res = await request(app)
      .delete(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});