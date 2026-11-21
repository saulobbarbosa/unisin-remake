# Unisin Remake — Backend

Backend da plataforma de ensino gamificada, construído com Node.js, Express, Sequelize e SQLite. A camada de banco usa Sequelize e variáveis de ambiente, permitindo trocar para MySQL sem alterar as regras de negócio.

## Tecnologias

- Node.js
- Express
- Sequelize
- SQLite (padrão) ou MySQL
- JWT
- Bcrypt
- Socket.IO
- Jest e Supertest

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Ajuste o segredo do JWT e as credenciais do administrador antes de usar em produção.

## Banco de dados

O projeto usa SQLite por padrão:

```env
DB_DIALECT=sqlite
DB_STORAGE=./database/database.sqlite
```

Para MySQL:

```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=plataforma_ensino
DB_USER=root
DB_PASSWORD=
```

Execute as migrations:

```bash
npm run db:migrate
```

Crie o primeiro administrador com os dados de `ADMIN_*` do `.env`:

```bash
npm run db:seed
```

## Execução

```bash
npm start
```

Modo de desenvolvimento com reinício automático:

```bash
npm run dev
```

O servidor inicia em `http://localhost:3000`. As rotas usam o prefixo `/api`.

## Testes

```bash
npm test
```

Os testes usam um banco SQLite em memória, separado do banco de desenvolvimento.

## Autenticação

Faça login em `POST /api/auth/login` e envie o token nas rotas protegidas:

```text
Authorization: Bearer <token>
```

Perfis disponíveis: `aluno`, `professor`, `escola` e `administrador`.

## Estrutura

```text
src/
├── config/        configuração de banco, JWT e regras centralizadas
├── models/        tabelas e associações do Sequelize
├── services/      regras de negócio
├── controllers/   entrada e saída HTTP
├── routes/        endpoints e permissões
├── middlewares/   autenticação e autorização
├── app.js         aplicação Express
├── server.js      servidor HTTP + Socket.IO
└── socket.js      eventos em tempo real do PvP

database/
├── migrations/    criação e evolução das tabelas
├── migrate.js     executor de migrations
└── seed.js        criação do administrador inicial

docs/ROTAS.md      documentação completa das rotas
tests/             testes de integração com Jest e Supertest
```

## Regras configuráveis

Os valores de recompensa, penalidade e avaliação ficam em `src/config/business.js` e podem ser ajustados pelo `.env`:

```env
RECOMPENSA_ATIVIDADE=10
PENALIDADE_ATIVIDADE=15
RECOMPENSA_PVP=20

AVALIACAO_QUANTIDADE_QUESTOES=10
AVALIACAO_LIMITE_NIVEL_2=50
AVALIACAO_LIMITE_NIVEL_3=80

PVP_QUANTIDADE_QUESTOES=5
```

## Ranking

`GET /api/ranking` retorna os 5 primeiros alunos e também o aluno autenticado, com a posição real no ranking. A ordenação usa `moedas` em ordem decrescente, depois `vitorias_pvp` e `id_usuario` como desempate.

Formato:

```json
[
  { "posicao": 1, "nome": "João" },
  { "posicao": 2, "nome": "Maria" },
  { "posicao": 3, "nome": "Pedro" },
  { "posicao": 4, "nome": "Ana" },
  { "posicao": 5, "nome": "Lucas" },
  { "posicao": 730, "nome": "Nome do meu usuario" }
]
```

## PvP em tempo real

O PvP usa Socket.IO. O cliente conecta com o token JWT:

```js
const socket = io('http://localhost:3000', {
  auth: { token }
});
```

Convites, aceite e recusa usam as rotas REST documentadas em `docs/ROTAS.md`. Durante a partida, o cliente envia as respostas pelo evento `pvp:responder`; o servidor valida, calcula a pontuação e envia `pvp:resultado`.

Partidas e avaliações ficam em memória. Se o processo do servidor for encerrado, esses dados temporários são perdidos. Apenas moedas, vitórias, conquistas, compras e progresso são persistidos.

## Documentação das rotas

Todas as rotas estão documentadas em [`docs/ROTAS.md`](docs/ROTAS.md), incluindo exemplos de entrada e saída e os eventos Socket.IO do PvP.
