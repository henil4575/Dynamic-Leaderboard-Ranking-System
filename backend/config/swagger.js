const swaggerJsdoc = require("swagger-jsdoc");


// This is our @swagger from where the api of server is provided 
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Leaderboard API",
      version: "1.0.0",
      description: "Dynamic leaderboard REST API with real-time ranking, stats, and performance tracking",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);