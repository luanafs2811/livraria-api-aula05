# Livraria API — Autenticação JWT, Bcrypt e RBAC

Atividade da disciplina de **Desenvolvimento de API Back-End** da **UniEVANGÉLICA**, ministrada pelo **Prof. Me. Luiz Martins**.

Este projeto implementa uma API RESTful em **Node.js / Express** arquitetada em camadas desacopladas (*Route*, *Controller*, *Service* e *Repository*), com autenticação via **JWT**, armazenamento de senhas com hash **bcrypt**, controle de acesso por perfil (**RBAC**: `ADMIN` / `USER`) e documentação interativa em **OpenAPI 3.0** via **Swagger UI**.

---

## 🛠️ Tecnologias e Ferramental

* **Linguagem:** JavaScript (Node.js 18+)
* **Framework:** Express 5
* **Gerenciador de Dependências:** npm
* **Autenticação:** [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT com expiração de 1h)
* **Hash de Senhas:** [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* **Documentação & Especificação OpenAPI:** [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) + [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
* **Persistência:** arquivo local `database.txt` (JSON), criado automaticamente na primeira execução
* **Padrão de Arquitetura:** Camadas (Route $\rightarrow$ Middleware $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ Repository)

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado no ambiente:

* [Git](https://git-scm.com/)
* [Node.js 18 ou superior](https://nodejs.org/) (inclui o npm)

---

## 🚀 Passo a Passo: Clonar e Rodar Localmente

Siga as instruções sequenciais no terminal:

### 1. Clonar o Repositório
```bash
git clone https://github.com/luanafs2811/livraria-api-aula05.git
cd livraria-api-aula05
```

### 2. Instalar as Dependências do Projeto
```bash
npm install
```

### 3. (Opcional) Configurar a Chave do JWT
Por padrão a API usa a chave `livraria-segredo`. Para definir outra, configure a variável de ambiente `JWT_SECRET` antes de iniciar:

* **Linux / macOS / Git Bash:**
  ```bash
  export JWT_SECRET=minha-chave-secreta
  ```
* **Windows (PowerShell):**
  ```powershell
  $env:JWT_SECRET="minha-chave-secreta"
  ```

### 4. Iniciar o Servidor
```bash
npm start
```

O terminal exibirá a confirmação de inicialização:
```text
Livraria API rodando em http://localhost:3000
```

> **Atenção:** Na primeira execução é criado o arquivo `database.txt` na raiz do projeto com os dados iniciais. Para restaurar os dados padrão, basta apagar esse arquivo e reiniciar o servidor.

---

## 📖 Acessando a Documentação da API

Com o servidor em execução, abra o navegador e utilize as URLs abaixo:

* **Interface Visual Interativa (Swagger UI):**
  [http://localhost:3000/docs/api](http://localhost:3000/docs/api)
* **Especificação OpenAPI Raw (JSON):**
  [http://localhost:3000/docs/api.json](http://localhost:3000/docs/api.json)

> Para testar rotas protegidas no Swagger UI, faça login em `POST /api/v1/auth/login`, copie o `token` retornado, clique em **"Authorize"** e cole o token.

---

## 👥 Usuários de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| `ADMIN` | `admin@livraria.com` | `admin123` |
| `USER`  | `leitor@gmail.com` | `leitor123` |

---

## 🔐 Matriz de Permissões

| Método | Rota | Acesso |
|--------|------|--------|
| `POST` | `/api/v1/auth/register` | Público |
| `POST` | `/api/v1/auth/login` | Público |
| `GET`  | `/api/v1/livros` | Público |
| `GET`  | `/api/v1/livros/:id` | Público |
| `POST` | `/api/v1/livros` | `ADMIN` |
| `POST` | `/api/v1/livros/:id/comentarios` | Autenticado (`USER` ou `ADMIN`) |
| `GET`  | `/api/v1/autores` | Público |
| `POST` | `/api/v1/autores` | `ADMIN` |

---

## 🧪 Roteiro de Teste dos Endpoints

Você pode testar as rotas diretamente pelo botão **"Try it out"** na documentação interativa ou via ferramentas como Postman, Insomnia ou cURL:

### 1. Cadastrar Usuário
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/v1/auth/register`
* **Headers:** `Content-Type: application/json`
* **Payload:**
  ```json
  {
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "senha": "senha123"
  }
  ```
* **Status Esperado:** `201 Created` (o usuário é criado com perfil `USER` e a senha não é retornada).
* *(Repetindo o mesmo e-mail, o retorno esperado será `409 Conflict`).*

### 2. Login (Obter Token JWT)
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/v1/auth/login`
* **Headers:** `Content-Type: application/json`
* **Payload:**
  ```json
  {
    "email": "admin@livraria.com",
    "senha": "admin123"
  }
  ```
* **Status Esperado:** `200 OK` (retorna os dados do usuário e o `token`).
* *(Com senha incorreta, o retorno esperado será `401 Unauthorized`).*

### 3. Listar Livros
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/v1/livros`
* **Status Esperado:** `200 OK`

### 4. Consultar Livro Específico
* **Método:** `GET`
* **URL:** `http://localhost:3000/api/v1/livros/1`
* **Status Esperado:** `200 OK`
* *(Caso informe um ID inexistente, como `/999`, o retorno esperado será `404 Not Found`).*

### 5. Cadastrar Livro (ADMIN)
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/v1/livros`
* **Headers:** `Content-Type: application/json` e `Authorization: Bearer <token_do_admin>`
* **Payload:**
  ```json
  {
    "titulo": "Memórias Póstumas de Brás Cubas",
    "ano": 1881,
    "autor_id": 1
  }
  ```
* **Status Esperado:** `201 Created`

### 6. Teste de Controle de Acesso (RBAC)
* **Sem token:** repetir o teste 5 sem o header `Authorization` → `401 Unauthorized`.
* **Com token de USER:** repetir o teste 5 com o token do `leitor@gmail.com` → `403 Forbidden`.

### 7. Comentar Livro (Usuário Autenticado)
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/v1/livros/1/comentarios`
* **Headers:** `Content-Type: application/json` e `Authorization: Bearer <token>`
* **Payload:**
  ```json
  {
    "texto": "Leitura excelente!"
  }
  ```
* **Status Esperado:** `201 Created`

### 8. Cadastrar Autor (ADMIN)
* **Método:** `POST`
* **URL:** `http://localhost:3000/api/v1/autores`
* **Headers:** `Content-Type: application/json` e `Authorization: Bearer <token_do_admin>`
* **Payload:**
  ```json
  {
    "nome": "Clarice Lispector",
    "nacionalidade": "Brasileira"
  }
  ```
* **Status Esperado:** `201 Created`

---

## 🖥️ Interface de Teste (Front-end)

O arquivo `index.html` na raiz do projeto é uma interface simples para testar login, cadastro de livros (ADMIN) e comentários. Com o servidor rodando, basta abrir o arquivo no navegador.

---

## 🏛️ Estrutura Arquitetural do Código

```text
controllers/
├── AuthController.js        # Entrada HTTP de cadastro e login
├── AutorController.js       # Entrada HTTP de autores
└── LivroController.js       # Entrada HTTP de livros e comentários
docs/
└── swagger.js               # Configuração OpenAPI 3.0 (schemas, segurança Bearer JWT)
middlewares/
├── authMiddleware.js        # Validação do token JWT e verificação de perfil (RBAC)
└── errorMiddleware.js       # Tratamento global de erros
repositories/
└── LivrariaRepository.js    # Isolamento da camada de dados / persistência em database.txt
routes/
├── authRoutes.js            # /api/v1/auth  (anotações @openapi)
├── autorRoutes.js           # /api/v1/autores
└── livroRoutes.js           # /api/v1/livros
services/
├── AuthService.js           # Regras de cadastro, hash bcrypt e emissão do JWT
├── AutorService.js          # Regras de negócio de autores
└── LivroService.js          # Regras de negócio de livros e comentários
index.html                   # Interface de teste
server.js                    # Inicialização, rotas versionadas (/api/v1) e Swagger UI
```

---

## 👩‍💻 Autoria

* **Aluna:** Luana Freitas
* **Docente:** Prof. Me. Luiz Martins
* **Instituição:** Universidade Evangélica de Goiás (UniEVANGÉLICA)
* **Disciplina:** Desenvolvimento de API Back-End
