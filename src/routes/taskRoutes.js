const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController'); // Importa o controlador de tarefas

// Rota para criar uma tarefa
router.post('/', TaskController.createTask);

// Rota para obter todas as tarefas
router.get('/', TaskController.getTasks);

// Rota para atualizar uma tarefa
router.put('/:id', TaskController.updateTask);

// Rota para deletar uma tarefa
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
