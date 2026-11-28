# Rotas da API

Base: `http://localhost:3000`

Rotas protegidas usam o cabeçalho:

```text
Authorization: Bearer <token>
```

O token é retornado por `POST /api/auth/login`. Cada rota informa abaixo o perfil autorizado.

---

## Autenticação

```text
/api/auth/login POST:

Permissão: pública

INPUT:

{
    "email": "joao@exemplo.com",
    "senha": "senha123"
}

Output:

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
        "id_usuario": 1,
        "nome": "João Silva",
        "email": "joao@exemplo.com",
        "tipo": "aluno"
    }
}
```

```text
/api/auth/logout POST:

Permissão: usuário autenticado

INPUT:

{}

Output:

{
    "resposta": "Logout realizado com sucesso"
}
```

---

## Usuários

```text
/api/usuarios/me GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

{
    "id_usuario": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "dt_nasc": "2008-05-10",
    "tipo": "aluno",
    "moedas": 120,
    "vitorias_pvp": 3,
    "nivel_ensino": {
        "id_nivel_ensino": 2,
        "nome": "Fundamental II"
    }
}
```

```text
/api/administradores POST:

Permissão: administrador

INPUT:

{
    "nome": "Maria Administradora",
    "dt_nasc": "1990-01-01",
    "email": "maria.admin@exemplo.com",
    "senha": "senha123"
}

Output:

{
    "id_usuario": 15,
    "nome": "Maria Administradora",
    "dt_nasc": "1990-01-01",
    "email": "maria.admin@exemplo.com",
    "tipo": "administrador"
}
```

---

## Alunos

```text
/api/alunos POST:

Permissão: pública

INPUT:

{
    "nome": "João Silva",
    "dt_nasc": "2008-05-10",
    "email": "joao@exemplo.com",
    "senha": "senha123"
}

Output:

{
    "id_usuario": 1,
    "nome": "João Silva",
    "dt_nasc": "2008-05-10",
    "email": "joao@exemplo.com",
    "tipo": "aluno"
}
```

```text
/api/alunos/me GET:

Permissão: aluno

INPUT:

{}

Output:

{
    "id_usuario": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "moedas": 120,
    "vitorias_pvp": 3,
    "nivel_ensino": {
        "id_nivel_ensino": 2,
        "nome": "Fundamental II"
    }
}
```

```text
/api/alunos/me PUT:

Permissão: aluno

INPUT:

{
    "nome": "João Silva Santos",
    "email": "joao.santos@exemplo.com",
    "dt_nasc": "2008-05-10"
}

Output:

{
    "id_usuario": 1,
    "nome": "João Silva Santos",
    "email": "joao.santos@exemplo.com",
    "moedas": 120,
    "vitorias_pvp": 3,
    "nivel_ensino": {
        "id_nivel_ensino": 2,
        "nome": "Fundamental II"
    }
}
```

```text
/api/alunos/:id GET:

Permissão: usuário autenticado

INPUT:

{
    "id": 2
}

Output:

{
    "id_usuario": 2,
    "nome": "Maria Souza",
    "email": "maria@exemplo.com",
    "moedas": 90,
    "vitorias_pvp": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    }
}
```

```text
/api/alunos GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

[
    {
        "id_usuario": 1,
        "nome": "João Silva",
        "email": "joao@exemplo.com",
        "moedas": 120,
        "vitorias_pvp": 3,
        "nivel_ensino": {
            "id_nivel_ensino": 2,
            "nome": "Fundamental II"
        }
    },
    {
        "id_usuario": 2,
        "nome": "Maria Souza",
        "email": "maria@exemplo.com",
        "moedas": 90,
        "vitorias_pvp": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        }
    }
]
```

---

## Escolas

```text
/api/escolas POST:

Permissão: pública

INPUT:

{
    "nome": "Escola Estadual Central",
    "dt_nasc": "2000-01-01",
    "email": "contato@escolacentral.com",
    "senha": "senha123",
    "cep": "01001-000",
    "rua": "Praça da Sé",
    "estado": "SP",
    "cidade": "São Paulo",
    "numero": "100"
}

Output:

{
    "id_usuario": 10,
    "nome": "Escola Estadual Central",
    "dt_nasc": "2000-01-01",
    "email": "contato@escolacentral.com",
    "tipo": "escola",
    "id_escola": 4
}
```

