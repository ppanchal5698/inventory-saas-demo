import { sequelize } from '../src/db/index';

beforeAll(async () => {
  // Connect to DB
  await sequelize.authenticate();

  // Sync DB (Force to reset for tests - creates tables based on models)
  // Note: ideally we run schema.sql, but for this environment sequelize.sync is safer
  // provided models are verified. We verified models in Phase 2.
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
