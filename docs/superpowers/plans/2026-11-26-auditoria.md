# Auditoria Encadeada Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Registrar operações sensíveis em uma cadeia SHA-256, expor consulta e verificação para administradores e servir uma tela separada de auditoria.

**Architecture:** Migration e model próprios para `log_auditoria`. Um `AuditoriaService` serializa gravações em fila, encadeia hashes e valida a cadeia. Controllers registram o fato de negócio após o sucesso. Rotas administrativas alimentam uma página estática servida pelo Express.

**Tech Stack:** Node.js, Express, Sequelize, SQLite/MySQL, Jest, Supertest, HTML/CSS/JS sem build.

**Spec:** `docs/superpowers/specs/2026-11-26-auditoria-design.md`

## Global Constraints

- Não usar `lock: true`; SQLite não suporta.
- Senhas, hashes de senha e tokens nunca entram em log.
- Rotas de auditoria exigem `administrador`.
- Nenhum endpoint altera ou apaga blocos.
- Ações: `inclusao`, `alteracao`, `exclusao`, `compra`.
- Entidades: `usuario`, `professor`, `escola`, `atividade`, `compra`.
- Primeiro bloco usa hash anterior `'0'.repeat(64)`.
- Hash atual é SHA-256 hexadecimal de 64 caracteres.
- Falha de auditoria não desfaz operação já concluída; registrar erro em `stderr`.
- Commits em português.

## Review Focus

- Duas requisições simultâneas não podem criar blocos com o mesmo hash anterior; teste com `Promise.all`.
- Data relida do banco deve gerar o mesmo hash; validação após nova consulta cobre isso.
- Campos sensíveis não podem vazar para `detalhes`; teste com `senha`.
- Aluno não pode ler nem verificar a cadeia; teste 401 e 403.
- Adulteração direta de um bloco deve ser apontada; teste altera `detalhes` sem atualizar hash.

---

### Task 1: Armazenamento e cadeia

**Files:**
- Create: `database/migrations/008-cria-log-auditoria.js`
- Create: `src/models/LogAuditoria.js`
- Modify: `src/models/index.js`
- Create: `src/services/AuditoriaService.js`
- Test: `tests/auditoria.test.js`

**Interfaces:**
- Produces: `AuditoriaService.registrar(autor, acao, entidade, entidade_id, detalhes) -> Promise<bloco>`
- Produces: `AuditoriaService.listar() -> Promise<bloco[]>`
- Produces: `AuditoriaService.verificar() -> Promise<{ integra, total, problemas }>`
- Produces: model `LogAuditoria`
- `autor`: `{ id_usuario, nome }` ou `{ id_usuario }` ou `null`.

- [ ] **Step 1: Write the failing test**

`tests/auditoria.test.js`:

```js
const { LogAuditoria } = require('../src/models');
const AuditoriaService = require('../src/services/AuditoriaService');
const { prepararBanco, fecharBanco } = require('./helpers/banco');

beforeAll(prepararBanco);
afterAll(fecharBanco);

const ZEROS = '0'.repeat(64);

function autor(nome = 'Sistema') {
  return { id_usuario: null, nome };
}

test('encadeia blocos com SHA-256 e valida a cadeia', async () => {
  const primeiro = await AuditoriaService.registrar(autor(), 'inclusao', 'teste', 1, { nome: 'A' });
  const segundo = await AuditoriaService.registrar(autor(), 'alteracao', 'teste', 1, { nome: 'B' });
  const terceiro = await AuditoriaService.registrar(autor(), 'exclusao', 'teste', 1, null);

  expect(primeiro.hash_anterior).toBe(ZEROS);
  expect(primeiro.hash_atual).toMatch(/^[a-f0-9]{64}$/);
  expect(segundo.hash_anterior).toBe(primeiro.hash_atual);
  expect(terceiro.hash_anterior).toBe(segundo.hash_atual);

  const resultado = await AuditoriaService.verificar();
  expect(resultado).toMatchObject({ integra: true, total: 3, problemas: [] });
});

test('serializa gravações simultâneas sem ramificar a cadeia', async () => {
  await Promise.all(
    Array.from({ length: 10 }, (_, indice) =>
      AuditoriaService.registrar(autor(), 'inclusao', 'teste', indice, { indice })
    )
  );

  const blocos = await AuditoriaService.listar();
  for (let indice = 1; indice < blocos.length; indice += 1) {
    expect(blocos[indice].hash_anterior).toBe(blocos[indice - 1].hash_atual);
  }
  expect((await AuditoriaService.verificar()).integra).toBe(true);
});

test('remove campos sensíveis dos detalhes', async () => {
  const bloco = await AuditoriaService.registrar(
    autor(),
    'inclusao',
    'usuario',
    99,
    { nome: 'Teste', senha: 'segredo', token: 'abc' }
  );

  expect(bloco.detalhes).not.toContain('segredo');
  expect(bloco.detalhes).not.toContain('abc');
});

test('detecta adulteração direta de um bloco', async () => {
  const blocos = await AuditoriaService.listar();
  const alvo = blocos[1];

  await LogAuditoria.update(
    { detalhes: '{"nome":"ADULTERADO"}' },
    { where: { id_log: alvo.id_log } }
  );

  const resultado = await AuditoriaService.verificar();
  expect(resultado.integra).toBe(false);
  expect(resultado.problemas.some((problema) => problema.id_log === alvo.id_log)).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/auditoria.test.js --runInBand`