```text
/api/escolas/professores POST:

Permissão: escola

INPUT:

{
    "nome": "Carlos Pereira",
    "dt_nasc": "1985-03-20",
    "email": "carlos.pereira@exemplo.com",
    "senha": "senha123"
}

Output:

{
    "id_usuario": 11,
    "nome": "Carlos Pereira",
    "dt_nasc": "1985-03-20",
    "email": "carlos.pereira@exemplo.com",
    "tipo": "professor",
    "id_escola": 4
}
```

---

## Professores

```text
/api/professores GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

[
    {
        "id_usuario": 11,
        "nome": "Carlos Pereira",
        "email": "carlos.pereira@exemplo.com",
        "dt_nasc": "1985-03-20",
        "id_escola": 4,
        "escola": {
            "id_escola": 4,
            "nome": "Escola Estadual Central"
        }
    }
]
```

```text
/api/professores/:id GET:

Permissão: usuário autenticado

INPUT:

{
    "id": 11
}

Output:

{
    "id_usuario": 11,
    "nome": "Carlos Pereira",
    "email": "carlos.pereira@exemplo.com",
    "dt_nasc": "1985-03-20",
    "id_escola": 4,
    "escola": {
        "id_escola": 4,
        "nome": "Escola Estadual Central"
    }
}
```

```text
/api/professores/:id PUT:

Permissão: o próprio professor, a escola do professor ou administrador

INPUT:

{
    "id": 11,
    "nome": "Carlos Pereira Lima",
    "email": "carlos.lima@exemplo.com",
    "dt_nasc": "1985-03-20"
}

Output:

{
    "id_usuario": 11,
    "nome": "Carlos Pereira Lima",
    "email": "carlos.lima@exemplo.com",
    "dt_nasc": "1985-03-20",
    "id_escola": 4,
    "escola": {
        "id_escola": 4,
        "nome": "Escola Estadual Central"
    }
}
```

---

## Atividades

```text
/api/atividades POST:

Permissão: professor

INPUT:

{
    "nome_atividade": "Matemática básica",
    "pergunta": "Quanto é 2 + 2?",
    "id_nivel_ensino": 1,
    "tipo": "multipla_escolha",
    "alternativas": [
        {
            "resposta": "3",
            "validade": false
        },
        {
            "resposta": "4",
            "validade": true
        }
    ],
    "conteudos": [
        {
            "tipo": "imagem",
            "caminho": "/conteudos/2mais2.png"
        }
    ]
}

Output:

{
    "id_atividade": 1,
    "nome_atividade": "Matemática básica",
    "pergunta": "Quanto é 2 + 2?",
    "tipo": "multipla_escolha",
    "ativo": true,
    "data_criacao": "2026-11-20T12:00:00.000Z",
    "id_nivel_ensino": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    },
    "id_professor": 11,
    "professor": {
        "id_usuario": 11,
        "nome": "Carlos Pereira"
    },
    "alternativas": [
        {
            "id_resposta": 1,
            "resposta": "3",
            "ordem": 1,
            "validade": false
        },
        {
            "id_resposta": 2,
            "resposta": "4",
            "ordem": 2,
            "validade": true
        }
    ],
    "conteudos": [
        {
            "id_conteudo": 1,
            "tipo": "imagem",
            "caminho": "/conteudos/2mais2.png"
        }
    ]
}
```

```text
/api/atividades GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

[
    {
        "id_atividade": 1,
        "nome_atividade": "Matemática básica",
        "pergunta": "Quanto é 2 + 2?",
        "tipo": "multipla_escolha",
        "ativo": true,
        "data_criacao": "2026-11-20T12:00:00.000Z",
        "id_nivel_ensino": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "id_professor": 11,
        "professor": {
            "id_usuario": 11,
            "nome": "Carlos Pereira"
        },
        "alternativas": [
            {
                "id_resposta": 1,
                "resposta": "3",
                "ordem": 1
            },
            {
                "id_resposta": 2,
                "resposta": "4",
                "ordem": 2
            }
        ],
        "conteudos": [
            {
                "id_conteudo": 1,
                "tipo": "imagem",
                "caminho": "/conteudos/2mais2.png"
            }
        ]
    }
]
```

Para filtrar, use a URL com query string, por exemplo `/api/atividades?id_nivel_ensino=1&id_professor=11&ativo=true`. Para alunos, apenas atividades ativas são retornadas e o campo `validade` não é enviado.

```text
/api/atividades/concluidas GET:

Permissão: aluno

INPUT:

{}

Output:

[
    {
        "id_atividade": 1,
        "nome_atividade": "Matemática básica",
        "pergunta": "Quanto é 2 + 2?",
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "data_conclusao": "2026-11-20T12:10:00.000Z"
    }
]
```

