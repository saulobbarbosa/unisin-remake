\# Plano de Desenvolvimento — Backend da Plataforma de Ensino Gamificada



\## 1. Objetivo



Desenvolver o backend de uma plataforma de ensino gamificada utilizando \*\*Node.js, Express e SQLite\*\*, seguindo uma arquitetura organizada em:



\- Models

\- Services

\- Controllers

\- Routes



O projeto deverá utilizar SQLite inicialmente, mas sua arquitetura deverá permitir uma futura migração para MySQL com o mínimo possível de alterações no código.



O desenvolvimento deverá seguir o banco de dados revisado fornecido como referência, respeitando seus relacionamentos, campos e regras de negócio.



\*\*IMPORTANTE:\*\* Não implementar um sistema complexo de tratamento de erros neste momento. Desconsiderar, por enquanto, tratamentos personalizados, classes de exceção, middlewares globais de erros, logs avançados e mecanismos elaborados de recuperação. O objetivo inicial é implementar as funcionalidades e suas regras de negócio. Manter apenas o necessário para o funcionamento básico das operações.



\---



\## 2. Tecnologias e bibliotecas



Utilizar:



\- Node.js

\- Express

\- SQLite

\- Sequelize ORM

\- JWT para autenticação

\- Bcrypt para criptografia de senhas

\- Dotenv para variáveis de ambiente

\- Socket.IO para comunicação em tempo real, caso necessário para o PvP.



\### Banco de dados



O banco inicial deverá ser SQLite.



Utilizar Sequelize como camada de abstração entre a aplicação e o banco de dados.



A configuração deverá permitir escolher o banco por meio de variáveis de ambiente.



Exemplo:



```env

DB\_DIALECT=sqlite

DB\_STORAGE=./database/database.sqlite

```



A estrutura deverá permitir uma futura configuração semelhante a:



```env

DB\_DIALECT=mysql

DB\_HOST=localhost

DB\_PORT=3306

DB\_NAME=plataforma\_ensino

DB\_USER=root

DB\_PASSWORD=

```



Não utilizar consultas SQL específicas do SQLite diretamente nos Services.



Priorizar os métodos do Sequelize para operações de consulta, inserção, atualização, exclusão e relacionamentos.



Utilizar migrations para criação e atualização das tabelas, evitando depender exclusivamente de `sequelize.sync()`.



\*\*Importante:\*\* manter compatibilidade entre SQLite e MySQL. Caso algum recurso do banco original não tenha suporte equivalente nos dois sistemas, implementar a regra na aplicação ou utilizar uma migration específica para cada banco.



\---



\## 3. Arquitetura do projeto



Organizar o projeto da seguinte maneira:



```text

backend/

│

├── src/

│   ├── config/

│   │   ├── database.js

│   │   └── auth.js

│   │

│   ├── models/

│   │   ├── Usuario.js

│   │   ├── Administrador.js

│   │   ├── Escola.js

│   │   ├── Professor.js

│   │   ├── Aluno.js

│   │   ├── NivelEnsino.js

│   │   ├── Atividade.js

│   │   ├── Resposta.js

│   │   ├── Conteudo.js

│   │   ├── AlunoAtividade.js

│   │   ├── ModuloEnsino.js

│   │   ├── AlunoModuloEnsino.js

│   │   ├── ItemLoja.js

│   │   ├── AlunoItemLoja.js

│   │   ├── Amigos.js

│   │   ├── Conquista.js

│   │   └── AlunoConquista.js

│   │

│   ├── services/

│   │   ├── AuthService.js

│   │   ├── UsuarioService.js

│   │   ├── EscolaService.js

│   │   ├── ProfessorService.js

│   │   ├── AlunoService.js

│   │   ├── AtividadeService.js

│   │   ├── AvaliacaoService.js

│   │   ├── PvpService.js

│   │   ├── LojaService.js

│   │   ├── ConquistaService.js

│   │   ├── ModuloService.js

│   │   └── AmizadeService.js

│   │

│   ├── controllers/

│   │   ├── AuthController.js

│   │   ├── UsuarioController.js

│   │   ├── EscolaController.js

│   │   ├── ProfessorController.js

│   │   ├── AlunoController.js

│   │   ├── AtividadeController.js

│   │   ├── AvaliacaoController.js

│   │   ├── PvpController.js

│   │   ├── LojaController.js

│   │   ├── ConquistaController.js

│   │   ├── ModuloController.js

│   │   └── AmizadeController.js

│   │

│   ├── routes/

│   │   ├── authRoutes.js

│   │   ├── usuarioRoutes.js

│   │   ├── escolaRoutes.js

│   │   ├── professorRoutes.js

│   │   ├── alunoRoutes.js

│   │   ├── atividadeRoutes.js

│   │   ├── avaliacaoRoutes.js

│   │   ├── pvpRoutes.js

│   │   ├── lojaRoutes.js

│   │   ├── conquistaRoutes.js

│   │   ├── moduloRoutes.js

│   │   └── amizadeRoutes.js

│   │

│   ├── middlewares/

│   │   ├── authMiddleware.js

│   │   └── permissionMiddleware.js

│   │

│   ├── app.js

│   └── server.js

│

├── database/

│   └── migrations/

│

├── docs/

│   └── ROTAS.md

│

├── .env

├── .env.example

├── package.json

└── README.md

```



