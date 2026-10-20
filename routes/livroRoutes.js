const { Router } = require('express');
const controller = require('../controllers/LivroController');
const { autenticarToken, exigirRole } = require('../middlewares/authMiddleware');

const router = Router();

// Rotas Públicas

/**
 * @openapi
 * /api/v1/livros:
 *   get:
 *     tags: [Livros]
 *     summary: Listar livros
 *     description: Rota pública. Retorna os livros com o nome do autor.
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Livro' }
 *       500: { $ref: '#/components/responses/ErroInterno' }
 */
router.get('/', (req, res, next) => controller.index(req, res, next));

/**
 * @openapi
 * /api/v1/livros/{id}:
 *   get:
 *     tags: [Livros]
 *     summary: Consultar livro específico
 *     description: Rota pública.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Livro' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', (req, res, next) => controller.show(req, res, next));

// Rota Restrita: ADMIN

/**
 * @openapi
 * /api/v1/livros:
 *   post:
 *     tags: [Livros]
 *     summary: Cadastrar livro (ADMIN)
 *     description: Rota restrita a usuários com perfil ADMIN. O autor_id deve existir.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LivroRequest' }
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Livro' }
 *       400: { $ref: '#/components/responses/RequisicaoInvalida' }
 *       401: { $ref: '#/components/responses/NaoAutenticado' }
 *       403: { $ref: '#/components/responses/Proibido' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.post('/', autenticarToken, exigirRole('ADMIN'), (req, res, next) => controller.store(req, res, next));

// Rota Restrita: Usuário Autenticado

/**
 * @openapi
 * /api/v1/livros/{id}/comentarios:
 *   post:
 *     tags: [Livros]
 *     summary: Comentar livro (autenticado)
 *     description: Qualquer usuário autenticado (USER ou ADMIN) pode comentar. O nome do autor do comentário vem do token.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ComentarioRequest' }
 *     responses:
 *       201:
 *         description: Comentário adicionado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Comentario' }
 *       400: { $ref: '#/components/responses/RequisicaoInvalida' }
 *       401: { $ref: '#/components/responses/NaoAutenticado' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.post('/:id/comentarios', autenticarToken, (req, res, next) => controller.storeComment(req, res, next));

module.exports = router;
