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
