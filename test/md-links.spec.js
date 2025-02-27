const { describe, it, expect } = require('@jest/globals');
const assert = require('assert');
// const chalk = require("chalk");
const {
  extractLinks,
  fileRead,
  readDirectory,
  validateLink,
  getFileData,
  mdlinks
} = require('../src/index.js');

describe('extractLinks', () => {
  it('Deveria extrair os links, com text e href', () => {
    const markdownContent = `
      # Título
      [link de exemplo](https://www.exemplo.com)
      Aqui está outro modelo [modelo](https://www.modelo.com) em um parágrafo.

      Uma comunidade open source nos propôs criar uma ferramenta, usando [Node.js](https://nodejs.org/)

      [Node.js](https://nodejs.org/pt-br/) é um ambiente de execução para JavaScript construído com o 
      [motor de JavaScript V8 do Chrome](https://developers.google.com/v8/). Ele vai nos permitir executar o JavaScript no nosso sistema operacional
    `;

    const expectedLinks = [
      {
        text: 'link de exemplo',
        href: 'https://www.exemplo.com',
        file: 'path/file.md',
      },
      {
        text: 'modelo',
        href: 'https://www.modelo.com',
        file: 'path/file.md',
      },
      {
        text: 'Node.js',
        href: 'https://nodejs.org/',
        file: 'path/file.md',
      },
      {
        text: 'Node.js',
        href: 'https://nodejs.org/pt-br/',
        file: 'path/file.md',
      },
      {
        text: 'motor de JavaScript V8 do Chrome',
        href: 'https://developers.google.com/v8/',
        file: 'path/file.md',
      },
    ];

    const links = extractLinks(markdownContent, 'path/file.md');
    expect(links).toEqual(expectedLinks);
  });
});

describe('fileRead', () => {
  it('deveria ler arquivos e extrair links', (done) => {
    const filePath = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md';
    fileRead(filePath)
      .then((links) => {
        assert(Array.isArray(links));
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('deve retornar um array vazio caso não encontre links em um arquivo', async () => {
    const filePath = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/testevazio.md';
    const links = await fileRead(filePath);
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBe(0);
  });
});

describe('readDirectory', () => {
  it('deveria ler o diretório e retornar um array com os caminhos dos arquivos', (done) => {
    const pathInput = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest';
    readDirectory(pathInput)
      .then((files) => {
        assert(Array.isArray(files));
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('deveria mostrar uma mensagem de erro caso ocorra um erro ao ler o diretório', (done) => {
    const pathInput = 'C:/Caminho/falso';
    readDirectory(pathInput)
      .then(() => {
        done(new Error('Erro, mas a promessa foi resolvida'));
      })
      .catch((error) => {
        assert.strictEqual(error instanceof Error, false);
        done();
      });
  });
});

describe('validateLink', () => {
  it('Deveria retornar a resposta correta para link valido', (done) => {
    const url = { href: 'http://exemplo.com' };

    validateLink(url)
      .then((response) => {
        assert.deepStrictEqual(response, {
          href: 'http://exemplo.com',
          status: 200,
          ok: "ok",
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});

describe('getFileData', () => {
  it('deve retornar o conteúdo de um arquivo', (done) => {
    const path = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md';

    getFileData(path)
      .then((data) => {
        const expectedData = [
          {
            file: 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md',
            href: 'https://curriculum.laboratoria.la/pt/topics/javascript/04-arrays',
            text: 'Arranjos'
          },
          {
            file: 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md',
            href: 'https://developer.com/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/',
            text: 'Array - MDN'
          }
        ];
        assert.deepEqual(data, expectedData);
        done();
      })
      .catch((error) => done(error));
  });
  it('deve lançar um erro para um caminho inválido', async () => {
    const invalidPath = 'caminho/para/arquivo_inexistente.md';
    await expect(getFileData(invalidPath)).rejects.toThrowError();
  });

  it('Deve retornar o conteúdo de todos os arquivos no diretório', (done) => {
    const path = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest';

    getFileData(path)
      .then((data) => {
        assert(Array.isArray(data));
        done();
      })
      .catch((error) => done(error));
  });
});

describe('mdlinks', () => {
  it('deve resolver com o resultado da função getFileData com validação', (done) => {
    const path = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md';

    mdlinks(path, { validate: true })
      .then((result) => {
        assert(Array.isArray(result));
        assert.deepStrictEqual(result, [
          {
            file: 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md',
            href: 'https://curriculum.laboratoria.la/pt/topics/javascript/04-arrays',
            text: 'Arranjos',
            status: 200,
            ok: 'ok'
          },
          {
            file: 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md',
            href: 'https://developer.com/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/',
            text: 'Array - MDN',
            status: 200,
            ok: 'ok'
          }
        ]);
        done();
      })
      .catch((error) => done(error));
  });

  it('deve resolver com o resultado da função getFileData sem validação', async () => {
    const filePath = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md';

    const result = await mdlinks(filePath, { validate: false });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('deve resolver com um array vazio quando não houver links no arquivo', async () => {
    const filePath = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/testevazio.md';
    const result = await mdlinks(filePath);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});