const request = require('supertest');
const app = require('../app');

describe('CRUD /api/vehicles', () => {
  let token;
  let createdVehicleId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    token = res.body.token;
  });

  it('GET /api/vehicles deve responder com 200 e um array', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/vehicles deve criar um novo veículo', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ plate_number: 'TEST-1234', capacity: 20 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('vehicle_id');
    expect(res.body.plate_number).toBe('TEST-1234');
    createdVehicleId = res.body.vehicle_id;
  });

  it('GET /api/vehicles/:id deve devolver o veículo criado', async () => {
    const res = await request(app)
      .get(`/api/vehicles/${createdVehicleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('vehicle_id', createdVehicleId);
  });

  it('PATCH /api/vehicles/:id deve atualizar o veículo', async () => {
    const res = await request(app)
      .patch(`/api/vehicles/${createdVehicleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ capacity: 30 });
    expect(res.statusCode).toBe(200);
    if (res.body && res.body.capacity) {
      expect(res.body.capacity).toBe(30);
    }
  });

  it('DELETE /api/vehicles/:id deve apagar o veículo', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${createdVehicleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});