```text
/api/atividades/:id GET:

Permissão: usuário autenticado

INPUT:

{
    "id": 1
}

Output:

{
    "id_atividade": 1,
    "nome_atividade": "Matemática básica",
    "pergunta": "Quanto é 2 + 2?",
    "tipo": "multipla_escolha",
    "ativo": true,
    "data_criacao": "2026-11-20T12:00:00.000Z",
    "id_nivel_ensino": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    },
    "id_professor": 11,
    "professor": {
        "id_usuario": 11,
        "nome": "Carlos Pereira"
    },
    "alternativas": [
        {
            "id_resposta": 1,
            "resposta": "3",
            "ordem": 1
        },
        {
            "id_resposta": 2,
            "resposta": "4",
            "ordem": 2
        }
    ],
    "conteudos": []
}
```

```text
/api/atividades/:id PUT:

Permissão: professor dono da atividade

INPUT:

{
    "id": 1,
    "nome_atividade": "Matemática básica revisada",
    "pergunta": "Quanto é 2 + 2?",
    "id_nivel_ensino": 1,
    "tipo": "multipla_escolha",
    "alternativas": [
        {
            "resposta": "3",
            "validade": false
        },
        {
            "resposta": "4",
            "validade": true
        }
    ],
    "conteudos": []
}

Output:

{
    "id_atividade": 1,
    "nome_atividade": "Matemática básica revisada",
    "pergunta": "Quanto é 2 + 2?",
    "tipo": "multipla_escolha",
    "ativo": true,
    "data_criacao": "2026-11-20T12:00:00.000Z",
    "id_nivel_ensino": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    },
    "id_professor": 11,
    "professor": {
        "id_usuario": 11,
        "nome": "Carlos Pereira"
    },
    "alternativas": [
        {
            "id_resposta": 3,
            "resposta": "3",
            "ordem": 1,
            "validade": false
        },
        {
            "id_resposta": 4,
            "resposta": "4",
            "ordem": 2,
            "validade": true
        }
    ],
    "conteudos": []
}
```

```text
/api/atividades/:id/status PATCH:

Permissão: professor dono da atividade

INPUT:

{
    "id": 1,
    "ativo": false
}

Output:

{
    "id_atividade": 1,
    "nome_atividade": "Matemática básica revisada",
    "pergunta": "Quanto é 2 + 2?",
    "tipo": "multipla_escolha",
    "ativo": false,
    "data_criacao": "2026-11-20T12:00:00.000Z",
    "id_nivel_ensino": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    },
    "id_professor": 11,
    "professor": {
        "id_usuario": 11,
        "nome": "Carlos Pereira"
    },
    "alternativas": [
        {
            "id_resposta": 3,
            "resposta": "3",
            "ordem": 1,
            "validade": false
        },
        {
            "id_resposta": 4,
            "resposta": "4",
            "ordem": 2,
            "validade": true
        }
    ],
    "conteudos": []
}
```

```text
/api/atividades/:id/responder POST:

Permissão: aluno

INPUT:

{
    "id": 1,
    "id_resposta": 2
}

Output:

{
    "correta": true,
    "moedas": 10,
    "recompensa": 10,
    "penalidade": 0,
    "conquistas": [
        {
            "id_conquista": 1,
            "nome_conquista": "Primeira atividade"
        }
    ]
}
```

---

## Avaliação de nível

```text
/api/avaliacoes/iniciar POST:

Permissão: aluno

INPUT:

{}

Output:

{
    "quantidade": 2,
    "questoes": [
        {
            "id_atividade": 1,
            "nome_atividade": "Matemática básica",
            "pergunta": "Quanto é 2 + 2?",
            "tipo": "multipla_escolha",
            "ativo": true,
            "data_criacao": "2026-11-20T12:00:00.000Z",
            "id_nivel_ensino": 1,
            "nivel_ensino": {
                "id_nivel_ensino": 1,
                "nome": "Fundamental I"
            },
            "id_professor": 11,
            "professor": {
                "id_usuario": 11,
                "nome": "Carlos Pereira"
            },
            "alternativas": [
                {
                    "id_resposta": 1,
                    "resposta": "3",
                    "ordem": 1
                },
                {
                    "id_resposta": 2,
                    "resposta": "4",
                    "ordem": 2
                }
            ],
            "conteudos": []
        }
    ]
}
```

