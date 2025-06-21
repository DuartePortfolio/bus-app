const request = require('supertest');
const app = require('../app');

describe('CRUD /api/users', () => {
  let token;
  let createdUserId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    token = res.body.token;
  });

  it('GET /api/users deve responder com 200 e um array', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/users deve criar um novo utilizador', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Utilizador Teste',
        email: `teste@mail.com`,
        password: '123456',
        role: 'driver',
        contact: '912345678'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    createdUserId = res.body.user_id;
  });

  it('GET /api/users/:id deve devolver o utilizador criado', async () => {
    const res = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

  });

  it('PATCH /api/users/:id deve atualizar o utilizador', async () => {
    const res = await request(app)
      .patch(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Utilizador Editado' });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/users/:id deve apagar o utilizador', async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});