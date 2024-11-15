const Task = require('../models/Task');

module.exports = {
  // Criar nova tarefa
  async createTask(req, res) {
    try {
      // Verifique se title e description estão presentes
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
      }

      // Criar tarefa no banco de dados
      const task = await Task.create({ title, description, status: false });

      // Adicionar console.log para verificar a tarefa criada
      console.log('Tarefa criada:', task);

      return res.status(201).json(task);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);  // Log de erro
      return res.status(500).json({ error: 'Erro ao criar a tarefa' });
    }
  },

  // Obter todas as tarefas
  async getTasks(req, res) {
    try {
      // Consultar todas as tarefas do banco
      const tasks = await Task.findAll();

      // Adicionar console.log para verificar as tarefas retornadas
      console.log('Tarefas encontradas:', tasks);

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);  // Log de erro
      return res.status(500).json({ error: 'Erro ao buscar as tarefas' });
    }
  },

  // Atualizar uma tarefa
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      // Buscar tarefa pelo ID
      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      // Atualizar campos da tarefa
      task.title = title;
      task.description = description;
      task.status = status;
      await task.save();

      // Adicionar console.log para verificar a tarefa atualizada
      console.log('Tarefa atualizada:', task);

      return res.status(200).json(task);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);  // Log de erro
      return res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
    }
  },

  // Deletar uma tarefa
  async deleteTask(req, res) {
    try {
      const { id } = req.params;

      // Buscar tarefa pelo ID
      const task = await Task.findByPk(id);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      // Deletar a tarefa
      await task.destroy();

      // Adicionar console.log para verificar a tarefa deletada
      console.log('Tarefa deletada:', task);

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);  // Log de erro
      return res.status(500).json({ error: 'Erro ao deletar a tarefa' });
    }
  },
};