```text
/api/avaliacoes/finalizar POST:

Permissão: aluno

INPUT:

{
    "respostas": [
        {
            "id_atividade": 1,
            "id_resposta": 2
        },
        {
            "id_atividade": 2,
            "id_resposta": 5
        }
    ]
}

Output:

{
    "acertos": 2,
    "total": 2,
    "percentual": 100,
    "nivel": {
        "id_nivel_ensino": 3,
        "nome": "Ensino Médio"
    },
    "conquistas": []
}
```

---

## Amigos

```text
/api/amigos GET:

Permissão: aluno

INPUT:

{}

Output:

[
    {
        "id_usuario": 2,
        "nome": "Maria Souza",
        "nivel_ensino": {
            "id_nivel_ensino": 2,
            "nome": "Fundamental II"
        },
        "moedas": 120,
        "borda": "#FFD700",
        "avatar": "/itens/avatar-azul.png"
    }
]
```

A lista retorna somente esses campos. `borda` e `avatar` trazem o valor do item equipado na categoria (`null` quando não há item equipado).

```text
/api/amigos/buscar?nome=Maria GET:

Permissão: aluno

INPUT:

{
    "nome": "Maria"
}

Output:

[
    {
        "id_usuario": 2,
        "nome": "Maria Souza",
        "email": "maria@exemplo.com"
    }
]
```

```text
/api/amigos POST:

Permissão: aluno

INPUT:

{
    "id_amigo": 2
}

Output:

{
    "id_usuario": 2,
    "nome": "Maria Souza",
    "email": "maria@exemplo.com"
}
```

```text
/api/amigos/:id DELETE:

Permissão: aluno

INPUT:

{
    "id": 2
}

Output:

{
    "resposta": "Amizade removida com sucesso"
}
```

---

## PvP

```text
/api/pvp/convites POST:

Permissão: aluno

INPUT:

{
    "id_amigo": 2
}

Output:

{
    "id_convite": "0f8fad5b-d9cb-469f-a165-70867728950e",
    "id_desafiante": 1,
    "id_desafiado": 2,
    "status": "pendente",
    "criado_em": "2026-11-20T12:30:00.000Z",
    "desafiante": {
        "id_usuario": 1,
        "nome": "João Silva"
    }
}
```

```text
/api/pvp/convites/:id/aceitar POST:

Permissão: aluno desafiado

INPUT:

{
    "id": "0f8fad5b-d9cb-469f-a165-70867728950e"
}

Output:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "jogadores": [
        {
            "id_usuario": 1,
            "nome": "João Silva",
            "pontos": 0
        },
        {
            "id_usuario": 2,
            "nome": "Maria Souza",
            "pontos": 0
        }
    ],
    "indice": 0,
    "total": 5,
    "questaoAtual": {
        "id_atividade": 1,
        "nome_atividade": "Matemática básica",
        "pergunta": "Quanto é 2 + 2?",
        "tipo": "multipla_escolha",
        "ativo": true,
        "data_criacao": "2026-11-20T12:00:00.000Z",
        "id_nivel_ensino": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "id_professor": 11,
        "professor": {
            "id_usuario": 11,
            "nome": "Carlos Pereira"
        },
        "alternativas": [
            {
                "id_resposta": 1,
                "resposta": "3",
                "ordem": 1
            },
            {
                "id_resposta": 2,
                "resposta": "4",
                "ordem": 2
            }
        ],
        "conteudos": []
    },
    "finalizada": false,
    "resultado": null
}
```

```text
/api/pvp/convites/:id/recusar POST:

Permissão: aluno desafiado

INPUT:

{
    "id": "0f8fad5b-d9cb-469f-a165-70867728950e"
}

Output:

{
    "resposta": "Convite recusado"
}
```

```text
/api/pvp/partida/atual GET:

Permissão: aluno

INPUT:

{}

Output:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "jogadores": [
        {
            "id_usuario": 1,
            "nome": "João Silva",
            "pontos": 1
        },
        {
            "id_usuario": 2,
            "nome": "Maria Souza",
            "pontos": 0
        }
    ],
    "indice": 1,
    "total": 5,
    "questaoAtual": {
        "id_atividade": 2,
        "nome_atividade": "Ciências",
        "pergunta": "A água ferve a 100 °C ao nível do mar?",
        "tipo": "verdadeiro_falso",
        "ativo": true,
        "data_criacao": "2026-11-20T12:05:00.000Z",
        "id_nivel_ensino": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "id_professor": 11,
        "professor": {
            "id_usuario": 11,
            "nome": "Carlos Pereira"
        },
        "alternativas": [
            {
                "id_resposta": 3,
                "resposta": "Verdadeiro",
                "ordem": 1
            },
            {
                "id_resposta": 4,
                "resposta": "Falso",
                "ordem": 2
            }
        ],
        "conteudos": []
    },
    "finalizada": false,
    "resultado": null
}
```

