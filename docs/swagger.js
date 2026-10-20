const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Livraria API',
      version: '1.0.0',
      description:
        'API RESTful da Livraria Comunitária com autenticação JWT, senhas com hash bcrypt e controle de acesso por perfil (RBAC: ADMIN / USER).'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: [
      { name: 'Autenticação', description: 'Cadastro e login de usuários' },
      { name: 'Livros', description: 'Consulta, cadastro e comentários de livros' },
      { name: 'Autores', description: 'Consulta e cadastro de autores' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Erro: {
          type: 'object',
          properties: { erro: { type: 'string', example: 'Mensagem descritiva do erro.' } }
        },
        RegistroRequest: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@email.com' },
            senha: { type: 'string', format: 'password', example: 'senha123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@livraria.com' },
            senha: { type: 'string', format: 'password', example: 'admin123' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Admin' },
            email: { type: 'string', example: 'admin@livraria.com' },
            role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'USER' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nome: { type: 'string', example: 'Admin' },
                role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'ADMIN' }
              }
            },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        Autor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Machado de Assis' },
            nacionalidade: { type: 'string', example: 'Brasileiro' }
          }
        },
        AutorRequest: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Clarice Lispector' },
            nacionalidade: { type: 'string', example: 'Brasileira' }
          }
        },
        Comentario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            autor_nome: { type: 'string', example: 'Leitor' },
            texto: { type: 'string', example: 'Clássico indispensável.' }
          }
        },
        ComentarioRequest: {
          type: 'object',
          required: ['texto'],
          properties: { texto: { type: 'string', example: 'Leitura excelente!' } }
        },
        Livro: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Dom Casmurro' },
            ano: { type: 'integer', example: 1899 },
            autor_id: { type: 'integer', example: 1 },
            autor_nome: { type: 'string', example: 'Machado de Assis' },
            comentarios: { type: 'array', items: { $ref: '#/components/schemas/Comentario' } }
          }
        },
        LivroRequest: {
          type: 'object',
          required: ['titulo', 'autor_id'],
          properties: {
            titulo: { type: 'string', example: 'Memórias Póstumas de Brás Cubas' },
            ano: { type: 'integer', example: 1881 },
            autor_id: { type: 'integer', example: 1 }
          }
        }
      },
      responses: {
        NaoAutenticado: {
          description: 'Token ausente, inválido ou expirado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        },
        Proibido: {
          description: 'Usuário autenticado sem o perfil exigido (ADMIN)',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        },
        RequisicaoInvalida: {
          description: 'Dados obrigatórios ausentes ou inválidos',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        },
        ErroInterno: {
          description: 'Erro interno no servidor (ex.: falha ao ler o arquivo de dados)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'Ocorreu um erro interno no servidor.' }
            }
          }
        },
        NaoEncontrado: {
          description: 'Recurso não localizado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