Expected: FAIL, `Cannot find module '../src/services/AuditoriaService'`.

- [ ] **Step 3: Create migration and model**

`database/migrations/008-cria-log-auditoria.js` creates table `log_auditoria` with `id_log` autoincrement PK, `data_hora` `DataTypes.DATE(3)` not null, `id_usuario` INTEGER null, `usuario_nome` STRING(150) not null, `acao` STRING(20) not null, `entidade` STRING(20) not null, `entidade_id` STRING(50) null, `detalhes` TEXT null, `hash_anterior` STRING(64) not null, `hash_atual` STRING(64) not null. `down` drops the table.

`src/models/LogAuditoria.js` mirrors the migration with `timestamps: false`, `tableName: 'log_auditoria'`.

`src/models/index.js` requires `LogAuditoria` and exports it.

- [ ] **Step 4: Implement `AuditoriaService`**

`src/services/AuditoriaService.js`:

- `HASH_INICIAL = '0'.repeat(64)`.
- `limpar(dados)` removes `senha`, `token` and `authorization` recursively.
- `calcularHash(bloco)` uses `JSON.stringify` with fixed key order: `data_hora`, `id_usuario`, `usuario_nome`, `acao`, `entidade`, `entidade_id`, `detalhes`, `hash_anterior`. Date becomes `toISOString()`.
- `registrar` resolves `usuario_nome` with `Usuario.findByPk` when absent, serializes through a module-level promise queue, and inside `sequelize.transaction` reads the last block, computes and inserts the new one. `detalhes` is stored as a JSON string and the created block is returned with that string. `entidade_id` is normalized to string or `null`.
- `listar` returns blocks ascending with `detalhes` parsed back to object, falling back to the raw string.
- `verificar` loads all blocks ascending, checks first `hash_anterior` against `HASH_INICIAL`, recomputes each `hash_atual`, and checks each `hash_anterior` against the previous stored `hash_atual`. Problemas carry `{ id_log, motivo }`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest tests/auditoria.test.js --runInBand`
Expected: PASS, 4 tests.

- [ ] **Step 6: Run full suite and commit**

Run: `npm test`
Expected: all suites pass.

```bash
git add database/migrations/008-cria-log-auditoria.js src/models/LogAuditoria.js src/models/index.js src/services/AuditoriaService.js tests/auditoria.test.js
git commit -m "feat: cria cadeia de auditoria com sha-256"
```

---

### Task 2: Registrar operações nos controllers

**Files:**
- Modify: `src/controllers/AlunoController.js`
- Modify: `src/controllers/AuthController.js`
- Modify: `src/controllers/EscolaController.js`
- Modify: `src/controllers/ProfessorController.js`
- Modify: `src/controllers/AtividadeController.js`
- Modify: `src/controllers/LojaController.js`
- Create: `src/utils/auditoria.js`
- Test: `tests/auditoria-registros.test.js`

**Interfaces:**
- Consumes: `AuditoriaService.registrar(autor, acao, entidade, entidade_id, detalhes)`.
- Produces: logs para as cinco áreas.
- Produces: `registrarAuditoria(autor, acao, entidade, entidade_id, detalhes) -> Promise<void>` em `src/utils/auditoria.js`; captura erro com `console.error` para não quebrar a operação concluída.

- [ ] **Step 1: Write the failing test**

`tests/auditoria-registros.test.js` prepares admin bootstrap directly with `Usuario` + `Administrador`, logs in, then exercises APIs in this order:

```js
// bootstrap
const admin = await Usuario.create({ nome: 'Admin Auditoria', dt_nasc: '1990-01-01', email: 'admin-auditoria@teste.com', senha: await bcrypt.hash('senha123', 4) });
await Administrador.create({ id_usuario: admin.id_usuario });
const tokenAdmin = (await request(app).post('/api/auth/login').send({ email: 'admin-auditoria@teste.com', senha: 'senha123' })).body.token;

