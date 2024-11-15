const express = require('express');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});


app.use(express.json());


sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return sequelize.sync(); 
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });


const Task = require('./models/Task');
const taskRoutes = require('./routes/taskRoutes');


app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('API do TaskHub está funcionando!  ');
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