A estrutura poderá ser ajustada durante o desenvolvimento, desde que os princípios arquiteturais sejam mantidos.



\### Responsabilidades de cada camada



\*\*Models:\*\*

\- Representar as tabelas do banco.

\- Definir os campos e seus tipos.

\- Definir chaves primárias e estrangeiras.

\- Definir associações entre as tabelas.



\*\*Services:\*\*

\- Implementar as regras de negócio.

\- Realizar operações envolvendo vários Models.

\- Controlar recompensas e moedas.

\- Executar cálculos de avaliação.

\- Gerenciar compras e equipamentos.

\- Controlar as regras das partidas PvP.



\*\*Controllers:\*\*

\- Receber os dados enviados pelas requisições.

\- Chamar os Services correspondentes.

\- Retornar os resultados em JSON.



\*\*Routes:\*\*

\- Definir os endpoints.

\- Associar cada endpoint ao Controller.

\- Aplicar autenticação e autorização.



Os Controllers não devem conter regras de negócio ou consultas diretas ao banco.



\---



\## 4. Funcionalidades e regras de negócio



\### 4.1. Autenticação e usuários



Implementar:



\- Login.

\- Logout, caso seja utilizado controle de sessão ou lista de tokens revogados.

\- Cadastro de alunos.

\- Cadastro de escolas.

\- Cadastro de professores.

\- Cadastro de administradores.



Regras:



\- O cadastro de alunos poderá ser realizado pelos próprios alunos.

\- O cadastro de professores deverá ser realizado por uma escola autenticada.

\- Cada professor deverá estar vinculado a uma escola.

\- Cada usuário deverá possuir um único e-mail.

\- Senhas deverão ser armazenadas utilizando Bcrypt.

\- Utilizar JWT para identificar o usuário autenticado.

\- Implementar controle de permissões por tipo de usuário.



Tipos de usuário:



\- Aluno.

\- Professor.

\- Escola.

\- Administrador.



Não permitir que um aluno cadastre professores ou que um professor cadastre atividades em nome de outra escola.



\### 4.2. Cadastro e gerenciamento de atividades



Implementar o cadastro, edição, listagem e desativação de atividades.



Cada atividade deverá possuir:



\- Nome.

\- Pergunta.

\- Nível de ensino.

\- Professor responsável.

\- Tipo da questão.

\- Alternativas.

\- Identificação da alternativa correta.

\- Status ativo/inativo.



Tipos permitidos:



\- Múltipla escolha.

\- Verdadeiro ou falso.



Regras:



\- Somente professores autenticados poderão cadastrar atividades.

\- O professor somente poderá editar suas próprias atividades.

\- Cada atividade deverá possuir apenas uma alternativa correta.

\- As alternativas deverão possuir uma ordem.

\- O sistema deverá permitir associar conteúdos adicionais, como imagens e arquivos, utilizando a tabela `conteudo`.

\- Atividades inativas não poderão ser realizadas.

\- Não disponibilizar a identificação da alternativa correta nas consultas destinadas aos alunos.



\### 4.3. Realização de atividades



Implementar a funcionalidade para o aluno responder às atividades.



Fluxo:



1\. O aluno solicita uma atividade.

2\. O backend verifica se ela está disponível.

3\. O backend retorna a pergunta e as alternativas, sem informar a resposta correta.

4\. O aluno envia a alternativa selecionada.

5\. O backend verifica a resposta.

6\. Caso esteja correta, registra a conclusão e adiciona a recompensa fixa.

7\. Caso esteja incorreta, desconta a quantidade de moedas definida pela regra de negócio.



Regras:



\- A atividade somente será considerada concluída quando o aluno acertar.

