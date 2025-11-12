const request = require('supertest');
const app = require('../../src/app.js');
const User = require('../../src/models/user.model.js');

describe('Auth routes', () => {
  describe('POST /api/auth/register', () => {
    it('crée un utilisateur et retourne un token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('token');

      // Vérifier que l’utilisateur est bien en base
      const userInDb = await User.findOne({ email: 'test@example.com' });
      expect(userInDb).not.toBeNull();
      expect(userInDb.passwordHash).toBeDefined();
    });

    it('refuse un email déjà utilisé', async () => {
      // Créer un user une première fois
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
        });

      // Deuxième tentative
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('retourne un token pour des identifiants valides', async () => {
      // Créer l'utilisateur via la route register
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('refuse des identifiants invalides', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'wrong',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });
});
