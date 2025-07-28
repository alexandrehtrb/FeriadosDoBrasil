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
  - dentro da variável `estados`, inclua seu município;
  - dentro do método `obterFeriadosMunicipais()`, inclua os feriados *municipais* do seu município
  - sempre que possível, inclua um comentário com a fonte de referência sobre os feriados municipais (ex.: leis, decretos, site da prefeitura, notícias oficiais)
3) Commit e push seu código
4) Abra um pull request no nosso repo com seu código
