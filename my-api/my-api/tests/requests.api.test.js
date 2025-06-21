const request = require('supertest');
const app = require('../app');

describe('CRUD /api/requests', () => {
  let driverToken;
  let operatorToken;
  let createdRequestId;

  beforeAll(async () => {
    const driverRes = await request(app)
      .post('/api/login')
      .send({ username: 'User', password: 'Esmad' });
    driverToken = driverRes.body.token;

    const opRes = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    operatorToken = opRes.body.token;
  });

  it('GET /api/requests deve responder com 200 e um array (operator)', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${operatorToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/requests deve criar um novo pedido (driver)', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        category: 'feature',
        title: 'Pedido Teste',
        message: 'Mensagem de teste'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('request_id');
    createdRequestId = res.body.request_id;
  });

  it('GET /api/requests/:id deve devolver o pedido criado (operator)', async () => {
    const res = await request(app)
      .get(`/api/requests/${createdRequestId}`)
      .set('Authorization', `Bearer ${operatorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('request_id', createdRequestId);
  });

  it('PATCH /api/requests/:id deve atualizar o pedido (operator)', async () => {
    const res = await request(app)
      .patch(`/api/requests/${createdRequestId}`)
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ status: 'accepted', response: 'Aceite!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('accepted');
    expect(res.body.response).toBe('Aceite!');
  });

  it('DELETE /api/requests/:id deve apagar o pedido (driver)', async () => {
    const res = await request(app)
      .delete(`/api/requests/${createdRequestId}`)
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.statusCode).toBe(200);
  });
});