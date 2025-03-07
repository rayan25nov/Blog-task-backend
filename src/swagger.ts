import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation for the backend",
      contact: {
        name: "Rayan Ahmad",
      },
      servers: [
        {
          url: `${process.env.SERVER_URL}`, // Base URL for the API
        },
      ],
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
