const { describe, it, expect } = require('@jest/globals');
const extractLinks = require('../src/index.js');

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
      '[link de exemplo](https://www.exemplo.com)',
      '[modelo](https://www.modelo.com)',
      '[Node.js](https://nodejs.org/)',
      '[Node.js](https://nodejs.org/pt-br/)',
      '[motor de JavaScript V8 do Chrome](https://developers.google.com/v8/)',
    ];

    const links = extractLinks(markdownContent);
    console.log(links);
    expect(links).toEqual(expectedLinks);
  });
});
