const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json"); // Este é o seu arquivo Swagger JSON

const app = express();
const port = 3000;

// Middleware para analisar JSON
app.use(express.json());

// Endpoint para receber o webhook
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  // Aqui você trataria os dados do webhook conforme necessário

  res.status(200).send("Webhook received");
});

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});