\- Respostas incorretas não deverão gerar registros de conclusão.

\- A mesma atividade não poderá ser concluída mais de uma vez pelo mesmo aluno.

\- A recompensa deverá ser igual para todas as atividades.

\- A recompensa e a penalidade deverão ser configuráveis no backend, preferencialmente por variáveis de ambiente ou configuração centralizada.

\- O backend deverá impedir que o saldo de moedas fique negativo.

\- A verificação da resposta, a conclusão da atividade e a atualização das moedas deverão ser realizadas de maneira consistente, utilizando transação do banco quando necessário.



Não criar histórico de tentativas ou histórico de moedas.



A tabela `aluno\_has\_atividade` deverá ser utilizada somente para registrar as atividades concluídas.



\### 4.4. Avaliação de nível



Implementar uma avaliação para determinar o nível de ensino do aluno.



Fluxo:



1\. O aluno solicita uma avaliação.

2\. O backend seleciona atividades aleatórias já cadastradas.

3\. As atividades deverão respeitar os critérios de seleção definidos para a avaliação.

4\. O aluno responde às questões.

5\. O backend calcula o resultado.

6\. O backend determina o nível correspondente.

7\. O nível resultante é atualizado em `aluno.id\_nivel\_ensino`.



Regras:



\- As perguntas deverão ser obtidas da tabela `atividade`.

\- Não criar perguntas específicas para avaliações.

\- Não criar tabelas de avaliações ou histórico de avaliações.

\- Não registrar individualmente as respostas da avaliação.

\- O processamento das respostas deverá ocorrer em tempo real.

\- Armazenar somente o nível resultante.

\- Não utilizar a conclusão de uma avaliação para marcar atividades como concluídas.

\- O cálculo deverá ser implementado no `AvaliacaoService`.



O algoritmo de cálculo deverá ficar isolado no Service para permitir alterações futuras sem modificar Controllers ou Models.



\### 4.5. Sistema de amigos



Implementar:



\- Buscar alunos.

\- Enviar solicitação de amizade, se essa regra for adotada.

\- Aceitar solicitações.

\- Listar amigos.

\- Remover amigos.



A tabela `amigos` deverá armazenar os relacionamentos.



Caso sejam utilizadas solicitações pendentes, será necessário complementar a estrutura com um campo de status ou uma tabela específica.



Não permitir amizades duplicadas ou que um aluno adicione a si mesmo.



Definir no Service como será garantida a reciprocidade dos relacionamentos.



\### 4.6. Partidas PvP



Implementar partidas entre amigos com perguntas aleatórias.



Fluxo:



1\. Um aluno convida um amigo.

2\. O adversário aceita o convite.

3\. O backend inicia a partida.

4\. São selecionadas perguntas aleatórias já cadastradas.

5\. Os dois jogadores respondem às mesmas perguntas.

6\. O backend calcula os resultados em tempo real.

7\. O vencedor recebe a recompensa fixa.

8\. O total de vitórias do vencedor é incrementado.



Regras:



\- Utilizar perguntas existentes na tabela `atividade`.

\- Não criar tabelas para armazenar partidas.

\- Não armazenar perguntas sorteadas.

\- Não armazenar respostas individuais.

\- Não armazenar histórico de partidas.

\- Manter os dados temporários da partida em memória durante sua execução, utilizando Socket.IO ou outra solução apropriada.

\- Somente o servidor poderá validar respostas e calcular pontuações.

\- O cliente não poderá informar diretamente o resultado final.

\- O campo `aluno.vitorias\_pvp` deverá armazenar somente o total de vitórias.

\- A recompensa deverá ser fixa e configurada centralmente.

\- Somente partidas finalizadas e validadas poderão gerar recompensas.



Não implementar ranking histórico de partidas.



\*\*Observação:\*\* como as partidas não serão persistidas, elas poderão ser perdidas caso o processo do servidor seja encerrado durante uma partida. Essa limitação é aceitável para a primeira versão.



\### 4.7. Loja de itens



Implementar:



\- Listagem de itens disponíveis.

\- Consulta de detalhes de um item.

\- Cadastro de itens.

\- Edição de itens.

\- Desativação de itens.

\- Compra de itens.

\- Listagem de itens adquiridos pelo aluno.



Regras:



\- O aluno deverá possuir moedas suficientes para realizar uma compra.

\- O preço deverá ser consultado diretamente no banco, nunca aceitando o preço enviado pelo cliente.

\- O saldo deverá ser descontado no momento da compra.

