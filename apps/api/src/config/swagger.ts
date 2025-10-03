import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import YAML from 'yamljs';
import path from 'path';

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
        url: 'https://devsync.rahnemacollege.ir',
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

// Load static YAML spec and merge with generated specs
let yamlSpecs: any = {};
try {
  const yamlPath = path.join(process.cwd(), 'docs', 'swagger.yaml');
  yamlSpecs = YAML.load(yamlPath) || {};
} catch (_) {
  yamlSpecs = {};
}

const mergedSpecs = {
  ...yamlSpecs,
  ...specs,
  paths: { ...(yamlSpecs?.paths || {}), ...(specs?.paths || {}) },
  components: {
    ...(yamlSpecs?.components || {}),
    ...(specs?.components || {}),
    schemas: {
      ...(yamlSpecs?.components?.schemas || {}),
      ...(specs?.components?.schemas || {})
    },
    securitySchemes: {
      ...(yamlSpecs?.components?.securitySchemes || {}),
      ...(specs?.components?.securitySchemes || {})
    }
  }
};

export const setupSwagger = (app: express.Application) => {

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(mergedSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CollegeGram API Documentation'
  }));


  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(mergedSpecs);
  });

  return mergedSpecs;
};

export default mergedSpecs;
