const request = require('supertest');
const app = require('../app');

describe('CRUD /api/weather', () => {
  let token;
  let createdWeatherId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    token = res.body.token;
  });

  it('GET /api/weather deve responder com 200 e um array', async () => {
    const res = await request(app)
      .get('/api/weather')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/weather deve criar uma nova leitura', async () => {
    const res = await request(app)
      .post('/api/weather')
      .set('Authorization', `Bearer ${token}`)
      .send({
        temperature: 20.5,
        rain: 0,
        wind: 5.2,
        location: 'Test City',
        datetime: new Date().toISOString(),
        notes: 'Test reading'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('reading_id');
    createdWeatherId = res.body.reading_id;
  });

  it('GET /api/weather/:id deve devolver a leitura criada', async () => {
    const res = await request(app)
      .get(`/api/weather/${createdWeatherId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reading_id', createdWeatherId);
  });

  it('PATCH /api/weather/:id deve atualizar a leitura', async () => {
    const res = await request(app)
      .patch(`/api/weather/${createdWeatherId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Updated note' });
    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toBe('Updated note');
  });

  it('DELETE /api/weather/:id deve apagar a leitura', async () => {
    const res = await request(app)
      .delete(`/api/weather/${createdWeatherId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});