\- Um item não poderá ser comprado novamente pelo mesmo aluno, considerando o modelo atual de inventário.

\- A compra deverá ser realizada utilizando transação do banco.

\- A tabela `aluno\_has\_item\_loja` deverá registrar a propriedade do item.

\- Não permitir compras de itens inativos.



\### 4.8. Equipar e desequipar itens



Implementar:



\- Equipar item.

\- Desequipar item.

\- Consultar itens equipados.



Regras:



\- Somente itens que pertencem ao aluno poderão ser equipados.

\- O aluno deverá possuir somente um item equipado por categoria.

\- Ao equipar outro item da mesma categoria, o anterior deverá ser desequipado.

\- A validação deverá ocorrer no Service.

\- Utilizar a coluna `equipado` da tabela `aluno\_has\_item\_loja`.



\### 4.9. Conquistas



Implementar:



\- Listar conquistas disponíveis.

\- Consultar conquistas desbloqueadas pelo aluno.

\- Cadastrar conquistas.

\- Editar conquistas.

\- Desativar conquistas.

\- Verificar requisitos.

\- Desbloquear conquistas automaticamente.



Tipos de requisitos previstos:



\- Quantidade de atividades concluídas.

\- Quantidade de vitórias PvP.

\- Quantidade de itens comprados.

\- Nível de ensino alcançado.



Regras:



\- A verificação deverá acontecer após eventos relevantes.

\- Uma conquista não poderá ser desbloqueada duas vezes pelo mesmo aluno.

\- O registro deverá ser feito em `aluno\_has\_conquista`.

\- A tabela `conquista` deverá armazenar o requisito e seu valor.

\- Não criar um sistema complexo de histórico de progresso de conquistas.



Criar um método central no `ConquistaService` para verificar as conquistas do aluno.



\### 4.10. Módulos de ensino



Implementar:



\- Listagem de módulos.

\- Cadastro de módulos.

\- Edição de módulos.

\- Associação de módulos aos níveis de ensino.

\- Associação de módulos aos alunos.

\- Consulta de progresso.

\- Atualização do status de conclusão.



Regras:



\- Um módulo poderá estar associado a diferentes níveis.

\- Um aluno poderá possuir vários módulos.

\- O progresso deverá ser armazenado na tabela `aluno\_has\_modulo\_ensino`.

\- Os status permitidos serão `nao\_iniciado`, `em\_andamento` e `concluido`.

\- Ao concluir um módulo, registrar a data de conclusão.



\---



\## 5. Configurações centralizadas



Criar um arquivo de configuração para armazenar valores utilizados nas regras de negócio.



Exemplo:



```javascript

module.exports = {

&#x20;   recompensas: {

&#x20;       atividade: 10,

&#x20;       pvp: 20

&#x20;   },



&#x20;   penalidades: {

&#x20;       atividade: 15

&#x20;   },



&#x20;   avaliacao: {

&#x20;       quantidadeQuestoes: 10

&#x20;   }

};

```



Os valores acima são exemplos iniciais e poderão ser ajustados.



Não espalhar valores fixos pelas Controllers ou Services.



\---



\## 6. Autenticação e permissões



Criar middlewares para:



\- Verificar o JWT.

\- Identificar o usuário autenticado.

\- Verificar o tipo de usuário.

\- Restringir funcionalidades de acordo com as permissões.



Exemplos:



| Funcionalidade | Permissão |

|---|---|

| Cadastrar aluno | Público |

| Cadastrar professor | Escola |

| Cadastrar atividade | Professor |

| Editar atividade própria | Professor |

| Gerenciar loja | Administrador |

| Comprar itens | Aluno |

| Equipar itens | Aluno |

| Realizar atividades | Aluno |

| Realizar avaliação | Aluno |

| Jogar PvP | Aluno |

| Gerenciar conquistas | Administrador |



A escola deverá somente cadastrar professores vinculados a ela.



\---



\## 7. Documentação obrigatória das rotas



\*\*Esta etapa é obrigatória e deve ser realizada durante o desenvolvimento.\*\*



Criar o arquivo:



`docs/ROTAS.md`



Documentar absolutamente todas as rotas implementadas no backend.



A documentação deverá seguir EXATAMENTE o seguinte modelo:



```text

/criar-turma POST:

INPUT:

{

&#x20;   "nome": "Turma 1",

&#x20;   "sla": 1

}



Output:

{

&#x20;   "resposta": "Criada com sucesso"

}

```



