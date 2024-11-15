const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Verifica se o token está presente no cabeçalho Authorization
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  // Verifica e decodifica o token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    req.user = user; // Salva as informações do usuário no objeto req
    next(); // Chama a próxima função middleware
  });
}

module.exports = authenticateToken;
