const request = require('supertest');
const app = require('../app');

describe('CRUD /api/routes', () => {
  let token;
  let createdRouteId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    token = res.body.token;
  });

  it('GET /api/routes deve responder com 200 e um array', async () => {
    const res = await request(app)
      .get('/api/routes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/routes deve criar uma nova rota', async () => {
    const res = await request(app)
      .post('/api/routes')
      .set('Authorization', `Bearer ${token}`)
      .send({ route_name: 'Rota Teste' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('route_id');
    expect(res.body.route_name).toBe('Rota Teste');
    createdRouteId = res.body.route_id;
  });

  it('GET /api/routes/:id deve devolver a rota criada', async () => {
    const res = await request(app)
      .get(`/api/routes/${createdRouteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('route_id', createdRouteId);
  });

  it('PATCH /api/routes/:id deve atualizar a rota', async () => {
    const res = await request(app)
      .patch(`/api/routes/${createdRouteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ route_name: 'Rota Editada' });
    expect(res.statusCode).toBe(200);
    expect(res.body.route_name).toBe('Rota Editada');
  });

  it('DELETE /api/routes/:id deve apagar a rota', async () => {
    const res = await request(app)
      .delete(`/api/routes/${createdRouteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});