Não utilizar Swagger, OpenAPI ou outro formato no lugar desse modelo.



Cada rota deverá possuir:



1\. Caminho completo.

2\. Método HTTP.

3\. INPUT com um exemplo realista do JSON enviado.

4\. Output com um exemplo realista da resposta.



Para rotas que não recebem corpo JSON, informar:



```text

INPUT:

{}

```



Para rotas que recebem parâmetros na URL, apresentar o caminho com os parâmetros e informar seus valores no exemplo de INPUT.



Exemplo:



```text

/atividade/:id\_atividade GET:

INPUT:

{

&#x20;   "id\_atividade": 1

}



Output:

{

&#x20;   "id\_atividade": 1,

&#x20;   "nome\_atividade": "Matemática básica",

&#x20;   "pergunta": "Quanto é 2 + 2?",

&#x20;   "alternativas": \[

&#x20;       {

&#x20;           "id\_resposta": 1,

&#x20;           "resposta": "3"

&#x20;       },

&#x20;       {

&#x20;           "id\_resposta": 2,

&#x20;           "resposta": "4"

&#x20;       }

&#x20;   ]

}

```



Os exemplos deverão refletir os nomes reais dos campos utilizados na implementação.



Não documentar rotas que não existem e não deixar rotas implementadas sem documentação.



Manter o arquivo atualizado sempre que uma rota for criada, modificada ou removida.



\---



\## 8. Organização dos endpoints



Utilizar `/api` como prefixo geral.



Organizar os endpoints por funcionalidade.



\### Autenticação e usuários



\- POST `/api/auth/login`

\- POST `/api/auth/logout`

\- POST `/api/alunos`

\- POST `/api/escolas`

\- POST `/api/escolas/professores`

\- GET `/api/usuarios/me`



\### Alunos



\- GET `/api/alunos/me`

\- GET `/api/alunos/:id`

\- GET `/api/alunos`

\- PUT `/api/alunos/me`



\### Professores



\- GET `/api/professores`

\- GET `/api/professores/:id`

\- PUT `/api/professores/:id`



\### Atividades



\- POST `/api/atividades`

\- GET `/api/atividades`

\- GET `/api/atividades/:id`

\- PUT `/api/atividades/:id`

\- PATCH `/api/atividades/:id/status`

\- POST `/api/atividades/:id/responder`

\- GET `/api/atividades/concluidas`



\### Avaliação



\- POST `/api/avaliacoes/iniciar`

\- POST `/api/avaliacoes/finalizar`



A avaliação poderá manter as perguntas e respostas temporariamente no servidor. Não criar persistência de avaliações.



\### Amigos



\- GET `/api/amigos`

\- GET `/api/amigos/buscar`

\- POST `/api/amigos`

\- DELETE `/api/amigos/:id`



\### PvP



\- POST `/api/pvp/convites`

\- POST `/api/pvp/convites/:id/aceitar`

\- POST `/api/pvp/convites/:id/recusar`

\- GET `/api/pvp/partida/atual`

\- GET `/api/pvp/vitorias`



As operações de partida e respostas deverão utilizar Socket.IO quando isso for necessário para a comunicação em tempo real.



Não persistir partidas no banco.



\### Loja



\- GET `/api/loja/itens`

\- GET `/api/loja/itens/:id`

\- POST `/api/loja/itens`

\- PUT `/api/loja/itens/:id`

\- PATCH `/api/loja/itens/:id/status`

\- POST `/api/loja/comprar/:id`

\- GET `/api/loja/inventario`

\- POST `/api/loja/equipar/:id`

\- POST `/api/loja/desequipar/:id`



\### Conquistas



\- GET `/api/conquistas`

\- GET `/api/conquistas/minhas`

\- POST `/api/conquistas`

\- PUT `/api/conquistas/:id`

\- PATCH `/api/conquistas/:id/status`



\### Módulos



\- GET `/api/modulos`

\- GET `/api/modulos/:id`

\- POST `/api/modulos`

\- PUT `/api/modulos/:id`

\- POST `/api/modulos/:id/alunos`

\- GET `/api/modulos/meus`

\- PATCH `/api/modulos/:id/progresso`



Os endpoints acima são uma proposta inicial. Poderão ser reorganizados quando necessário, desde que todas as funcionalidades sejam contempladas e documentadas.



\---



\## 9. Regras importantes de implementação



1\. Não colocar consultas ao banco dentro dos Controllers.

2\. Não colocar regras de negócio dentro das Routes.

3\. Não duplicar regras de negócio em diferentes Services.

