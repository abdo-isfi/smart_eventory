const { connect, closeDatabase, clearDatabase } = require('./setup/test-db');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

afterEach(async () => {
  await clearDatabase();
});