Quando o aluno não está em partida, o retorno é `null`.

```text
/api/pvp/vitorias GET:

Permissão: aluno

INPUT:

{}

Output:

{
    "vitorias_pvp": 3
}
```

---

## Loja

```text
/api/loja/itens GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

[
    {
        "id_item_loja": 1,
        "nome": "Avatar Azul",
        "descricao": "Avatar com fundo azul",
        "valor": "/itens/avatar-azul.png",
        "categoria": "avatar",
        "preco": 20,
        "ativo": true
    },
    {
        "id_item_loja": 2,
        "nome": "Borda Ouro",
        "descricao": "Borda dourada para o perfil",
        "valor": "#FFD700",
        "categoria": "borda",
        "preco": 40,
        "ativo": true
    }
]
```

```text
/api/loja/itens/:id GET:

Permissão: usuário autenticado

INPUT:

{
    "id": 1
}

Output:

{
    "id_item_loja": 1,
    "nome": "Avatar Azul",
    "descricao": "Avatar com fundo azul",
    "valor": "/itens/avatar-azul.png",
    "categoria": "avatar",
    "preco": 20,
    "ativo": true
}
```

```text
/api/loja/itens POST:

Permissão: administrador

INPUT:

{
    "nome": "Avatar Azul",
    "descricao": "Avatar com fundo azul",
    "valor": "/itens/avatar-azul.png",
    "categoria": "avatar",
    "preco": 20
}

Output:

{
    "id_item_loja": 1,
    "nome": "Avatar Azul",
    "descricao": "Avatar com fundo azul",
    "valor": "/itens/avatar-azul.png",
    "categoria": "avatar",
    "preco": 20,
    "ativo": true
}
```

O campo `valor` guarda o conteúdo visual do item: uma cor (ex.: `#FFD700`) ou o caminho de uma imagem. Categorias aceitas: `avatar`, `borda`, `titulo` e `fundo`. Os aliases `moldura` (para `borda`) e `background` (para `fundo`) também são aceitos e normalizados.

```text
/api/loja/itens/:id PUT:

Permissão: administrador

INPUT:

{
    "id": 1,
    "nome": "Avatar Azul Escuro",
    "descricao": "Avatar com fundo azul escuro",
    "valor": "/itens/avatar-azul-escuro.png",
    "categoria": "avatar",
    "preco": 25
}

Output:

{
    "id_item_loja": 1,
    "nome": "Avatar Azul Escuro",
    "descricao": "Avatar com fundo azul escuro",
    "valor": "/itens/avatar-azul-escuro.png",
    "categoria": "avatar",
    "preco": 25,
    "ativo": true
}
```

```text
/api/loja/itens/:id/status PATCH:

Permissão: administrador

INPUT:

{
    "id": 1,
    "ativo": false
}

Output:

{
    "id_item_loja": 1,
    "nome": "Avatar Azul Escuro",
    "descricao": "Avatar com fundo azul escuro",
    "valor": "/itens/avatar-azul-escuro.png",
    "categoria": "avatar",
    "preco": 25,
    "ativo": false
}
```

```text
/api/loja/comprar/:id POST:

Permissão: aluno

INPUT:

{
    "id": 1
}

Output:

{
    "item": {
        "id_item_loja": 1,
        "nome": "Avatar Azul",
        "descricao": "Avatar com fundo azul",
        "valor": "/itens/avatar-azul.png",
        "categoria": "avatar",
        "preco": 20,
        "ativo": true
    },
    "moedas": 80,
    "conquistas": [
        {
            "id_conquista": 2,
            "nome_conquista": "Primeira compra"
        }
    ]
}
```

O preço usado é sempre o cadastrado no banco. Valores enviados pelo cliente são ignorados.

```text
/api/loja/inventario GET:

Permissão: aluno

INPUT:

{}

Output:

[
    {
        "id_item_loja": 1,
        "nome": "Avatar Azul",
        "descricao": "Avatar com fundo azul",
        "valor": "/itens/avatar-azul.png",
        "categoria": "avatar",
        "preco": 20,
        "ativo": true,
        "equipado": true,
        "data_compra": "2026-11-20T12:40:00.000Z"
    }
]
```

