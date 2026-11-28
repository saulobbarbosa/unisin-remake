const { Op, literal } = require('sequelize');
const {
  sequelize,
  ItemLoja,
  AlunoItemLoja,
  Aluno,
  Usuario
} = require('../models');
const ConquistaService = require('./ConquistaService');
const { criarErro } = require('../utils/erro');

const CATEGORIAS = ['avatar', 'borda', 'titulo', 'fundo'];
const ALIASES_CATEGORIA = {
  avatar: 'avatar',
  borda: 'borda',
  moldura: 'borda',
  titulo: 'titulo',
  'título': 'titulo',
  fundo: 'fundo',
  background: 'fundo'
};

function categoriaCanonica(valor) {
  const categoria = String(valor || '').trim().toLowerCase();
  return ALIASES_CATEGORIA[categoria] || categoria;
}

function validarCategoria(valor) {
  const categoria = categoriaCanonica(valor);
  if (!CATEGORIAS.includes(categoria)) {
    throw criarErro('Categoria inválida. Use: avatar, borda, titulo ou fundo');
  }
  return categoria;
}

function validarItem(dados) {
  if (!dados.nome) throw criarErro('Campo obrigatório: nome');
  if (!dados.categoria) throw criarErro('Campo obrigatório: categoria');
  validarCategoria(dados.categoria);
  if (dados.preco === undefined || dados.preco === null) {
    throw criarErro('Campo obrigatório: preco');
  }
  const preco = Number(dados.preco);
  if (!Number.isInteger(preco) || preco < 0) {
    throw criarErro('Preço deve ser um inteiro não negativo');
  }
}

function formatarItem(item) {
  return {
    id_item_loja: item.id_item_loja,
    nome: item.nome,
    descricao: item.descricao,
    imagem: item.imagem,
    categoria: item.categoria,
    preco: item.preco,
    ativo: Boolean(item.ativo)
  };
}

async function listarItens(solicitante, filtros) {
  const where = {};
  if (solicitante.tipo !== 'administrador') where.ativo = true;
  if (filtros.categoria) where.categoria = categoriaCanonica(filtros.categoria);

  const itens = await ItemLoja.findAll({
    where,
    order: [['id_item_loja', 'ASC']]
  });
  return itens.map(formatarItem);
}

async function buscarItem(id_item_loja, solicitante) {
  const item = await ItemLoja.findByPk(id_item_loja);
  if (!item) throw criarErro('Item não encontrado', 404);
  if (solicitante.tipo !== 'administrador' && !item.ativo) {
    throw criarErro('Item não encontrado', 404);
  }
  return formatarItem(item);
}

async function criarItem(dados) {
  validarItem(dados);

  const item = await ItemLoja.create({
    nome: dados.nome,
    descricao: dados.descricao,
    imagem: dados.imagem,
    categoria: validarCategoria(dados.categoria),
    preco: Number(dados.preco),
    ativo: dados.ativo === undefined ? true : Boolean(dados.ativo)
  });

  return formatarItem(item);
}

async function atualizarItem(id_item_loja, dados) {
  const item = await ItemLoja.findByPk(id_item_loja);
  if (!item) throw criarErro('Item não encontrado', 404);

  if (dados.preco !== undefined) {
    const preco = Number(dados.preco);
    if (!Number.isInteger(preco) || preco < 0) {
      throw criarErro('Preço deve ser um inteiro não negativo');
    }
  }

  const alteracoes = {};
  for (const campo of ['nome', 'descricao', 'imagem', 'preco']) {
    if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
  }
  if (dados.categoria !== undefined) {
    alteracoes.categoria = validarCategoria(dados.categoria);
  }

  await item.update(alteracoes);
  return formatarItem(item);
}

async function alterarStatus(id_item_loja, ativo) {
  if (ativo === undefined || ativo === null) {
    throw criarErro('Campo obrigatório: ativo');
  }

  const item = await ItemLoja.findByPk(id_item_loja);
  if (!item) throw criarErro('Item não encontrado', 404);

  await item.update({ ativo: Boolean(ativo) });
  return formatarItem(item);
}

