const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const port = process.env.PORT || 8001;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer API',
      description: 'Customer API Infomation',
      version: '1.0.0'
    },
    servers: [{
      url: `http://localhost:${port}/v1/api`,
      description: 'Development server'
    }]
  },
  apis: ['src/Docs/*.yml', './src/Routes/*.routes.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
  })
);

module.exports = router;