// cadastro de administrador
await request(app).post('/api/administradores').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Admin Dois', dt_nasc: '1990-01-01', email: 'admin2@teste.com', senha: 'senha123' });

// escola e professor
await request(app).post('/api/escolas').send({ nome: 'Escola Auditoria', dt_nasc: '2000-01-01', email: 'escola-auditoria@teste.com', senha: 'senha123' });
const tokenEscola = (await request(app).post('/api/auth/login').send({ email: 'escola-auditoria@teste.com', senha: 'senha123' })).body.token;
await request(app).post('/api/escolas/professores').set('Authorization', `Bearer ${tokenEscola}`).send({ nome: 'Professor Auditoria', dt_nasc: '1985-01-01', email: 'prof-auditoria@teste.com', senha: 'senha123' });
const loginProfessor = (await request(app).post('/api/auth/login').send({ email: 'prof-auditoria@teste.com', senha: 'senha123' })).body;

// aluno e edição
await request(app).post('/api/alunos').send({ nome: 'Aluno Auditoria', dt_nasc: '2008-01-01', email: 'aluno-auditoria@teste.com', senha: 'senha123' });
const loginAluno = (await request(app).post('/api/auth/login').send({ email: 'aluno-auditoria@teste.com', senha: 'senha123' })).body;
await request(app).put('/api/alunos/me').set('Authorization', `Bearer ${loginAluno.token}`).send({ nome: 'Aluno Editado' });

// professor edita a si mesmo
await request(app).put(`/api/professores/${loginProfessor.usuario.id_usuario}`).set('Authorization', `Bearer ${tokenEscola}`).send({ nome: 'Professor Editado' });

// atividade: criar, editar, desativar
const atividade = await request(app).post('/api/atividades').set('Authorization', `Bearer ${loginProfessor.token}`).send({ nome_atividade: 'Atividade Auditoria', pergunta: 'Pergunta?', id_nivel_ensino: 1, tipo: 'multipla_escolha', alternativas: [{ resposta: 'A', validade: true }, { resposta: 'B', validade: false }] });
await request(app).put(`/api/atividades/${atividade.body.id_atividade}`).set('Authorization', `Bearer ${loginProfessor.token}`).send({ nome_atividade: 'Atividade Editada' });
await request(app).patch(`/api/atividades/${atividade.body.id_atividade}/status`).set('Authorization', `Bearer ${loginProfessor.token}`).send({ ativo: false });

