// controllers/authController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Função para registrar um novo usuário
async function registerUser(req, res) {
  const { username, email, password, name } = req.body;

  try {
    const user = await User.create({ username, email, password, name });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o usuário' });
  }
}

// Função para fazer login e gerar o token JWT
async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordCorrect = await user.isValidPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao tentar fazer login' });
  }
}

module.exports = { registerUser, loginUser };