4\. Utilizar transações para operações financeiras, especialmente compras e recompensas.

5\. Não confiar em valores enviados pelo frontend para calcular recompensas, penalidades, preços ou resultados.

6\. Não enviar senhas ou hashes de senhas nas respostas.

7\. Não enviar a alternativa correta nas consultas de atividades destinadas aos alunos.

8\. Não permitir que um aluno altere suas próprias moedas ou vitórias diretamente.

9\. Não permitir que um professor altere atividades pertencentes a outro professor.

10\. Não persistir dados de avaliações ou partidas PvP, exceto os resultados finais exigidos.

11\. Manter as associações dos Models organizadas e centralizadas.

12\. Utilizar migrations para gerenciar a estrutura do banco.

13\. Garantir que o código não dependa exclusivamente do SQLite.

14\. Utilizar transações e operações atômicas quando houver atualização simultânea de moedas ou resultados.



\*\*Tratamento de erros:\*\* desconsiderar implementações avançadas de tratamento de erros nesta etapa. Não gastar tempo criando estruturas elaboradas de exceções, logs, monitoramento ou recuperação. Priorizar a implementação das funcionalidades.



\---



\## 10. Ordem de desenvolvimento



Executar o projeto por etapas, verificando o funcionamento de cada uma antes de avançar.



\### Etapa 1 — Configuração inicial



\- Criar o projeto Node.js.

\- Instalar as dependências.

\- Configurar Express.

\- Configurar Sequelize.

\- Configurar SQLite.

\- Preparar a possibilidade de migração para MySQL.

\- Configurar as migrations.

\- Criar a estrutura de pastas.



\### Etapa 2 — Models e relacionamentos



\- Criar todos os Models.

\- Definir os relacionamentos.

\- Implementar as migrations.

\- Criar dados iniciais para níveis de ensino e outras informações necessárias.



\### Etapa 3 — Autenticação e usuários



\- Implementar cadastro de alunos.

\- Implementar cadastro de escolas.

\- Implementar cadastro de professores.

\- Implementar login.

\- Implementar JWT.

\- Implementar permissões.



\### Etapa 4 — Atividades



\- Implementar CRUD de atividades.

\- Implementar alternativas.

\- Implementar conteúdos adicionais.

\- Implementar consulta de atividades.

\- Implementar conclusão de atividades.

\- Implementar recompensas e penalidades.



\### Etapa 5 — Avaliação de nível



\- Implementar sorteio de perguntas.

\- Implementar armazenamento temporário da avaliação.

\- Implementar cálculo de resultado.

\- Implementar atualização do nível do aluno.



\### Etapa 6 — Amigos e PvP



\- Implementar sistema de amizades.

\- Implementar convites.

\- Implementar partidas em tempo real.

\- Implementar sorteio de perguntas.

\- Implementar cálculo de pontuação.

\- Implementar recompensas e atualização de vitórias.



\### Etapa 7 — Loja



\- Implementar cadastro e gerenciamento de itens.

\- Implementar listagem.

\- Implementar compras.

\- Implementar inventário.

\- Implementar equipamentos e categorias.



\### Etapa 8 — Conquistas



\- Implementar cadastro de conquistas.

\- Implementar verificação automática de requisitos.

\- Implementar desbloqueio.

\- Implementar consulta de conquistas dos alunos.



\### Etapa 9 — Módulos



\- Implementar gerenciamento de módulos.

\- Implementar associação com níveis.

\- Implementar associação com alunos.

\- Implementar atualização de progresso.



\### Etapa 10 — Revisão e documentação



\- Revisar todos os endpoints.

\- Verificar permissões.

\- Verificar relacionamentos.

\- Testar as regras de negócio.

\- Revisar a documentação `docs/ROTAS.md`.

\- Criar o README com instruções de instalação e execução.



\---



\## 11. Critérios de conclusão



O backend será considerado concluído quando:



\- Todas as funcionalidades previstas estiverem implementadas.

\- Todas as operações estiverem organizadas na arquitetura Model, Service, Controller e Routes.

\- O banco SQLite estiver funcionando.

\- A configuração permitir uma futura troca para MySQL.

\- As regras de negócio estiverem sendo respeitadas.

\- As operações de moedas não permitirem duplicidade de recompensas.

\- As partidas PvP funcionarem em tempo real.

\- As avaliações calcularem e atualizarem corretamente o nível do aluno.

\- O sistema de loja permitir comprar e equipar itens.

\- As conquistas forem desbloqueadas automaticamente.

