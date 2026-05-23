import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Surplusin API',
      version: '1.0.0',
      description: 'API documentation for Surplusin',
    },
    servers: [
      {
        url: 'https://surplusin-be-h4yi.vercel.app',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Gunakan token JWT untuk otentikasi. Format: Bearer',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