```text
/api/loja/equipados GET:

Permissão: aluno

INPUT:

{}

Output:

[
    {
        "id_item_loja": 1,
        "nome": "Avatar Azul",
        "descricao": "Avatar com fundo azul",
        "valor": "/itens/avatar-azul.png",
        "categoria": "avatar",
        "preco": 20,
        "ativo": true,
        "equipado": true,
        "data_compra": "2026-11-20T12:40:00.000Z"
    }
]
```

```text
/api/loja/aparencia GET:

Permissão: aluno

INPUT:

{}

Output:

{
    "id_usuario": 4,
    "nome": "João Silva",
    "avatar": {
        "id_item_loja": 1,
        "nome": "Avatar Azul",
        "valor": "/itens/avatar-azul.png"
    },
    "borda": {
        "id_item_loja": 2,
        "nome": "Borda Ouro",
        "valor": "#FFD700"
    },
    "titulo": null,
    "fundo": null
}
```

Retorna o nome do aluno autenticado e o item equipado em cada categoria. O campo `valor` é o conteúdo visual do item, ou seja, uma cor ou o caminho de uma imagem. Categorias sem item equipado retornam `null`. Cada categoria aceita um item equipado por vez; ao equipar outro item da mesma categoria, o anterior é desequipado.

```text
/api/loja/equipar/:id POST:

Permissão: aluno

INPUT:

{
    "id": 1
}

Output:

{
    "id_item_loja": 1,
    "nome": "Avatar Azul",
    "descricao": "Avatar com fundo azul",
    "valor": "/itens/avatar-azul.png",
    "categoria": "avatar",
    "preco": 20,
    "ativo": true,
    "equipado": true,
    "data_compra": "2026-11-20T12:40:00.000Z"
}
```

```text
/api/loja/desequipar/:id POST:

Permissão: aluno

INPUT:

{
    "id": 1
}

Output:

{
    "id_item_loja": 1,
    "nome": "Avatar Azul",
    "descricao": "Avatar com fundo azul",
    "valor": "/itens/avatar-azul.png",
    "categoria": "avatar",
    "preco": 20,
    "ativo": true,
    "equipado": false,
    "data_compra": "2026-11-20T12:40:00.000Z"
}
```

---

## Conquistas

```text
/api/conquistas GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

[
    {
        "id_conquista": 1,
        "nome_conquista": "Primeira atividade",
        "descricao": "Conclua sua primeira atividade",
        "imagem": "/conquistas/primeira-atividade.png",
        "tipo_requisito": "atividades_concluidas",
        "valor_requisito": 1,
        "ativa": true
    }
]
```

```text
/api/conquistas/minhas GET:

Permissão: aluno

INPUT:

{}

Output:

[
    {
        "id_conquista": 1,
        "nome_conquista": "Primeira atividade",
        "descricao": "Conclua sua primeira atividade",
        "imagem": "/conquistas/primeira-atividade.png",
        "tipo_requisito": "atividades_concluidas",
        "valor_requisito": 1,
        "ativa": true,
        "data_desbloqueio": "2026-11-20T12:10:00.000Z"
    }
]
```

```text
/api/conquistas POST:

Permissão: administrador

INPUT:

{
    "nome_conquista": "Primeira atividade",
    "descricao": "Conclua sua primeira atividade",
    "imagem": "/conquistas/primeira-atividade.png",
    "tipo_requisito": "atividades_concluidas",
    "valor_requisito": 1
}

Output:

{
    "id_conquista": 1,
    "nome_conquista": "Primeira atividade",
    "descricao": "Conclua sua primeira atividade",
    "imagem": "/conquistas/primeira-atividade.png",
    "tipo_requisito": "atividades_concluidas",
    "valor_requisito": 1,
    "ativa": true
}
```

```text
/api/conquistas/:id PUT:

Permissão: administrador

INPUT:

{
    "id": 1,
    "nome_conquista": "Primeira atividade concluída",
    "descricao": "Conclua sua primeira atividade",
    "imagem": "/conquistas/primeira-atividade.png",
    "tipo_requisito": "atividades_concluidas",
    "valor_requisito": 1
}

Output:

{
    "id_conquista": 1,
    "nome_conquista": "Primeira atividade concluída",
    "descricao": "Conclua sua primeira atividade",
    "imagem": "/conquistas/primeira-atividade.png",
    "tipo_requisito": "atividades_concluidas",
    "valor_requisito": 1,
    "ativa": true
}
```