\- Todas as rotas estiverem documentadas no arquivo `docs/ROTAS.md`, exatamente no formato solicitado.



\## 12. Instrução final ao agente



Antes de começar, analise integralmente o SQL do banco de dados revisado fornecido como referência.



Não invente tabelas, campos ou relacionamentos que não sejam necessários às funcionalidades especificadas.



Caso seja necessário adaptar a estrutura para compatibilidade entre SQLite e MySQL, preserve a finalidade e as regras de negócio do banco original.



Implemente o projeto por etapas, mantendo o código organizado e funcional.



Não tente implementar todas as funcionalidades em um único arquivo ou concentrar toda a lógica em Controllers.



Priorize uma implementação simples, funcional e de fácil manutenção.



\*\*A documentação das rotas é obrigatória e deverá ser produzida junto com a implementação, seguindo exatamente o modelo INPUT/Output apresentado neste documento.\*\*



\## 13. Testes obrigatórios durante o desenvolvimento



\*\*É obrigatório testar todas as funcionalidades implementadas.\*\*



Não desenvolver várias funcionalidades consecutivamente sem verificar se as anteriores estão funcionando.



Cada funcionalidade deverá ser testada imediatamente após sua implementação, antes de iniciar a próxima etapa.



\### Regras de testes



1\. Testar todas as rotas utilizando ferramentas como Postman, Insomnia ou testes automatizados.

2\. Verificar se os dados estão sendo corretamente inseridos, consultados, atualizados e removidos do banco.

3\. Testar as regras de negócio implementadas nos Services.

4\. Verificar se as permissões de cada tipo de usuário estão funcionando.

5\. Testar os relacionamentos entre Models.

6\. Testar operações que envolvam moedas e compras, verificando se não existem duplicidades ou inconsistências.

7\. Testar o funcionamento das funcionalidades em tempo real, principalmente avaliações e partidas PvP.

8\. Verificar se as respostas das rotas seguem o formato documentado em `docs/ROTAS.md`.



\### Testes específicos por funcionalidade



\- \*\*Autenticação:\*\* testar login, cadastro, JWT e permissões.

\- \*\*Professores:\*\* verificar se uma escola consegue cadastrar professores e se eles ficam vinculados corretamente.

\- \*\*Atividades:\*\* testar cadastro, edição, alternativas e validação das respostas.

\- \*\*Conclusão de atividades:\*\* verificar se somente respostas corretas geram conclusão e recompensa.

\- \*\*Avaliações:\*\* verificar o sorteio de perguntas, cálculo do resultado e atualização do nível.

\- \*\*PvP:\*\* testar convites, aceitação, sincronização das perguntas, pontuação, vitória e recompensa.

\- \*\*Loja:\*\* testar compras, saldo insuficiente, inventário e prevenção de compras duplicadas.

\- \*\*Equipamentos:\*\* testar a troca de itens e a restrição de um item equipado por categoria.

\- \*\*Conquistas:\*\* verificar se os requisitos são reconhecidos e se as conquistas são desbloqueadas corretamente.

\- \*\*Módulos:\*\* testar associações, atualização de progresso e conclusão.



\### Testes automatizados



Sempre que possível, utilizar Jest ou Vitest e Supertest para automatizar os testes.



Criar testes para os Services e para as rotas da API.



Utilizar um banco de testes separado do banco de desenvolvimento, garantindo que os testes não alterem os dados reais.



\### Regra de aprovação



Uma funcionalidade somente será considerada concluída quando:



\- Sua implementação estiver finalizada.

\- Seus testes tiverem sido executados.

\- Os resultados estiverem corretos.

\- Não existirem falhas conhecidas que comprometam seu funcionamento.



Caso algum teste falhe, corrigir o problema antes de avançar para a próxima funcionalidade.



Não ignorar testes que falharam apenas para continuar o desenvolvimento.



\---



\## 14. Commits obrigatórios no repositório remoto



O desenvolvimento deverá utilizar Git desde o início.



\*\*É obrigatório realizar commits no repositório remoto sempre que uma etapa importante for concluída.\*\*



Não deixar para realizar todos os commits somente no final do projeto.



\### Regras de versionamento



1\. Verificar se o projeto já possui um repositório Git configurado antes de iniciar.

2\. Caso não exista, inicializar o Git e configurar o repositório remoto, se as credenciais e informações necessárias estiverem disponíveis.

3\. Realizar commits após a conclusão e os testes de cada etapa importante.

