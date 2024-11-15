# taskhub-backend
Backend para o projeto TaskHub, gerenciador de tarefas.

Documentação de Implementação de Tarefas com Autenticação JWT
Objetivo
Este projeto é uma API que permite o gerenciamento de tarefas com autenticação e autorização via JWT (JSON Web Token). O sistema inclui rotas para criar, listar, atualizar e excluir tarefas, com autenticação de usuário através de um token JWT.

Tecnologias Usadas
Node.js
Express.js
Sequelize (ORM para interação com o banco de dados)
JWT (JSON Web Token)
PostgreSQL (banco de dados)
Middleware para tratamento de erros
Estrutura do Projeto
controllers/: Controladores para gerenciar as operações das rotas.

TaskController.js: Gerencia a criação, atualização, listagem e exclusão de tarefas.
authController.js: Gerencia o login e geração do token JWT.
middleware/: Middlewares usados no processo de autenticação.

authenticateToken.js: Middleware para validar o token JWT e proteger as rotas de tarefas.
models/: Modelos do banco de dados.

Task.js: Modelo para a tabela de tarefas no banco de dados.
routes/: Definições das rotas.

taskRoutes.js: Rotas para criação, atualização, listagem e exclusão de tarefas.
authRoutes.js: Rota para login e obtenção do token JWT.
app.js: Arquivo principal que configura a aplicação Express, conecta as rotas e aplica middlewares.

Passo a Passo para Rodar o Código
1. Configuração Inicial
Pré-requisitos
Antes de rodar o projeto, certifique-se de ter as seguintes dependências instaladas no seu ambiente:

Node.js: Download e instalação
PostgreSQL: Download e instalação
Clone o Repositório
Clone o repositório do projeto:

bash
Copiar código
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_DIRETORIO>
Instale as Dependências
No diretório do projeto, instale as dependências do Node.js usando o npm:

bash
Copiar código
npm install
Configuração do Banco de Dados
Crie um banco de dados no PostgreSQL:

Nome do banco de dados: taskhub (ou outro nome à sua escolha).
Configuração do arquivo .env:

Crie um arquivo .env na raiz do projeto e adicione a configuração para a conexão com o banco de dados:

env
Copiar código
DATABASE_URL=postgres://postgres:senha@localhost:5432/taskhub
JWT_SECRET=sua_chave_secreta
DATABASE_URL: Substitua senha pela senha do seu usuário postgres.
JWT_SECRET: Escolha uma chave secreta para o JWT.
Rodar as Migrations: (Se estiver usando Sequelize)

Se você usar Sequelize para definir o banco de dados, execute o comando para rodar as migrations:

bash
Copiar código
npx sequelize db:migrate
2. Estrutura de Arquivos e Código
2.1 Controladores
authController.js: Controlador para o login e geração do token JWT.

Código:

javascript
Copiar código
const jwt = require('jsonwebtoken');

function loginUser(req, res) {
  const user = { id: 1, name: 'Exemplo' }; // Exemplo de usuário

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token com validade de 1 hora

  res.json({ token }); // Retorna o token gerado
}

module.exports = { loginUser };
TaskController.js: Controlador para as operações de tarefas (criar, listar, atualizar, excluir).

Código:

javascript
Copiar código
const Task = require('../models/Task');

module.exports = {
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
      }

      const task = await Task.create({ title, description, status: false });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar a tarefa' });
    }
  },

  async getTasks(req, res) {
    try {
      const tasks = await Task.findAll();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  },

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      task.title = title;
      task.description = description;
      task.status = status;
      await task.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
    }
  },

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      await task.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar a tarefa' });
    }
  }
};
2.2 Middleware
authenticateToken.js: Middleware para proteger rotas com autenticação JWT.

Código:

javascript
Copiar código
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    req.user = user; // Adiciona as informações do usuário no objeto req
    next(); // Chama a próxima função middleware
  });
}

module.exports = authenticateToken;
2.3 Rotas
authRoutes.js: Rota para login e obtenção de token JWT.

Código:

javascript
Copiar código
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);

module.exports = router;
taskRoutes.js: Rotas para operações de tarefas (criar, listar, atualizar, excluir).

Código:

javascript
Copiar código
const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

router.post('/', TaskController.createTask);
router.get('/', TaskController.getTasks);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
2.4 Arquivo Principal app.js
Código:

javascript
Copiar código
const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const authenticateToken = require('./middleware/authenticateToken');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
3. Testando a API com o Postman
Login (Obter o token JWT):

Método: POST
URL: http://localhost:5000/api/auth/login
Resposta:
json
Copiar código
{ "token": "seu_token_jwt_aqui" }
Requisição para Tarefas:

Método: POST, GET, PUT, DELETE
URL: http://localhost:5000/api/tasks
Cabeçalho:
bash
Copiar código
Authorization: Bearer <seu_token_jwt>
