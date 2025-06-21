const request = require('supertest');
const app = require('../app');

describe('CRUD /api/alternative_trajectories', () => {
  let token;
  let createdAltTrajId;
  const stop_id_1 = 11;
  const stop_id_2 = 17;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'Admin', password: 'Esmad' });
    token = res.body.token;
  });

  it('GET /api/alternative_trajectories deve responder com 200 e um array', async () => {
    const res = await request(app)
      .get('/api/alternative_trajectories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/alternative_trajectories deve criar uma nova', async () => {
    const res = await request(app)
      .post('/api/alternative_trajectories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stop_id_1,
        stop_id_2,
        alt_trajectory: 'Trajeto alternativo de teste'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('alt_trajectory_id');
    createdAltTrajId = res.body.alt_trajectory_id;
  });

  it('GET /api/alternative_trajectories/:id deve devolver a alternativa criada', async () => {
    const res = await request(app)
      .get(`/api/alternative_trajectories/${createdAltTrajId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('alt_trajectory_id', createdAltTrajId);
  });

  it('PATCH /api/alternative_trajectories/:id deve atualizar a alternativa', async () => {
    const res = await request(app)
      .patch(`/api/alternative_trajectories/${createdAltTrajId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ alt_trajectory: 'Trajeto alternativo editado' });
    expect(res.statusCode).toBe(200);
  });

  it('DELETE /api/alternative_trajectories/:id deve apagar a alternativa', async () => {
    const res = await request(app)
      .delete(`/api/alternative_trajectories/${createdAltTrajId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});