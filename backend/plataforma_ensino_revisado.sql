-- ============================================================
-- Plataforma de Ensino Gamificada
-- MySQL 8.0+
-- Modelo revisado conforme as regras de negócio informadas
-- ============================================================

CREATE DATABASE IF NOT EXISTS plataforma_ensino
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE plataforma_ensino;

-- ============================================================
-- USUÁRIOS E PERFIS
-- ============================================================

CREATE TABLE usuario (
    id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    dt_nasc DATE NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL COMMENT 'Armazenar somente hash seguro da senha',
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uk_usuario_email (email)
) ENGINE=InnoDB;

CREATE TABLE administrador (
    id_usuario INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_administrador_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE escola (
    id_escola INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cep VARCHAR(9) NULL,
    rua VARCHAR(120) NULL,
    estado VARCHAR(50) NULL,
    cidade VARCHAR(80) NULL,
    numero VARCHAR(15) NULL,
    PRIMARY KEY (id_escola),
    UNIQUE KEY uk_escola_usuario (id_usuario),
    CONSTRAINT fk_escola_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE nivel_ensino (
    id_nivel_ensino INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    PRIMARY KEY (id_nivel_ensino),
    UNIQUE KEY uk_nivel_nome (nome)
) ENGINE=InnoDB;

CREATE TABLE aluno (
    id_usuario INT UNSIGNED NOT NULL,
    moedas INT UNSIGNED NOT NULL DEFAULT 0,
    vitorias_pvp INT UNSIGNED NOT NULL DEFAULT 0,
    id_nivel_ensino INT UNSIGNED NULL
        COMMENT 'Nível atual/resultante da avaliação mais recente',
    PRIMARY KEY (id_usuario),
    KEY idx_aluno_nivel (id_nivel_ensino),
    CONSTRAINT fk_aluno_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_aluno_nivel
        FOREIGN KEY (id_nivel_ensino)
        REFERENCES nivel_ensino (id_nivel_ensino)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE professor (
    id_usuario INT UNSIGNED NOT NULL,
    id_escola INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_usuario),
    KEY idx_professor_escola (id_escola),
    CONSTRAINT fk_professor_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_professor_escola
        FOREIGN KEY (id_escola)
        REFERENCES escola (id_escola)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- ATIVIDADES E ALTERNATIVAS
-- ============================================================

CREATE TABLE atividade (
    id_atividade INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_nivel_ensino INT UNSIGNED NOT NULL,
    id_professor INT UNSIGNED NOT NULL,
    nome_atividade VARCHAR(120) NOT NULL,
    tipo ENUM('multipla_escolha', 'verdadeiro_falso') NOT NULL
        DEFAULT 'multipla_escolha',
    pergunta TEXT NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_atividade),
    KEY idx_atividade_nivel (id_nivel_ensino),
    KEY idx_atividade_professor (id_professor),
    CONSTRAINT fk_atividade_nivel
        FOREIGN KEY (id_nivel_ensino)
        REFERENCES nivel_ensino (id_nivel_ensino)
        ON DELETE RESTRICT,
    CONSTRAINT fk_atividade_professor
        FOREIGN KEY (id_professor)
        REFERENCES professor (id_usuario)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE resposta (
    id_resposta INT UNSIGNED NOT NULL AUTO_INCREMENT,
    atividade_id_atividade INT UNSIGNED NOT NULL,
    resposta TEXT NOT NULL,
    validade TINYINT(1) NOT NULL DEFAULT 0,
    ordem SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    -- Permite no máximo uma alternativa correta por atividade.
    atividade_resposta_correta_id INT UNSIGNED
        GENERATED ALWAYS AS (
            CASE WHEN validade = 1
                 THEN atividade_id_atividade
                 ELSE NULL
            END
        ) STORED,
    PRIMARY KEY (id_resposta),
    KEY idx_resposta_atividade (atividade_id_atividade),
    UNIQUE KEY uk_uma_resposta_correta (atividade_resposta_correta_id),
    UNIQUE KEY uk_resposta_ordem (atividade_id_atividade, ordem),
    CONSTRAINT fk_resposta_atividade
        FOREIGN KEY (atividade_id_atividade)
        REFERENCES atividade (id_atividade)
        ON DELETE CASCADE,
    CONSTRAINT chk_resposta_validade
        CHECK (validade IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE conteudo (
    id_conteudo INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_atividade INT UNSIGNED NOT NULL,
    tipo VARCHAR(30) NULL
        COMMENT 'Tipo do conteúdo, por exemplo imagem ou áudio',
    caminho VARCHAR(500) NOT NULL,
    PRIMARY KEY (id_conteudo),
    KEY idx_conteudo_atividade (id_atividade),
    CONSTRAINT fk_conteudo_atividade
        FOREIGN KEY (id_atividade)
        REFERENCES atividade (id_atividade)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- A existência do registro significa que o aluno concluiu a atividade.
-- O backend deve inserir somente após resposta correta.
-- A chave primária impede conclusão/recompensa duplicada.
CREATE TABLE aluno_has_atividade (
    id_atividade INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    data_conclusao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_atividade, id_usuario),
    KEY idx_aha_aluno (id_usuario),
    CONSTRAINT fk_aha_atividade
        FOREIGN KEY (id_atividade)
        REFERENCES atividade (id_atividade)
        ON DELETE RESTRICT,
    CONSTRAINT fk_aha_aluno
        FOREIGN KEY (id_usuario)
        REFERENCES aluno (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULOS E PROGRESSO DO ALUNO
-- ============================================================

CREATE TABLE modulo_ensino (
    id_modulo_ensino INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_modulo_ensino),
    UNIQUE KEY uk_modulo_nome (nome)
) ENGINE=InnoDB;

-- Mantém a associação do aluno com o módulo e o nível.
-- O progresso é resumido aqui; não há histórico de cada etapa.
CREATE TABLE aluno_has_modulo_ensino (
    id_modulo_ensino INT UNSIGNED NOT NULL,
    id_nivel_ensino INT UNSIGNED NOT NULL,
    aluno_id_usuario INT UNSIGNED NOT NULL,
    status ENUM('nao_iniciado', 'em_andamento', 'concluido')
        NOT NULL DEFAULT 'nao_iniciado',
    data_conclusao DATETIME NULL,
    PRIMARY KEY (
        id_modulo_ensino,
        id_nivel_ensino,
        aluno_id_usuario
    ),
    KEY idx_ahme_nivel (id_nivel_ensino),
    KEY idx_ahme_aluno (aluno_id_usuario),
    CONSTRAINT fk_ahme_modulo
        FOREIGN KEY (id_modulo_ensino)
        REFERENCES modulo_ensino (id_modulo_ensino)
        ON DELETE CASCADE,
    CONSTRAINT fk_ahme_nivel
        FOREIGN KEY (id_nivel_ensino)
        REFERENCES nivel_ensino (id_nivel_ensino)
        ON DELETE CASCADE,
    CONSTRAINT fk_ahme_aluno
        FOREIGN KEY (aluno_id_usuario)
        REFERENCES aluno (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- LOJA, ITENS COMPRADOS E EQUIPAMENTOS
-- ============================================================

CREATE TABLE item_loja (
    id_item_loja INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    imagem VARCHAR(500) NULL,
    categoria VARCHAR(45) NOT NULL
        COMMENT 'Ex.: avatar, moldura, acessório; definir categorias na aplicação',
    preco INT UNSIGNED NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_item_loja),
    KEY idx_item_categoria (categoria)
) ENGINE=InnoDB;

CREATE TABLE aluno_has_item_loja (
    aluno_id_usuario INT UNSIGNED NOT NULL,
    item_loja_id_item_loja INT UNSIGNED NOT NULL,
    equipado TINYINT(1) NOT NULL DEFAULT 0,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (aluno_id_usuario, item_loja_id_item_loja),
    KEY idx_ahil_item (item_loja_id_item_loja),
    KEY idx_ahil_equipado (aluno_id_usuario, equipado),
    CONSTRAINT fk_ahil_aluno
        FOREIGN KEY (aluno_id_usuario)
        REFERENCES aluno (id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_ahil_item
        FOREIGN KEY (item_loja_id_item_loja)
        REFERENCES item_loja (id_item_loja)
        ON DELETE RESTRICT,
    CONSTRAINT chk_item_equipado
        CHECK (equipado IN (0, 1))
) ENGINE=InnoDB;

-- ============================================================
-- AMIZADES
-- ============================================================

CREATE TABLE amigos (
    aluno_id_usuario INT UNSIGNED NOT NULL,
    amigo_id_usuario INT UNSIGNED NOT NULL,
    data_amizade DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (aluno_id_usuario, amigo_id_usuario),
    KEY idx_amigos_amigo (amigo_id_usuario),
    CONSTRAINT fk_amigos_aluno
        FOREIGN KEY (aluno_id_usuario)
        REFERENCES aluno (id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_amigos_amigo
        FOREIGN KEY (amigo_id_usuario)
        REFERENCES aluno (id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT chk_amigos_nao_ser_proprio
        CHECK (aluno_id_usuario <> amigo_id_usuario)
) ENGINE=InnoDB;

-- ============================================================
-- CONQUISTAS
-- ============================================================

CREATE TABLE conquista (
    id_conquista INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome_conquista VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    imagem VARCHAR(500) NULL,
    tipo_requisito ENUM(
        'atividades_concluidas',
        'vitorias_pvp',
        'itens_comprados',
        'nivel_ensino'
    ) NOT NULL,
    valor_requisito INT UNSIGNED NOT NULL DEFAULT 1,
    ativa TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id_conquista),
    UNIQUE KEY uk_conquista_nome (nome_conquista)
) ENGINE=InnoDB;

CREATE TABLE aluno_has_conquista (
    aluno_id_usuario INT UNSIGNED NOT NULL,
    conquista_id_conquista INT UNSIGNED NOT NULL,
    data_desbloqueio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (aluno_id_usuario, conquista_id_conquista),
    KEY idx_ahc_conquista (conquista_id_conquista),
    CONSTRAINT fk_ahc_aluno
        FOREIGN KEY (aluno_id_usuario)
        REFERENCES aluno (id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_ahc_conquista
        FOREIGN KEY (conquista_id_conquista)
        REFERENCES conquista (id_conquista)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
