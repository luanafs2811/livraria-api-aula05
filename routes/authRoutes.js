const { Router } = require('express');
const controller = require('../controllers/AuthController');

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastrar novo usuário
 *     description: Cria um usuário com perfil USER. A senha é armazenada com hash bcrypt e nunca é retornada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegistroRequest' }
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       400: { $ref: '#/components/responses/RequisicaoInvalida' }
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Erro' }
 */
router.post('/register', (req, res, next) => controller.register(req, res, next));

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autenticar usuário
 *     description: Valida as credenciais e retorna um token JWT com validade de 1 hora.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResponse' }
 *       400: { $ref: '#/components/responses/RequisicaoInvalida' }
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Erro' }
 */
router.post('/login', (req, res, next) => controller.login(req, res, next));

module.exports = router;
