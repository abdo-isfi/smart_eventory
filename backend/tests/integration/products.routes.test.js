const request = require('supertest');
const app = require('../../src/app.js');
const User = require('../../src/models/user.model.js');
const Product = require('../../src/models/product.model.js');
const mongoose = require('mongoose');
const crypto = require('crypto');

describe('Product routes', () => {
  // No top-level adminToken, userToken, adminId, userId anymore

  afterEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({}); // Also clear users after each test
  });

  describe('POST /api/products', () => {
    it('should create a new product as admin', async () => {
      // Create an admin user for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-post-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForPost = adminUser.body.token;
      const testSku = `TP${Math.random().toString(36).substring(2, 15)}`;

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForPost}`)
        .send({
          name: 'Test Product',
          sku: testSku,
          price: 9.99,
          category: 'Electronics',
          stock: 10,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('name', 'Test Product');
      expect(res.body.data).toHaveProperty('sku', testSku);
    });

    it('should not create a new product as a regular user', async () => {
      // Create an admin user and a regular user for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-post-denied-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      // const adminTokenForPostDenied = adminUser.body.token; // Not directly used here

      const regularUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `user-post-denied-${crypto.randomUUID()}@example.com`,
          password: 'userpassword',
          role: 'user',
        });
      const userTokenForPostDenied = regularUser.body.token;

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userTokenForPostDenied}`)
        .send({
          name: 'User Product',
          sku: `UP${Math.random().toString(36).substring(2, 15)}`,
          price: 19.99,
          category: 'Books',
          stock: 5,
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body.message).toBe('Accès refusé');
    });

    it('should not create a product with invalid data', async () => {
      // Create an admin user for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-post-invalid-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForPostInvalid = adminUser.body.token;

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForPostInvalid}`)
        .send({
          name: 'Invalid Product',
          price: -5, // Invalid price
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body.message).toContain('Validation échouée'); // Updated message
    });
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      // Create an admin user and get a token for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-getall-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForGet = adminUser.body.token;

      // Create some products first
      const sku1 = `P1${Math.random().toString(36).substring(2, 15)}`;
      const createRes1 = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForGet}`)
        .send({
          name: 'Product 1',
          sku: sku1,
          price: 10,
          category: 'Category A',
          stock: 10,
        });
      // console.log("createRes1 body:", createRes1.body);
      const sku2 = `P2${Math.random().toString(36).substring(2, 15)}`;
      const createRes2 = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForGet}`)
        .send({
          name: 'Product 2',
          sku: sku2,
          price: 20,
          category: 'Category B',
          stock: 20,
        });

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product by ID', async () => {
      // Create an admin user and get a token for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-getbyid-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForGetById = adminUser.body.token;

      // Create a product first for GET by ID tests
      const skuForGetById = `SP1GET${Math.random().toString(36).substring(2, 15)}`;
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForGetById}`)
        .send({
          name: 'Single Product',
          sku: skuForGetById,
          price: 15,
          category: 'Category C',
          stock: 5,
        });
      const productIdForGetById = createRes.body.data._id;
      const res = await request(app)
        .get(`/api/products/${productIdForGetById}`)
        .set('Authorization', `Bearer ${adminTokenForGetById}`); // Add authorization for protected route

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('name', 'Single Product');
    });

    it('should return 404 for a non-existent product', async () => {
      // Create a regular user for this test
      const regularUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `user-get404-${crypto.randomUUID()}@example.com`,
          password: 'userpassword',
          role: 'user',
        });
      const userTokenForGet404 = regularUser.body.token;

      const nonExistentId = new mongoose.Types.ObjectId(); // Generate a valid-looking but non-existent ID
      const res = await request(app)
        .get(`/api/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${userTokenForGet404}`); // Send user token for authentication

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body.message).toBe('Produit introuvable');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product as admin', async () => {
      // Create admin user for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-put-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForPut = adminUser.body.token;

      const skuForPut = `PU1${Math.random().toString(36).substring(2, 15)}`;
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForPut}`)
        .send({
          name: 'Product to Update',
          sku: skuForPut,
          price: 25,
          category: 'Category D',
          stock: 10,
        });
      const productIdForPut = createRes.body.data._id;
      const res = await request(app)
        .put(`/api/products/${productIdForPut}`)
        .set('Authorization', `Bearer ${adminTokenForPut}`)
        .send({
          name: 'Updated Product Name',
          price: 30,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('name', 'Updated Product Name');
      expect(res.body.data).toHaveProperty('price', 30);
    });

    it('should not update a product as a regular user', async () => {
      // Create admin and regular users for this test block
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-put-denied-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForPutDenied = adminUser.body.token; // Use this to create product

      const regularUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `user-put-denied-${crypto.randomUUID()}@example.com`,
          password: 'userpassword',
          role: 'user',
        });
      const userTokenForPutDenied = regularUser.body.token;

      const skuForPutDenied = `PU2${Math.random().toString(36).substring(2, 15)}`;
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForPutDenied}`)
        .send({
          name: 'Product to Update Denied',
          sku: skuForPutDenied,
          price: 35,
          category: 'Category D',
          stock: 10,
        });
      const productIdForPutDenied = createRes.body.data._id;
      const res = await request(app)
        .put(`/api/products/${productIdForPutDenied}`)
        .set('Authorization', `Bearer ${userTokenForPutDenied}`)
        .send({
          name: 'Attempt to Update',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body.message).toBe('Accès refusé'); // Updated message
    });

    it('should not update a product with invalid data', async () => {
      // Create admin user for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-put-invalid-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForPutInvalid = adminUser.body.token;

      const skuForPutInvalid = `PU3${Math.random().toString(36).substring(2, 15)}`;
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForPutInvalid}`)
        .send({
          name: 'Product to Update Invalid',
          sku: skuForPutInvalid,
          price: 45,
          category: 'Category D',
          stock: 10,
        });
      const productIdForPutInvalid = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/products/${productIdForPutInvalid}`)
        .set('Authorization', `Bearer ${adminTokenForPutInvalid}`)
        .send({
          price: -10, // Invalid price
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body.message).toContain('Validation échouée'); // Updated message
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product as admin', async () => {
      // Create admin user for this test
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-delete-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForDelete = adminUser.body.token;

      const skuForDelete = `PD1${Math.random().toString(36).substring(2, 15)}`;
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForDelete}`)
        .send({
          name: 'Product to Delete',
          sku: skuForDelete,
          price: 50,
          category: 'Category E',
          stock: 1,
        });
      // console.log("createRes body in DELETE /api/products/:id should delete as admin test:", createRes.body);
      const productIdForDelete = createRes.body.data._id;
      const res = await request(app)
        .delete(`/api/products/${productIdForDelete}`)
        .set('Authorization', `Bearer ${adminTokenForDelete}`);

      expect(res.statusCode).toBe(204);

      const productInDb = await Product.findById(productIdForDelete);
      expect(productInDb).toBeNull();
    });

    it('should not delete a product as a regular user', async () => {
      // Create admin and regular users for this test block
      const adminUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-delete-denied-${crypto.randomUUID()}@example.com`,
          password: 'adminpassword',
          role: 'admin',
        });
      const adminTokenForDeleteDenied = adminUser.body.token; // Use this to create product

      const regularUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: `user-delete-denied-${crypto.randomUUID()}@example.com`,
          password: 'userpassword',
          role: 'user',
        });
      const userTokenForDeleteDenied = regularUser.body.token;

      const skuForDeleteDenied = `PD2${Math.random().toString(36).substring(2, 15)}`;
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminTokenForDeleteDenied}`)
        .send({
          name: 'Product to Delete Denied',
          sku: skuForDeleteDenied,
          price: 60,
          category: 'Category E',
          stock: 1,
        });
      // console.log("createRes body in DELETE /api/products/:id not delete as regular user test:", createRes.body);
      const productIdForDeleteDenied = createRes.body.data._id;
      const res = await request(app)
        .delete(`/api/products/${productIdForDeleteDenied}`)
        .set('Authorization', `Bearer ${userTokenForDeleteDenied}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body.message).toBe('Accès refusé'); // Updated message
    });
  });
});
