import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import routes from './routes/index.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