```text
/api/conquistas/:id/status PATCH:

Permissão: administrador

INPUT:

{
    "id": 1,
    "ativa": false
}

Output:

{
    "id_conquista": 1,
    "nome_conquista": "Primeira atividade concluída",
    "descricao": "Conclua sua primeira atividade",
    "imagem": "/conquistas/primeira-atividade.png",
    "tipo_requisito": "atividades_concluidas",
    "valor_requisito": 1,
    "ativa": false
}
```

---

## Módulos

```text
/api/modulos GET:

Permissão: usuário autenticado

INPUT:

{}

Output:

[
    {
        "id_modulo_ensino": 1,
        "nome": "Frações",
        "niveis": [
            {
                "id_nivel_ensino": 1,
                "nome": "Fundamental I"
            }
        ],
        "total_alunos": 1
    }
]
```

```text
/api/modulos/meus GET:

Permissão: aluno

INPUT:

{}

Output:

[
    {
        "id_modulo_ensino": 1,
        "nome": "Frações",
        "id_nivel_ensino": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "status": "em_andamento",
        "data_conclusao": null
    }
]
```

```text
/api/modulos/:id GET:

Permissão: usuário autenticado

INPUT:

{
    "id": 1
}

Output:

{
    "id_modulo_ensino": 1,
    "nome": "Frações",
    "niveis": [
        {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        }
    ],
    "alunos": [
        {
            "id_modulo_ensino": 1,
            "id_nivel_ensino": 1,
            "nivel_ensino": {
                "id_nivel_ensino": 1,
                "nome": "Fundamental I"
            },
            "status": "em_andamento",
            "data_conclusao": null,
            "id_usuario": 1,
            "nome": "João Silva"
        }
    ]
}
```

```text
/api/modulos POST:

Permissão: administrador ou professor

INPUT:

{
    "nome": "Frações"
}

Output:

{
    "id_modulo_ensino": 1,
    "nome": "Frações"
}
```

```text
/api/modulos/:id PUT:

Permissão: administrador ou professor

INPUT:

{
    "id": 1,
    "nome": "Frações e Decimais"
}

Output:

{
    "id_modulo_ensino": 1,
    "nome": "Frações e Decimais"
}
```

```text
/api/modulos/:id/alunos POST:

Permissão: administrador ou professor

INPUT:

{
    "id": 1,
    "id_aluno": 1,
    "id_nivel_ensino": 1
}

Output:

{
    "id_modulo_ensino": 1,
    "id_nivel_ensino": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    },
    "status": "nao_iniciado",
    "data_conclusao": null,
    "id_usuario": 1,
    "nome": "João Silva"
}
```

```text
/api/modulos/:id/progresso PATCH:

Permissão: aluno

INPUT:

{
    "id": 1,
    "id_nivel_ensino": 1,
    "status": "concluido"
}

Output:

{
    "id_modulo_ensino": 1,
    "nome": "Frações e Decimais",
    "id_nivel_ensino": 1,
    "nivel_ensino": {
        "id_nivel_ensino": 1,
        "nome": "Fundamental I"
    },
    "status": "concluido",
    "data_conclusao": "2026-11-20T13:00:00.000Z"
}
```

Status permitidos: `nao_iniciado`, `em_andamento`, `concluido`.

---

## Ranking

```text
/api/ranking GET:

Permissão: aluno

INPUT:

{}

Output:

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
```

A classificação usa as moedas do aluno em ordem decrescente. O retorno contém os 5 primeiros colocados e também o aluno autenticado, com a posição real dele no ranking. Quando o aluno já está no top 5, ele não é repetido.

---

## Auditoria

```text
/api/auditoria GET:

Permissão: administrador

INPUT:

{}

Output:

[
    {
        "id_log": 1,
        "data_hora": "2026-11-26T14:30:00.000Z",
        "id_usuario": 11,
        "usuario_nome": "Carlos Pereira",
        "acao": "inclusao",
        "entidade": "atividade",
        "entidade_id": "1",
        "detalhes": {
            "id_atividade": 1,
            "nome_atividade": "Matemática básica",
            "tipo": "multipla_escolha",
            "id_nivel_ensino": 1
        },
        "hash_anterior": "0000000000000000000000000000000000000000000000000000000000000000",
        "hash_atual": "9f2c1d7e5b2a4c6f8e0a1b3d5c7e9f1a2b4c6d8e0f1a3b5c7d9e1f2a4b6c8d0e"
    }
]
```

```text
/api/auditoria/verificar GET:

Permissão: administrador

INPUT:

{}

Output:

{
    "integra": true,
    "total": 1,
    "problemas": []
}
```

Quando um bloco é alterado diretamente no banco sem recálculo dos hashes, a resposta passa a ser:

