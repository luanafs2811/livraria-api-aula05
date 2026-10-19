const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Documentação OpenAPI 3.0 (Swagger UI)
app.get('/docs/api.json', (req, res) => res.json(swaggerSpec));
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Agrupamento Semântico de Rotas (RESTful /api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/autores', autorRoutes);

// Middleware Global de Tratamento de Erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Livraria API rodando em http://localhost:${PORT}`);
});