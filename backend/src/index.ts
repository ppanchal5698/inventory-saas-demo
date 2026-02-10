import { sequelize } from './db/index';
import { createApp } from './app';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

async function start(): Promise<void> {
  const app = createApp();
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, (): void => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close(async () => {
      try {
        await sequelize.close();
        console.log('Database connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing database:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
