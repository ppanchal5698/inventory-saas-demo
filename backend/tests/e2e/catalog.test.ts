import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
let token: string;

beforeAll(async () => {
  // Register user
  await request(app).post('/api/auth/register').send({
    email: 'catalog@example.com',
    password: 'password123',
    username: 'cataloguser',
    firstName: 'Catalog',
    lastName: 'User',
  });

  // Login
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'catalog@example.com',
    password: 'password123',
  });
  const tempToken = loginRes.body.data.token;

  // Create Org to get full token
  const orgRes = await request(app)
    .post('/api/auth/organizations')
    .set('Authorization', `Bearer ${tempToken}`)
    .send({
      organizationName: 'Catalog Corp',
      slug: 'catalog-corp',
    });

  token = orgRes.body.data.token;
});

describe('Catalog E2E', () => {
  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/catalog/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productCode: 'PROD-001',
        productName: 'Gaming Laptop',
        unitPrice: 1500.00,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.productCode).toBe('PROD-001');
  });

  it('should list products filtered by organization', async () => {
    const res = await request(app)
      .get('/api/catalog/products')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].productCode).toBe('PROD-001');
  });
});
