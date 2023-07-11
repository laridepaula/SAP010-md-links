const { describe, it, expect } = require('@jest/globals');
const assert = require('assert');
// const chalk = require("chalk");
const {
  extractLinks,
  fileRead,
  readDirectory,
  validateLink,
  mdlinks,
  getLinkStatistics,
  getFileData } = require('../src/index.js');

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

  /* it('deveria mostrar uma mensagem de erro caso não encontre links', (done) => {
    const filePath = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/testevazio.md';
    fileRead(filePath)
      .then(() => {
        done(new Error('Erro, mas a promessa foi resolvida'));
      })
      .catch((error) => {
        assert.strictEqual(error, chalk.red(`Não há links no arquivo ${filePath}`));
        done();
      });
  }); */
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

describe('getLinkStatistics', () => {
  it('deve retornar as estatísticas corretas para um conjunto de links', () => {
    const links = [
      { href: 'https://www.igual.com', ok: 'success' },
      { href: 'https://www.igual.com', ok: 'success' },
      { href: 'https://www.quebrado.com', ok: 'fail' },
      { href: 'https://www.diferente.com', ok: 'success' },
    ];

    const result = getLinkStatistics(links);

    expect(result.total).toBe(4); 
    expect(result.unique).toBe(3); 
    expect(result.broken).toBe(1); 
  });
});

describe('mdlinks', () => {
  it('retorna uma promessa que resolve com o resultado e as opções', () => {
    const path = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md';
    const options = { option1: true, option2: false };

    const expected = {
      result: {
        links: [
          {
            file: 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md',
            href: 'https://curriculum.laboratoria.la/pt/topics/javascript/04-arrays',
            ok: 'ok',
            status: 200,
            text: 'Arranjos',
          },
          {
            file: 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md',
            href: 'https://developer.com/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/',
            ok: 'ok',
            status: 200,
            text: 'Array - MDN',
          },
        ],
        statistics: {
          broken: 0,
          total: 2,
          unique: 2,
        },
      },
      options: { option1: true, option2: false },
    };

    return mdlinks(path, options).then((result) => {
      expect(result).toEqual(expected);
    });
  });
});

describe('getFileData', () => {
  it('deve retornar os links e estatísticas de um arquivo', (done) => {
    const path = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/teste.md';
    getFileData(path)
      .then((result) => {
        expect(result.links).toHaveLength(2);
        expect(result.statistics).toEqual({
          broken: 0,
          total: 2,
          unique: 2
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('deve retornar os links e estatísticas de um diretorio', (done) => {
    const path = 'C:/Users/twelve/Desktop/laboratorias/SAP010-md-links/src/mdtest/';
    getFileData(path)
      .then((result) => {
        expect(result.links).toHaveLength(2);
        expect(result.statistics).toEqual({
          broken: 0,
          total: 2,
          unique: 2
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
