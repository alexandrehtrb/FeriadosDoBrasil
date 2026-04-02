# Feriados do Brasil

Este é o repositório de código para o site Feriados do Brasil.

- Hospedagem GitHub Pages: https://feriadosdobrasil.github.io
- Hospedagem Cloudflare Pages: https://feriadosdobrasil.pages.dev

## Tecnologias

* [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* [js-year-calendar](https://github.com/year-calendar/js-year-calendar)

Todo o cálculo de feriados é feito no próprio frontend. Não há backend, nem chamadas de API!

## Contribuindo

Sinta-se livre para abrir pull requests e issues, por exemplo, incluindo feriados municipais da sua cidade!

### Quero incluir os feriados da minha cidade

1) Fork nosso repo
2) No seu repo forkado, edite o arquivo `feriados_calculo.js`:
  - dentro da variável `estados`, encontre seu estado e município, e se não existir, adicione;
  - inclua apenas os feriados *municipais* da sua cidade;
  - sempre que possível, inclua um comentário com a fonte de referência sobre os feriados municipais (ex.: leis, decretos, site da prefeitura, notícias oficiais)
3) Commit e push seu código
4) Abra um pull request no nosso repo com seu código

## Doações

Nosso site é voltado para brasileiros e estrangeiros, com o intuito de esclarecer quais são os feriados nos diversos municípios do nosso país.

Esse tipo de informação é importante para planejamento de atividades, de férias e de escalas de trabalho. Não há uma base de dados pública e centralizada que forneça esses dados sobre todos os municípios do Brasil; é necessário um trabalho de curadoria e pesquisa nos sites de cada prefeitura, para identificar decretos e leis que determinem feriados.

Por isso, pedimos seu apoio. Você pode nos ajudar de diversas formas: inserindo feriados do seu município; contribuindo com o código-fonte; e através de doações em dinheiro.

Aceitamos doações através da chave PIX 🇧🇷: <a href="mailto:%61%6C%65%78%61%6E%64%72%65%68%74%72%62%40%6F%75%74%6C%6F%6F%6B%2E%63%6F%6D" target="_blank" rel="noreferrer">alexandrehtrb@<span/>outlook.com</a>. Valor sugerido de R$20,00.
