const CHAVE_TOKEN = 'token_auditoria';

const painelLogin = document.getElementById('painel-login');
const painelAuditoria = document.getElementById('painel-auditoria');
const formLogin = document.getElementById('form-login');
const erroLogin = document.getElementById('erro-login');
const listaBlocos = document.getElementById('lista-blocos');
const totalBlocos = document.getElementById('total-blocos');
const statusCadeia = document.getElementById('status-cadeia');
const mensagem = document.getElementById('mensagem');

const ROTULOS_ACAO = {
  inclusao: 'Inclusão',
  alteracao: 'Alteração',
  exclusao: 'Exclusão',
  compra: 'Compra'
};

function token() {
  return sessionStorage.getItem(CHAVE_TOKEN);
}

function mostrarLogin() {
  painelAuditoria.classList.add('oculto');
  painelLogin.classList.remove('oculto');
}

function mostrarPainel() {
  painelLogin.classList.add('oculto');
  painelAuditoria.classList.remove('oculto');
}

function definirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo ? `mensagem ${tipo}` : 'mensagem';
}

function criarCampo(rotulo, valor, tipo) {
  const campo = document.createElement('div');
  campo.className = 'campo';

  const titulo = document.createElement('span');
  titulo.className = 'campo-rotulo';
  titulo.textContent = rotulo;

  const elemento = document.createElement(tipo === 'detalhes' ? 'pre' : tipo === 'hash' ? 'code' : 'p');
  elemento.className = tipo === 'detalhes' ? 'campo-valor' : tipo === 'hash' ? 'hash' : 'campo-valor';
  elemento.textContent = valor;

  campo.append(titulo, elemento);
  return campo;
}

function formatarData(valor) {
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? String(valor) : data.toLocaleString('pt-BR');
}

function formatarDetalhes(detalhes) {
  if (detalhes === null || detalhes === undefined) return '—';
  if (typeof detalhes === 'string') return detalhes;
  return JSON.stringify(detalhes, null, 2);
}

function renderizar(blocos) {
  listaBlocos.replaceChildren();

  if (blocos.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhum registro de auditoria.';
    listaBlocos.append(vazio);
    return;
  }

  for (const bloco of blocos) {
    const artigo = document.createElement('article');
    artigo.className = 'bloco';
    artigo.dataset.id = String(bloco.id_log);

    const topo = document.createElement('div');
    topo.className = 'bloco-topo';

    const titulo = document.createElement('h2');
    titulo.className = 'bloco-titulo';
    titulo.textContent = `Bloco #${bloco.id_log} · ${ROTULOS_ACAO[bloco.acao] || bloco.acao}`;

    const selo = document.createElement('span');
    selo.className = 'etiqueta neutra';
    selo.dataset.status = 'pendente';
    selo.textContent = 'Não verificado';

    topo.append(titulo, selo);

    const corpo = document.createElement('div');
    corpo.className = 'bloco-corpo';
    corpo.append(
      criarCampo('Data e hora', formatarData(bloco.data_hora)),
      criarCampo(
        'Usuário responsável',
        bloco.id_usuario
          ? `${bloco.usuario_nome} (#${bloco.id_usuario})`
          : bloco.usuario_nome
      ),
      criarCampo('Ação', ROTULOS_ACAO[bloco.acao] || bloco.acao),
      criarCampo(
        'Entidade',
        bloco.entidade_id ? `${bloco.entidade} #${bloco.entidade_id}` : bloco.entidade
      ),
      criarCampo('Detalhes', formatarDetalhes(bloco.detalhes), 'detalhes'),
      criarCampo('Hash do bloco anterior', bloco.hash_anterior, 'hash'),
      criarCampo('Hash do bloco atual', bloco.hash_atual, 'hash')
    );

    artigo.append(topo, corpo);
    listaBlocos.append(artigo);
  }
}

async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(`/api${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(opcoes.headers || {}),
      Authorization: `Bearer ${token()}`
    }
  });

  const dados = await resposta.json().catch(() => null);

  if (resposta.status === 401 || resposta.status === 403) {
    sessionStorage.removeItem(CHAVE_TOKEN);
    mostrarLogin();
    throw new Error((dados && dados.erro) || 'Acesso negado');
  }

  if (!resposta.ok) {
    throw new Error((dados && dados.erro) || 'Falha na requisição');
  }

  return dados;
}

async function carregar() {
  try {
    const blocos = await requisitar('/auditoria');
    renderizar(blocos);
    totalBlocos.textContent = `${blocos.length} ${blocos.length === 1 ? 'bloco' : 'blocos'}`;
    statusCadeia.textContent = 'Não verificada';
    statusCadeia.className = 'etiqueta neutra';
    definirMensagem('', '');
  } catch (erro) {
    if (token()) definirMensagem(erro.message, 'erro');
  }
}

async function verificar() {
  try {
    const resultado = await requisitar('/auditoria/verificar');
    const idsInvalidos = new Set(resultado.problemas.map((problema) => problema.id_log));

    for (const bloco of listaBlocos.querySelectorAll('.bloco')) {
      const id = Number(bloco.dataset.id);
      const selo = bloco.querySelector('[data-status]');
      const invalido = idsInvalidos.has(id);

      bloco.classList.toggle('invalido', invalido);
      selo.className = invalido ? 'etiqueta erro' : 'etiqueta ok';
      selo.textContent = invalido ? 'Inválido' : 'Válido';
    }

    if (resultado.integra) {
      statusCadeia.textContent = 'Íntegra';
      statusCadeia.className = 'etiqueta ok';
      definirMensagem(
        `Cadeia íntegra: ${resultado.total} ${resultado.total === 1 ? 'bloco verificado' : 'blocos verificados'}.`,
        'ok'
      );
    } else {
      statusCadeia.textContent = 'Comprometida';
      statusCadeia.className = 'etiqueta erro';
      definirMensagem(
        `Cadeia comprometida: ${resultado.problemas.length} problema(s) em ${idsInvalidos.size} bloco(s).`,
        'erro'
      );
    }
  } catch (erro) {
    if (token()) definirMensagem(erro.message, 'erro');
  }
}

formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erroLogin.textContent = '';

  try {
    const resposta = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
      })
    });
    const dados = await resposta.json();

    if (!resposta.ok) throw new Error(dados.erro || 'Falha no login');
    if (dados.usuario.tipo !== 'administrador') {
      throw new Error('Apenas administradores podem acessar a auditoria.');
    }

    sessionStorage.setItem(CHAVE_TOKEN, dados.token);
    formLogin.reset();
    mostrarPainel();
    await carregar();
  } catch (erro) {
    erroLogin.textContent = erro.message;
    mostrarLogin();
  }
});

document.getElementById('botao-atualizar').addEventListener('click', carregar);
document.getElementById('botao-verificar').addEventListener('click', verificar);
document.getElementById('botao-sair').addEventListener('click', () => {
  sessionStorage.removeItem(CHAVE_TOKEN);
  listaBlocos.replaceChildren();
  mostrarLogin();
});

if (token()) {
  mostrarPainel();
  carregar();
} else {
  mostrarLogin();
}
