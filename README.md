# MD-LINKS 💻

## 1. Introdução 🤩
O Markdown Links é uma biblioteca desenvolvida para auxiliar na leitura e validação de links presentes em arquivos no formato Markdown `(extensão .md)`. A biblioteca é executada através de uma interface de linha de comando `(CLI)` e pode ser utilizada tanto em projetos Node.js como em aplicações no terminal.

A biblioteca é capaz de ler um arquivo `.md`, identificar os links presentes nele e, opcionalmente, validar cada link através de requisições `HTTP` para verificar se estão ativos ou quebrados. Além disso, é possível obter estatísticas sobre os links encontrados, como o total de links, links únicos e links quebrados.

## 2. Instalação e Uso ✅

### 2.1 Instalação
Para instalar a biblioteca, utilize o gerenciador de pacotes npm. No terminal, execute o seguinte comando:

```bash
  npm install md-links-larissadepaula
```
#### 2.2 Utilização
Após a instalação, você poderá utilizar o Markdown Links através da CLI, basta executar o seguinte comando:
```bash
  mdlinks <caminho-do-arquivo> [--validate] [--stats]
```

Onde:

- < caminho-do-arquivo > : O caminho para o arquivo .md que deseja analisar.
 - --validate: (Opcional) Realiza a validação dos links, exibindo o status de cada link (ativo ou quebrado).
 - --stats: (Opcional) Exibe estatísticas dos links, como o total de links e links únicos.
Exemplo:

## 3. Funcionalidades da Biblioteca 🚀
O Markdown Links oferece as seguintes funcionalidades:

#### 3.1 Extração de Links
A biblioteca é capaz de ler um arquivo .md e extrair os links presentes nele. Os links são identificados pelo formato `[texto] (url)`.

![links](/imagens/links.png)

#### 3.2 Validação de Links
Utilizando a opção --validate na CLI, a biblioteca realizará uma requisição HTTP para cada link encontrado a fim de verificar se estão ativos ou quebrados. Os links ativos terão o status "ok" e os quebrados terão o status "fail".

![links-validate](/imagens/links-validate.png)
#### 3.3 Estatísticas de Links
Utilizando a opção --stats na CLI, a biblioteca exibirá estatísticas sobre os links encontrados no arquivo. Será exibido o total de links e a quantidade de links únicos.

![links-stats](/imagens/links-stats.png)
#### 3.4 Validação e Estatísticas de Links
Utilizando as opções --validate --stats na CLI, a biblioteca exibirá tanto as estatísticas quanto a validação dos links encontrados.

![links-validate-stats](/imagens/links-validate-stats.png)


## Fluxograma do Projeto

![fluxograma](/imagens/Diagrama%20MDLINKS.png)
## Autores ✍️
O Markdown Links foi desenvolvido por `Larissa de Paula` como proposta ao quarto projeto da Laboratoria.

| [![Larissa GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/laridepaula) | [![LinkedIn](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/larissa-de-paula-gon%C3%A7alves-aa3504a1/) |