4\. Utilizar mensagens de commit obrigatoriamente em português.

5\. As mensagens devem ser curtas, objetivas e descrever as alterações realizadas.

6\. Não realizar commits de funcionalidades que estejam quebradas ou com testes pendentes.

7\. Não incluir arquivos `.env`, senhas, tokens, credenciais ou outros dados sensíveis nos commits.

8\. Antes de realizar um commit, verificar os arquivos modificados com `git status` e revisar o conteúdo com `git diff`.

9\. Não sobrescrever commits anteriores nem utilizar comandos destrutivos de Git sem necessidade.

10\. Enviar os commits para o repositório remoto após cada etapa importante, utilizando `git push`.



\### Padrão das mensagens de commit



Utilizar mensagens em português seguindo um padrão semelhante a:



```text

feat: implementa autenticação de usuários

feat: adiciona cadastro de professores

feat: implementa gerenciamento de atividades

feat: adiciona sistema de avaliação de nível

feat: implementa partidas PvP em tempo real

feat: adiciona loja e inventário de itens

feat: implementa sistema de conquistas

feat: adiciona gerenciamento de módulos



fix: corrige validação das respostas das atividades

fix: impede compras duplicadas de itens



test: adiciona testes de autenticação

test: adiciona testes do sistema de atividades



docs: atualiza documentação das rotas

docs: adiciona instruções de instalação

```



Os prefixos (`feat`, `fix`, `test`, `docs`) podem ser mantidos, mas a descrição deverá estar sempre em português.



\### Momentos obrigatórios para realizar commits



Realizar commits, no mínimo, após as seguintes etapas:



| Etapa | Momento do commit |

|---|---|

| Configuração inicial | Projeto configurado e funcionando |

| Banco de dados | Models, associações e migrations testados |

| Autenticação | Cadastro, login e permissões testados |

| Atividades | CRUD, respostas e recompensas testados |

| Avaliações | Cálculo e atualização de nível testados |

| Amigos | Sistema de amizades testado |

| PvP | Partidas e recompensas testadas |

| Loja | Compras e inventário testados |

| Equipamentos | Equipar e desequipar itens testados |

| Conquistas | Desbloqueios automáticos testados |

| Módulos | Gerenciamento e progresso testados |

| Finalização | Revisão, testes gerais e documentação concluídos |



\### Procedimento obrigatório antes de cada commit



Executar a seguinte sequência:



```bash

git status

git diff

npm test

git add .

git commit -m "feat: descrição da funcionalidade"

git push origin main

```



O comando de testes deverá corresponder aos scripts configurados no projeto.



Ajustar a seleção de arquivos do `git add` quando necessário, evitando incluir arquivos sensíveis ou desnecessários.



Caso os testes falhem, não realizar o commit como se a etapa estivesse concluída. Corrigir os problemas e executar os testes novamente.



Caso o envio ao repositório remoto falhe, manter o commit local e tentar sincronizar posteriormente, sem perder o trabalho realizado.



\---



\## 15. Atualização da ordem de desenvolvimento



Todas as etapas do planejamento deverão seguir este ciclo:



1\. Implementar a funcionalidade.

2\. Executar os testes correspondentes.

3\. Corrigir eventuais problemas.

4\. Executar novamente os testes.

5\. Atualizar a documentação das rotas.

6\. Revisar as alterações no Git.

7\. Realizar o commit em português.

8\. Enviar as alterações ao repositório remoto.

9\. Avançar para a próxima etapa.



\*\*Regra fundamental:\*\* nenhuma etapa importante deverá ser considerada concluída sem testes aprovados e commit realizado no repositório remoto.



O objetivo é manter o projeto sempre funcional, testado, documentado e com histórico de desenvolvimento atualizado.

O retorno do ranking deve seguir exatamente esse formato: um array de objetos contendo posicao e nome.

Exemplo de retorno:
[
  {
    "posicao": 1,
    "nome": "João"
  },
  {
    "posicao": 2,
    "nome": "Maria"
  },
  {
    "posicao": 3,
    "nome": "Pedro"
  },
  {
    "posicao": 4,
    "nome": "Ana"
  },
  {
    "posicao": 5,
    "nome": "Lucas"
  },
  {
    "posicao": 730,
    "nome": "Nome do meu usuario"
  }
]


Regra para implementação: retornar os 5 primeiros colocados do ranking e incluir também o usuário autenticado, mesmo que ele esteja fora do Top 5. A posição deve ser a posição real dele no ranking, sem reiniciar a contagem.

