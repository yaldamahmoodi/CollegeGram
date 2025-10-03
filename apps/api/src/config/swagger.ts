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
    customCss: `
      .swagger-ui .topbar { display: none }
      /* Card-like styling for each endpoint */
      .swagger-ui .opblock {
        border-radius: 0.75rem; /* rounded-xl */
        border: 1px solid #e5e7eb; /* border */
        background: #ffffff; /* bg-card */
        color: #0b0f19; /* text-card-foreground */
        box-shadow: 0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1); /* shadow */
        margin: 16px 0;
        overflow: hidden;
      }
      .swagger-ui .opblock .opblock-summary {
        background: #f9fafb; /* subtle header */
        padding: 16px 20px; /* p-6 like */
      }
      .swagger-ui .opblock .opblock-summary-method {
        border-radius: 9999px;
        padding: 6px 10px;
        min-width: 64px;
        text-align: center;
        font-weight: 600;
      }
      .swagger-ui .opblock .opblock-summary-path a span { font-weight: 600; }
      .swagger-ui .opblock .opblock-summary-description { color: #6b7280; }
      .swagger-ui .opblock .opblock-body { padding: 16px 20px; }

      /* Make models/params look like card content */
      .swagger-ui .model-box { border-radius: 0.5rem; border-color: #e5e7eb; }
      .swagger-ui .response-col_description__inner { border-radius: 0.5rem; }
      .swagger-ui table { border-color: #e5e7eb; }
      .swagger-ui table thead tr th { background: #f9fafb; }
      .swagger-ui .response-controls { margin: 8px 0; }

      /* Info panel in a card */
      .swagger-ui .info {
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        padding: 16px;
        box-shadow: 0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1);
        background: #ffffff;
      }

      /* Improve try-it-out buttons spacing */
      .swagger-ui .opblock .try-out { margin-right: 8px; }
      .swagger-ui .btn, .swagger-ui .opblock-control-arrow { border-radius: 0.375rem; }

      /* Method badge colors remain Swagger defaults but enhance contrast */
      .swagger-ui .opblock.opblock-get .opblock-summary-method { filter: saturate(1.1); }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { filter: saturate(1.1); }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { filter: saturate(1.1); }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { filter: saturate(1.1); }
    `,
    customSiteTitle: 'CollegeGram API Documentation'
  }));


  app.get('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(mergedSpecs);
  });

  return mergedSpecs;
};

export default mergedSpecs;