// compra
const item = await request(app).post('/api/loja/itens').set('Authorization', `Bearer ${tokenAdmin}`).send({ nome: 'Item Auditoria', categoria: 'avatar', preco: 10 });
await Aluno.update({ moedas: 50 }, { where: { id_usuario: loginAluno.usuario.id_usuario } });
await request(app).post(`/api/loja/comprar/${item.body.id_item_loja}`).set('Authorization', `Bearer ${loginAluno.token}`).send({});
```

Assertions:

```js
const registros = await AuditoriaService.listar();
const resumo = registros.map((registro) => `${registro.entidade}:${registro.acao}`);
expect(resumo).toEqual(expect.arrayContaining([
  'usuario:inclusao', 'usuario:alteracao',
  'escola:inclusao',
  'professor:inclusao', 'professor:alteracao',
  'atividade:inclusao', 'atividade:alteracao', 'atividade:exclusao',
  'compra:compra'
]));
expect(JSON.stringify(registros)).not.toContain('senha123');
expect((await AuditoriaService.verificar()).integra).toBe(true);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/auditoria-registros.test.js --runInBand`
Expected: FAIL because no logs exist.

- [ ] **Step 3: Add hooks to controllers**

In each successful controller path, call the helper with the actor and safe details:

- `AlunoController.criar`: `usuario:inclusao`, actor `{ id_usuario: aluno.id_usuario, nome: aluno.nome }`, details `{ id_usuario, nome, email, tipo: 'aluno' }`.
- `AuthController.cadastrarAdministrador`: `usuario:inclusao`, actor `req.usuario`, details `{ id_usuario, nome, email, tipo: 'administrador' }`.
- `AlunoController.atualizarMe`: `usuario:alteracao`, actor `req.usuario`, details only `nome`, `email`, `dt_nasc` present in `req.body`.
- `EscolaController.criar`: `escola:inclusao`, actor `{ id_usuario: escola.id_usuario, nome: escola.nome }`, details `{ id_usuario, id_escola, nome, email }`.
- `EscolaController.criarProfessor`: `professor:inclusao`, actor `req.usuario`, details `{ id_usuario, nome, email, id_escola }`.
- `ProfessorController.atualizar`: `professor:alteracao`, actor `req.usuario`, details only `nome`, `email`, `dt_nasc` present in `req.body`.
- `AtividadeController.criar`: `atividade:inclusao`, actor `req.usuario`, details `{ id_atividade, nome_atividade, tipo, id_nivel_ensino }`.
- `AtividadeController.atualizar`: `atividade:alteracao`, actor `req.usuario`, details `{ id_atividade }` plus `nome_atividade`, `tipo`, `id_nivel_ensino` when present.
- `AtividadeController.alterarStatus`: `atividade:exclusao` when `ativo === false`, `atividade:alteracao` otherwise; details `{ id_atividade, nome_atividade, ativo }`.
- `LojaController.comprar`: `compra:compra`, actor `req.usuario`, entity id `Number(req.params.id)`, details `{ item, preco, moedas }` from the result.

The shared helper in `src/utils/auditoria.js`:

```js
async function registrarAuditoria(autor, acao, entidade, entidadeId, detalhes) {
  try {
    await AuditoriaService.registrar(autor, acao, entidade, entidadeId, detalhes);
  } catch (erro) {
    console.error('Falha ao registrar auditoria:', erro.message);
  }
}
```

Do not pass `req.body` whole and do not pass password hashes.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest tests/auditoria-registros.test.js --runInBand`
Expected: PASS.

- [ ] **Step 5: Run full suite and commit**

Run: `npm test`
Expected: all suites pass.

```bash
git add src/controllers src/utils/auditoria.js tests/auditoria-registros.test.js
git commit -m "feat: registra operacoes na auditoria"
```

---

### Task 3: API administrativa

**Files:**
- Create: `src/controllers/AuditoriaController.js`
- Create: `src/routes/auditoriaRoutes.js`
- Modify: `src/routes/index.js`
- Test: `tests/auditoria-api.test.js`

**Interfaces:**
- Consumes: `AuditoriaService.listar()`, `AuditoriaService.verificar()`.
- Produces: `GET /api/auditoria` and `GET /api/auditoria/verificar`.

- [ ] **Step 1: Write the failing test**

`tests/auditoria-api.test.js` prepares the DB, creates one admin directly and one aluno via API, logs both in, registers one audit block through the service, then asserts:

```js
// sem token
expect((await request(app).get('/api/auditoria')).status).toBe(401);
// aluno
expect((await request(app).get('/api/auditoria').set('Authorization', `Bearer ${tokenAluno}`)).status).toBe(403);
expect((await request(app).get('/api/auditoria/verificar').set('Authorization', `Bearer ${tokenAluno}`)).status).toBe(403);
// admin
const lista = await request(app).get('/api/auditoria').set('Authorization', `Bearer ${tokenAdmin}`);
expect(lista.status).toBe(200);
expect(lista.body[0].hash_atual).toMatch(/^[a-f0-9]{64}$/);
const verificacao = await request(app).get('/api/auditoria/verificar').set('Authorization', `Bearer ${tokenAdmin}`);
expect(verificacao.body).toMatchObject({ integra: true, total: lista.body.length });
```

