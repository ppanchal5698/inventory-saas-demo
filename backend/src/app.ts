import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import { errorHandler } from './middleware/errorHandler';

// Export the app creation function for testing
export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};
