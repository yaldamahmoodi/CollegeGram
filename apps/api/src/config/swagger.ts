import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CollegeGram API',
      version: '1.0.0',
      description: 'A comprehensive API for the CollegeGram application',
      contact: {
        name: 'CollegeGram Team',
        email: 'devsync@rahnemacollege.ir'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.collegegram.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/v1/*.ts'
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: express.Application) => {
  // Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CollegeGram API Documentation'
  }));

  // JSON endpoint
  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  return specs;
};

export default specs;
