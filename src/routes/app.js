const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes'); // Importa as rotas de tarefas
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação
const bodyParser = require('body-parser');
const authenticateToken = require('./middleware/authenticateToken'); // Middleware de autenticação

app.use(bodyParser.json());

// Rota de autenticação
app.use('/api/auth', authRoutes);

// Rotas de tarefas protegidas com autenticação
app.use('/api/tasks', authenticateToken, taskRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
