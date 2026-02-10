import request from 'supertest';
import { createApp } from '../../src/app';
import { sequelize } from '../../src/db/index';

const app = createApp();

describe('Auth E2E', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('test@example.com');
  });

  it('should login and return a token', async () => {
    // Register first (or seed)
    await request(app).post('/api/auth/register').send({
      email: 'login@example.com',
      password: 'password123',
      username: 'loginuser',
      firstName: 'Login',
      lastName: 'User',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should create an organization', async () => {
    // 1. Register
    await request(app).post('/api/auth/register').send({
      email: 'org@example.com',
      password: 'password123',
      username: 'orguser',
      firstName: 'Org',
      lastName: 'User',
    });

    // 2. Login to get token (initially without org)
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'org@example.com',
      password: 'password123',
    });
    const token = loginRes.body.data.token;

    // 3. Create Org
    const orgRes = await request(app)
      .post('/api/auth/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        organizationName: 'My Tech Corp',
        slug: 'my-tech-corp',
        email: 'admin@mytech.com',
      });

    expect(orgRes.status).toBe(201);
    expect(orgRes.body.data.organization.slug).toBe('my-tech-corp');
    expect(orgRes.body.data).toHaveProperty('token'); // New token with Org ID
  });
});
