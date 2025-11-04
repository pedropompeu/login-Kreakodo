import request from 'supertest';

// Mock Firebase Admin SDK to avoid actual Firebase calls during tests
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(() => ({
          exists: true,
          data: jest.fn(() => ({
            uid: 'test-uid',
            email: 'test@example.com',
            fullName: 'Test User',
            username: '@testuser',
            role: 'user',
            active: true,
          })),
        })),
        update: jest.fn(),
      })),
      where: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(() => ({
            empty: false,
            docs: [{
              data: () => ({
                email: 'test@example.com',
                username: '@testuser',
              }),
            }],
          })),
        })),
      })),
    })),
  }),
  auth: () => ({
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'test-uid', email: 'test@example.com' })),
    getUserByEmail: jest.fn(() => Promise.reject({ code: 'auth/user-not-found' })),
    createUser: jest.fn(() => Promise.resolve({ uid: 'test-uid' })),
  }),
}));

// Import the app after mocking firebase-admin
const app = require('../index').default;

describe('Backend API Tests', () => {
  describe('GET /', () => {
    it('should return Hello from the backend!', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('Hello from the backend!');
    });
  });

  describe('GET /api/users/check-username', () => {
    it('should check if username is available', async () => {
      const res = await request(app).get('/api/users/check-username?username=testuser');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('available');
    });

    it('should return 400 if username is not provided', async () => {
      const res = await request(app).get('/api/users/check-username');
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/users/by-username/:username', () => {
    it('should return user email by username', async () => {
      const res = await request(app).get('/api/users/by-username/testuser');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email');
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user document', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          uid: 'test-uid-123',
          email: 'newuser@example.com',
          fullName: 'New User',
          username: '@newuser',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'newuser@example.com',
        });
      expect(res.statusCode).toEqual(400);
    });
  });
});
