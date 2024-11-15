// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importa o controlador de autenticação

// Rota para registrar um novo usuário
router.post('/register', authController.registerUser);

// Rota para fazer login (gerar o token JWT)
router.post('/login', authController.loginUser);

module.exports = router;