After tampering one row with `LogAuditoria.update`, assert `integra: false` and the problem includes the row id.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/auditoria-api.test.js --runInBand`
Expected: FAIL with 404.

- [ ] **Step 3: Implement controller and routes**

`AuditoriaController.listar` and `.verificar` return JSON via `responderErro`. `auditoriaRoutes` calls `router.use(authMiddleware, permitir('administrador'))` then defines both GETs. Mount in `src/routes/index.js` as `/auditoria`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest tests/auditoria-api.test.js --runInBand`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/controllers/AuditoriaController.js src/routes/auditoriaRoutes.js src/routes/index.js tests/auditoria-api.test.js
git commit -m "feat: expoe consulta e verificacao da auditoria"
```

---

### Task 4: Frontend e demonstração

**Files:**
- Create: `public/auditoria/index.html`
- Create: `public/auditoria/styles.css`
- Create: `public/auditoria/app.js`
- Modify: `src/app.js`
- Create: `scripts/adulterar-auditoria.js`
- Modify: `package.json`
- Modify: `docs/ROTAS.md`
- Modify: `README.md`
- Test: `tests/auditoria-api.test.js`

**Interfaces:**
- Consumes: login, `GET /api/auditoria`, `GET /api/auditoria/verificar`.
- Produces: página `/auditoria` e script `npm run auditoria:adulterar`.

- [ ] **Step 1: Write the failing test**

Append to `tests/auditoria-api.test.js`:

```js
test('serve a pagina separada de auditoria', async () => {
  const resposta = await request(app).get('/auditoria/');
  expect(resposta.status).toBe(200);
  expect(resposta.text).toContain('Auditoria');
});
```

Run: `npx jest tests/auditoria-api.test.js --runInBand`
Expected: FAIL with 404.

- [ ] **Step 2: Create the frontend**

`src/app.js` adds:

```js
const path = require('path');
app.use('/auditoria', express.static(path.join(__dirname, '..', 'public', 'auditoria')));
```

before the 404 handler.

`public/auditoria/index.html` has a login panel (e-mail, senha, botão) and a main panel hidden until login. Main panel has total, status, refresh, verify, logout buttons and the block list.

`public/auditoria/app.js`:

- Stores token under `token_auditoria` in `sessionStorage`.
- Login rejects `usuario.tipo !== 'administrador'` and clears the token.
- Loads `/api/auditoria` with `Authorization`.
- Renders blocks with `textContent` only; never `innerHTML` with API data.
- Shows date with `toLocaleString('pt-BR')`, responsible, action label, entity/id, details JSON, previous hash and current hash.
- Verify calls the endpoint, shows a green/red banner and marks problem blocks with a CSS class.
- Logout clears token and returns to login.

`public/auditoria/styles.css` is plain CSS, readable without dependencies.

- [ ] **Step 3: Create tamper script and npm alias**

`scripts/adulterar-auditoria.js` reads `process.argv[2]` as `id_log`, loads the block, appends ` [ADULTERADO]` to `detalhes`, saves, prints before/after and the verification hint, then closes Sequelize. On missing id or missing block, prints usage and exits non-zero.

`package.json` adds:

```json
"auditoria:adulterar": "node scripts/adulterar-auditoria.js"
```

- [ ] **Step 4: Document**

`docs/ROTAS.md` adds both audit routes in the existing INPUT/Output style, with administrator permission and example responses.

`README.md` adds an "Auditoria" section: table meaning, chain rule, `/auditoria` access, integrity check, and demo commands:

```bash
npm run auditoria:adulterar -- 1
```

Explain that adulterating changes the stored content without recalculating `hash_atual`, so verification marks the block.

- [ ] **Step 5: Run tests and commit**

Run: `npm test`
Expected: all suites pass, including the page smoke test.

```bash
git add public/auditoria src/app.js scripts/adulterar-auditoria.js package.json docs/ROTAS.md README.md tests/auditoria-api.test.js
git commit -m "feat: adiciona painel de auditoria e demonstracao de adulteracao"
```

---

### Task 5: Revisão final

**Files:**
- Modify: `docs/superpowers/specs/2026-11-26-auditoria-design.md` only if implementation reveals a decision change.
- Modify: `.superpowers/sdd/plano/progress.md`.

- [ ] **Step 1: Run full suite**

Run: `npm test`
Expected: all suites pass.

- [ ] **Step 2: Manual demo**

Run `npm run db:migrate`, start `npm start`, open `http://localhost:3000/auditoria`, log in as administrator, verify the chain, run `npm run auditoria:adulterar -- <id>`, verify again, confirm the block is marked invalid.

- [ ] **Step 3: Commit**

```bash
git add .superpowers/sdd/plano/progress.md
git commit -m "chore: atualiza ledger da auditoria"
```