async function comprar(id_aluno, id_item_loja) {
  return sequelize.transaction(async (transaction) => {
    const item = await ItemLoja.findByPk(id_item_loja, { transaction });
    if (!item) throw criarErro('Item não encontrado', 404);
    if (!item.ativo) throw criarErro('Item inativo', 400);

    const existente = await AlunoItemLoja.findOne({
      where: {
        aluno_id_usuario: id_aluno,
        item_loja_id_item_loja: id_item_loja
      },
      transaction
    });
    if (existente) throw criarErro('Item já adquirido', 409);

    const aluno = await Aluno.findByPk(id_aluno, { transaction });
    if (!aluno) throw criarErro('Aluno não encontrado', 404);
    if (aluno.moedas < item.preco) throw criarErro('Moedas insuficientes');

    const [atualizados] = await Aluno.update(
      { moedas: literal(`moedas - ${item.preco}`) },
      {
        where: {
          id_usuario: id_aluno,
          moedas: { [Op.gte]: item.preco }
        },
        transaction
      }
    );

    if (atualizados === 0) throw criarErro('Moedas insuficientes');

    await AlunoItemLoja.create(
      {
        aluno_id_usuario: id_aluno,
        item_loja_id_item_loja: id_item_loja
      },
      { transaction }
    );

    const desbloqueadas = await ConquistaService.verificarConquistas(
      id_aluno,
      transaction
    );
    const alunoAtualizado = await Aluno.findByPk(id_aluno, { transaction });

    return {
      item: formatarItem(item),
      moedas: alunoAtualizado.moedas,
      conquistas: desbloqueadas.map((conquista) => ({
        id_conquista: conquista.id_conquista,
        nome_conquista: conquista.nome_conquista
      }))
    };
  });
}

function formatarInventario(registro) {
  return {
    ...formatarItem(registro.item),
    equipado: Boolean(registro.equipado),
    data_compra: registro.data_compra
  };
}

async function inventario(id_aluno) {
  const registros = await AlunoItemLoja.findAll({
    where: { aluno_id_usuario: id_aluno },
    include: [{ model: ItemLoja, as: 'item' }],
    order: [['data_compra', 'DESC']]
  });

  return registros.map(formatarInventario);
}

async function equipados(id_aluno) {
  const registros = await AlunoItemLoja.findAll({
    where: { aluno_id_usuario: id_aluno, equipado: true },
    include: [{ model: ItemLoja, as: 'item' }]
  });

  return registros.map(formatarInventario);
}

async function aparencia(id_aluno) {
  const [usuario, registros] = await Promise.all([
    Usuario.findByPk(id_aluno, { attributes: ['id_usuario', 'nome'] }),
    AlunoItemLoja.findAll({
      where: { aluno_id_usuario: id_aluno, equipado: true },
      include: [{ model: ItemLoja, as: 'item' }],
      order: [['data_compra', 'ASC']]
    })
  ]);

  if (!usuario) throw criarErro('Aluno não encontrado', 404);

  const resultado = {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    avatar: null,
    borda: null,
    titulo: null,
    fundo: null
  };

  for (const registro of registros) {
    const categoria = categoriaCanonica(registro.item.categoria);
    if (CATEGORIAS.includes(categoria) && resultado[categoria] === null) {
      resultado[categoria] = {
        id_item_loja: registro.item.id_item_loja,
        nome: registro.item.nome,
        valor: registro.item.imagem
      };
    }
  }

  return resultado;
}

async function equipar(id_aluno, id_item_loja) {
  return sequelize.transaction(async (transaction) => {
    const compra = await AlunoItemLoja.findOne({
      where: {
        aluno_id_usuario: id_aluno,
        item_loja_id_item_loja: id_item_loja
      },
      transaction
    });
    if (!compra) throw criarErro('Item não pertence ao aluno', 403);

    const item = await ItemLoja.findByPk(id_item_loja, { transaction });
    const compras = await AlunoItemLoja.findAll({
      where: { aluno_id_usuario: id_aluno },
      include: [{ model: ItemLoja, as: 'item' }],
      transaction
    });

    const categoria = categoriaCanonica(item.categoria);
    const idsMesmaCategoria = compras
      .filter((registro) => categoriaCanonica(registro.item.categoria) === categoria)
      .map((registro) => registro.item_loja_id_item_loja);

    await AlunoItemLoja.update(
      { equipado: false },
      {
        where: {
          aluno_id_usuario: id_aluno,
          item_loja_id_item_loja: { [Op.in]: idsMesmaCategoria }
        },
        transaction
      }
    );

    await compra.update({ equipado: true }, { transaction });

    const registro = await AlunoItemLoja.findOne({
      where: {
        aluno_id_usuario: id_aluno,
        item_loja_id_item_loja: id_item_loja
      },
      include: [{ model: ItemLoja, as: 'item' }],
      transaction
    });

    return formatarInventario(registro);
  });
}

async function desequipar(id_aluno, id_item_loja) {
  const compra = await AlunoItemLoja.findOne({
    where: {
      aluno_id_usuario: id_aluno,
      item_loja_id_item_loja: id_item_loja
    },
    include: [{ model: ItemLoja, as: 'item' }]
  });
  if (!compra) throw criarErro('Item não pertence ao aluno', 403);

  await compra.update({ equipado: false });
  return formatarInventario(compra);
}

module.exports = {
  listarItens,
  buscarItem,
  criarItem,
  atualizarItem,
  alterarStatus,
  comprar,
  inventario,
  equipados,
  aparencia,
  equipar,
  desequipar
};
