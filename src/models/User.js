// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');  // Supondo que você tenha configurado o Sequelize

// Define o modelo User
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Nome de usuário já existe'
    },
    validate: {
      notEmpty: { msg: 'Nome de usuário é obrigatório' },
      len: {
        args: [4, 20],
        msg: 'Nome de usuário deve ter entre 4 e 20 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email já existe'
    },
    validate: {
      isEmail: { msg: 'Formato de email inválido' },
      notEmpty: { msg: 'Email é obrigatório' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Senha é obrigatória' },
      len: {
        args: [6, 100],
        msg: 'Senha deve ter entre 6 e 100 caracteres'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome completo é obrigatório' },
      len: {
        args: [3, 50],
        msg: 'Nome completo deve ter entre 3 e 50 caracteres'
      }
    }
  }
}, {
  hooks: {
    // Hash a senha antes de salvar o usuário no banco
    async beforeCreate(user) {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10); // 10 é o número de "salt rounds"
      }
    },
    async beforeUpdate(user) {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10); // 10 é o número de "salt rounds"
      }
    }
  }
});

// Método para verificar a senha fornecida pelo usuário
User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para gerar um token JWT
User.prototype.generateAuthToken = function() {
  return jwt.sign(
    { id: this.id, name: this.name, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = User;
