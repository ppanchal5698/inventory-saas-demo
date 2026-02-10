import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
let token: string;
let customerId: number;
let warehouseId: number;
let productId: number;

beforeAll(async () => {
  // 1. Setup User & Org
  await request(app).post('/api/auth/register').send({
    email: 'sales@example.com',
    password: 'password123',
    username: 'salesuser',
    firstName: 'Sales',
    lastName: 'User',
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'sales@example.com',
    password: 'password123',
  });
  const orgRes = await request(app)
    .post('/api/auth/organizations')
    .set('Authorization', `Bearer ${loginRes.body.data.token}`)
    .send({ organizationName: 'Sales Corp', slug: 'sales-corp' });
  token = orgRes.body.data.token;

  // 2. Setup Warehouse
  const whRes = await request(app)
    .post('/api/inventory/warehouses')
    .set('Authorization', `Bearer ${token}`)
    .send({ warehouseCode: 'WH-01', warehouseName: 'Main Warehouse' });
  warehouseId = whRes.body.data.warehouseId;

  // 3. Setup Customer
  const custRes = await request(app)
    .post('/api/sales/customers')
    .set('Authorization', `Bearer ${token}`)
    .send({ customerCode: 'CUST-01', customerName: 'John Doe' });
  customerId = custRes.body.data.customerId;

  // 4. Setup Product
  const prodRes = await request(app)
    .post('/api/catalog/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ productCode: 'P-100', productName: 'Widget', unitPrice: 100 });
  productId = prodRes.body.data.productId;
});

describe('Sales E2E', () => {
  it('should create a sales order and reserve stock', async () => {
    const res = await request(app)
      .post('/api/sales/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerId,
        warehouseId,
        orderDate: '2023-10-01',
        items: [
          { productId, quantity: 5, unitPrice: 100 }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.data.orderNumber).toMatch(/^SO-/);
    expect(res.body.data.totalAmount).toBe("500");
  });
});
