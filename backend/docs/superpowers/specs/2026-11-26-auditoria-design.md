# Auditoria encadeada — design

Data: 2026-11-26

## Intenção

Registrar automaticamente operações sensíveis em uma cadeia de blocos com SHA-256, permitir que o administrador consulte os registros e verificar a integridade da cadeia em uma interface web separada do frontend real.

## Escopo

Operações registradas:

| Área | Operações |
| --- | --- |
| Atividades | criação, edição, desativação (tratada como exclusão lógica) |
| Usuários | cadastro de aluno, cadastro de administrador, edição do próprio aluno |
| Professores | criação pela escola, edição |
| Escolas | cadastro |
| Loja | compra de item |

Não entram: login, logout, respostas de atividades, avaliações, PvP, amizades, módulos, conquistas.

Exclusão física de usuário, professor e escola não existe no sistema e não será criada. A única exclusão registrada é a desativação de atividade (`ativo = false`).

## Decisões

- Log em controller, após a operação de negócio ter sucesso. O controller conhece o ator autenticado, o ID retornado e os dados da requisição. Um middleware HTTP genérico não teria o ID da entidade criada nem o significado da ação.
- Falha ao gravar auditoria não desfaz a operação já concluída; o erro vai para `stderr`. Isso evita transformar uma compra concluída em erro HTTP por falha secundária. Limite conhecido: em falha rara de banco, a operação fica sem log.
- Tabela própria `log_auditoria`, fora do schema original, criada por migration.
- Cadeia global única, sem separar por entidade.
- Primeiro bloco usa hash anterior igual a 64 zeros.
- Hash atual cobre: data/hora ISO, autor, ação, entidade, id da entidade, detalhes e hash anterior.
- Nome do autor é copiado para o bloco; o log sobrevive a mudanças cadastrais.
- Nenhum endpoint altera ou apaga logs. A única forma de adulterar é acesso direto ao banco, usado de propósito no script de demonstração.

## Estrutura

Migration `008-cria-log-auditoria.js` e model `LogAuditoria`:

- `id_log` inteiro, chave primária
- `data_hora` data com milissegundos
- `id_usuario` inteiro, nulo para operação sem ator
- `usuario_nome` texto
- `acao`: `inclusao`, `alteracao`, `exclusao`, `compra`
- `entidade`: `usuario`, `professor`, `escola`, `atividade`, `compra`
- `entidade_id` texto, nulo quando não se aplica
- `detalhes` texto JSON
- `hash_anterior` e `hash_atual`: 64 caracteres hexadecimais

`AuditoriaService`:

- `registrar(autor, acao, entidade, entidade_id, detalhes)`: serializa gravações em uma fila em memória, lê o último bloco, calcula o hash e insere.
- `listar()`: blocos em ordem crescente, com detalhes convertidos para objeto.
- `verificar()`: percorre a cadeia e devolve `{ integra, total, problemas }`. Confere hash anterior do primeiro bloco, hash atual recalculado e encadeamento entre blocos consecutivos.
- `calcularHash(bloco)`: SHA-256 sobre JSON canônico com chaves em ordem fixa.

API, somente administrador:

- `GET /api/auditoria`: lista blocos.
- `GET /api/auditoria/verificar`: valida a cadeia e aponta os blocos problemáticos.

Frontend:

- Arquivos estáticos em `public/auditoria/`, servidos pelo backend em `/auditoria`.
- Tela de login chama `POST /api/auth/login` e recusa perfil diferente de administrador.
- Token fica em `sessionStorage`.
- Lista mostra data/hora, responsável, ação, entidade, detalhes, hash anterior e hash atual.
- Botão de verificação pinta a cadeia de verde ou marca em vermelho os blocos apontados pela API.
- Página sem token não carrega dados; as APIs continuam sendo a barreira real de autorização.

Demonstração:

- `npm run auditoria:adulterar -- <id_log>` altera diretamente os detalhes de um bloco no banco.
- O comando imprime o antes e o depois.
- Ao clicar em verificar, a tela mostra o bloco adulterado como inválido.
- Não existe endpoint de adulteração, para não criar uma porta de escrita na auditoria.

## Rastreamento por operação

| Operação | Ator | Entidade | Detalhes |
| --- | --- | --- | --- |
| Cadastro de aluno | o próprio aluno | `usuario` | id, nome, e-mail, tipo |
| Cadastro de administrador | administrador autenticado | `usuario` | id, nome, e-mail, tipo |
| Edição do aluno | o próprio aluno | `usuario` | campos alterados, sem senha |
| Criação de escola | a própria escola | `escola` | id, nome, e-mail |
| Criação de professor | escola autenticada | `professor` | id, nome, e-mail, escola |
| Edição de professor | quem editou | `professor` | campos alterados, sem senha |
| Criação de atividade | professor | `atividade` | id, nome, tipo, nível |
| Edição de atividade | professor | `atividade` | id, campos alterados |
| Desativação de atividade | professor | `atividade` | id, nome, `ativo: false` |
| Compra | aluno | `compra` | item, preço, moedas restantes |

`dt_nasc` e senha nunca entram nos detalhes.

## Testes

- Cadeia válida: hashes de 64 hex, primeiro hash anterior zerado, encadeamento correto.
- Verificação retorna íntegra em cadeia recém-criada.
- Adulteração direta de um bloco faz a verificação apontar o bloco.
- Todas as áreas geram log: aluno, escola, professor, atividade, compra.
- Rotas de auditoria rejeitam aluno e aceitam administrador.
- Página `/auditoria` é servida pelo backend.

## Não objetivos

- Assinatura digital ou PKI.
- Persistência externa ou imutável.
- Paginação, filtros e exportação.
- Exclusão física de usuários, professores e escolas.
- Log de leitura, login ou logout.
