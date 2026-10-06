const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'livraria-segredo';

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido." });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

function exigirRole(roleEsperada) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.role !== roleEsperada) {
      return res.status(403).json({ erro: `Acesso proibido: privilégio de ${roleEsperada} exigido.` });
    }
    next();
  };
}

module.exports = { autenticarToken, exigirRole, JWT_SECRET };