```json
{
    "integra": false,
    "total": 1,
    "problemas": [
        {
            "id_log": 1,
            "motivo": "Hash atual não corresponde ao conteúdo do bloco"
        }
    ]
}
```

A página administrativa da auditoria é servida em `/auditoria`.

---

## Eventos Socket.IO (PvP)

Conexão:

```text
Socket.IO connect:

INPUT:

{
    "auth": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}

Output:

{
    "evento": "pvp:conectado",
    "dados": {
        "id_usuario": 1
    }
}
```

Somente alunos autenticados podem conectar. O servidor entra na sala `aluno:<id_usuario>`.

```text
pvp:responder (cliente -> servidor):

INPUT:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "id_atividade": 1,
    "id_resposta": 2
}

Output (callback):

{
    "ok": true,
    "aguardando": true
}
```

Quando os dois jogadores respondem à última pergunta, o callback retorna:

```text
{
    "ok": true,
    "resultado": {
        "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
        "vencedor": 1,
        "empate": false,
        "pontos": {
            "1": 5,
            "2": 3
        },
        "recompensa": 20,
        "conquistas": []
    }
}
```

Eventos enviados pelo servidor:

```text
pvp:convite:

{
    "id_convite": "0f8fad5b-d9cb-469f-a165-70867728950e",
    "id_desafiante": 1,
    "id_desafiado": 2,
    "status": "pendente",
    "criado_em": "2026-11-20T12:30:00.000Z",
    "desafiante": {
        "id_usuario": 1,
        "nome": "João Silva"
    }
}
```

```text
pvp:convite_recusado:

{
    "id_convite": "0f8fad5b-d9cb-469f-a165-70867728950e",
    "id_desafiado": 2
}
```

```text
pvp:partida_iniciada:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "jogadores": [
        {
            "id_usuario": 1,
            "nome": "João Silva",
            "pontos": 0
        },
        {
            "id_usuario": 2,
            "nome": "Maria Souza",
            "pontos": 0
        }
    ],
    "indice": 0,
    "total": 5,
    "questaoAtual": {
        "id_atividade": 1,
        "nome_atividade": "Matemática básica",
        "pergunta": "Quanto é 2 + 2?",
        "tipo": "multipla_escolha",
        "ativo": true,
        "data_criacao": "2026-11-20T12:00:00.000Z",
        "id_nivel_ensino": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "id_professor": 11,
        "professor": {
            "id_usuario": 11,
            "nome": "Carlos Pereira"
        },
        "alternativas": [
            {
                "id_resposta": 1,
                "resposta": "3",
                "ordem": 1
            },
            {
                "id_resposta": 2,
                "resposta": "4",
                "ordem": 2
            }
        ],
        "conteudos": []
    },
    "finalizada": false,
    "resultado": null
}
```

```text
pvp:resposta_registrada:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "id_atividade": 1,
    "id_usuario": 1
}
```

```text
pvp:pergunta:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "jogadores": [
        {
            "id_usuario": 1,
            "nome": "João Silva",
            "pontos": 1
        },
        {
            "id_usuario": 2,
            "nome": "Maria Souza",
            "pontos": 0
        }
    ],
    "indice": 1,
    "total": 5,
    "questaoAtual": {
        "id_atividade": 2,
        "nome_atividade": "Ciências",
        "pergunta": "A água ferve a 100 °C ao nível do mar?",
        "tipo": "verdadeiro_falso",
        "ativo": true,
        "data_criacao": "2026-11-20T12:05:00.000Z",
        "id_nivel_ensino": 1,
        "nivel_ensino": {
            "id_nivel_ensino": 1,
            "nome": "Fundamental I"
        },
        "id_professor": 11,
        "professor": {
            "id_usuario": 11,
            "nome": "Carlos Pereira"
        },
        "alternativas": [
            {
                "id_resposta": 3,
                "resposta": "Verdadeiro",
                "ordem": 1
            },
            {
                "id_resposta": 4,
                "resposta": "Falso",
                "ordem": 2
            }
        ],
        "conteudos": []
    },
    "finalizada": false,
    "resultado": null
}
```

```text
pvp:resultado:

{
    "id_partida": "3b241101-e2bb-4255-8caf-4136c566a962",
    "vencedor": 1,
    "empate": false,
    "pontos": {
        "1": 5,
        "2": 3
    },
    "recompensa": 20,
    "conquistas": []
}
```

O cliente nunca informa o resultado final. A pontuação e o vencedor são calculados apenas no servidor.
