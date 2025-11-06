/**
 * Calculates Easter in the Gregorian/Western (Catholic and Protestant) calendar 
 * based on the algorithm by Oudin (1940) from http://www.tondering.dk/claus/cal/easter.php
 */
function calcularDomingoDePascoa(ano) {
  var f = Math.floor,
    // Golden Number - 1
    G = ano % 19,
    C = f(ano / 100),
    // related to Epact
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    // number of days from 21 March to the Paschal full moon
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    // weekday for the Paschal full moon
    J = (ano + f(ano / 4) + I + 2 - C + f(C / 4)) % 7,
    // number of days from 21 March to the Sunday on or before the Paschal full moon
    L = I - J,
    mes = 3 + f((L + 40) / 44),
    dia = L + 28 - 31 * f(mes / 4);

  return new Date(ano, mes - 1, dia);
}

function calcularSextaFeiraSanta(ano) {
  return calcularDomingoDePascoa(ano).addDays(-2);
}

function calcularTercaFeiraDeCarnaval(ano) {
  return calcularDomingoDePascoa(ano).addDays(-47);
}

function calcularQuintaFeiraDeCorpusChristi(ano) {
  return calcularDomingoDePascoa(ano).addDays(60);
}

function calcularSagradoCoracaoDeJesus(ano) {
  return calcularQuintaFeiraDeCorpusChristi(ano).addDays(8);
}

function calcularNossaSenhoraDaPenha(ano) {
  return calcularDomingoDePascoa(ano).addDays(8);
}

function calcularDiaDaFestaDeSantaAna(ano) {
  // https://pt.wikipedia.org/wiki/Festa_de_Sant%27Ana_de_Caic%C3%B3
  // O dia de Sant'Ana é 26 de julho,
  // porém, o dia da festa na cidade é sempre a última quinta-feira de julho.
  var ultimoDiaJulho = new Date(ano, JULHO, 31);
  var dia = ultimoDiaJulho;
  while (dia.getDay() != QUINTA_FEIRA) {
    dia = dia.addDays(-1);
  }
  return dia;
}

function calcularDiaDoComercio(ano) {
  var primeiroDiaOutubro = new Date(ano, OUTUBRO, 1);
  var primeiraSegundaFeiraOutubro = primeiroDiaOutubro.getNextWeekday(SEGUNDA_FEIRA);
  var terceiraSegundaFeiraOutubro = primeiraSegundaFeiraOutubro.addDays(14);
  return terceiraSegundaFeiraOutubro;
}

function deslocarFeriadoEstadualDoAcre(feriado) {
  /*
  Por meio da lei estadual nº 2.247/2009, os feriados estaduais que caírem entre as terças e quintas-feiras
  são comemorados, por adiamento, nas sextas-feiras, à exceção do feriado alusivo ao aniversário do estado do Acre.
  */
  return function (ano) {
    var obj = feriado(ano);
    switch (obj.data.getDay()) {
      case TERCA_FEIRA:
      case QUARTA_FEIRA:
      case QUINTA_FEIRA:
        obj.data = obj.data.getNextWeekday(SEXTA_FEIRA);
        return obj;
      default:
        return obj;
    }
  }
}

function deslocarFeriadoEstadualDeSantaCatarina(feriado) {
  /*
  Caso o dia 11 de agosto e o 25 de novembro coincidirem com dias úteis da semana,
  os feriados e os eventos alusivos às datas são transferidos para o domingo subsequente.
  Lei 13.408, de 15 de julho de 2005, Santa Catarina.
  */
  return function (ano) {
    var obj = feriado(ano);
    if (obj.data.getDay() != SABADO) {
      obj.data = obj.data.getNextWeekday(DOMINGO);
    }
    return obj;
  }
}

// feriado fixo
function ff(mes, dia, desc, anoInicioVigencia) {
  return function (ano) {
    return { data: new Date(ano, mes, dia), descricao: desc, anoInicioVigencia: anoInicioVigencia };
  }
}
// feriado móvel
function fm(funcCalcDia, desc) {
  return function (ano) {
    return { data: funcCalcDia(ano), descricao: desc };
  }
}
// feriados mais comuns
const aniversarioDaCidade = function (mes, dia) { return ff(mes, dia, "Aniversário da cidade") };
const tercaFeiraDeCarnaval = fm(calcularTercaFeiraDeCarnaval, "Terça-feira de Carnaval");
const diaDeSaoSebastiao = ff(JANEIRO, 20, "Dia de São Sebastião");
const diaDeSaoJose = ff(MARCO, 19, "Dia de São José");
const diaDeCorpusChristi = fm(calcularQuintaFeiraDeCorpusChristi, "Quinta-feira de Corpus-Christi");
const diaDoSagradoCoracaoDeJesus = fm(calcularSagradoCoracaoDeJesus, "Sagrado Coração de Jesus");
const diaDeSantoAntonio = ff(JUNHO, 13, "Dia de Santo Antônio");
const diaDeSaoJoao = ff(JUNHO, 24, "Dia de São João");
const diaDeSaoPedro = ff(JUNHO, 29, "Dia de São Pedro");
const diaDeSantAnna = ff(JULHO, 26, "Dia de Sant'Anna");
const diaDeNossaSenhoraDaConceicao = ff(DEZEMBRO, 8, "Dia de Nossa Senhora da Conceição");
// Várias cidades têm os dias de suas padroeiras celebrados nos dias de 
// Assunção de Nossa Senhora (15/08) e 
// Natividade de Nossa Senhora (08/09), 
// mas com nomes diferentes.

const feriadosNacionais = [
  ff(JANEIRO, 1, "Ano Novo"),
  fm(calcularTercaFeiraDeCarnaval, "Terça-feira de Carnaval (feriado a depender do lugar)"),
  fm(calcularSextaFeiraSanta, "Sexta-feira santa (Paixão de Cristo)"),
  ff(ABRIL, 21, "Tiradentes"),
  ff(MAIO, 1, "Dia do Trabalho"),
  ff(SETEMBRO, 7, "Independência do Brasil"),
  ff(OUTUBRO, 12, "Dia de Nossa Senhora Aparecida"),
  ff(OUTUBRO, 28, "Dia do Servidor Público (ponto facultativo para eles)"),
  ff(NOVEMBRO, 2, "Finados"),
  ff(NOVEMBRO, 15, "Proclamação da República"),
  // Dia da Consciência Negra agora é feriado nacional, PL 3268 / 2021
  ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2024),
  ff(DEZEMBRO, 25, "Natal")
];

// os estados estão em ordem alfabética considerando o nome por extenso
const estados = [
  {
    acronimo: "AC",
    nome: "Acre",
    feriadosEstaduais: [
      deslocarFeriadoEstadualDoAcre(ff(JANEIRO, 23, "Dia do evangélico")),
      deslocarFeriadoEstadualDoAcre(ff(MARCO, 8, "Dia Internacional da Mulher")),
      ff(JUNHO, 15, "Aniversário do estado"),
      deslocarFeriadoEstadualDoAcre(ff(SETEMBRO, 5, "Dia da Amazônia")),
      deslocarFeriadoEstadualDoAcre(ff(NOVEMBRO, 17, "Assinatura do Tratado de Petrópolis")),
    ],
    cidades: [
      {
        nome: "Cruzeiro do Sul",
        feriados: [
          // https://www.cruzeirodosul.ac.gov.br/paginas/feriados-2025
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Glória"),
          ff(SETEMBRO, 27, "Dia da Marcha para Jesus"),
          aniversarioDaCidade(SETEMBRO, 28)
        ]
      },
      {
        nome: "Rio Branco",
        feriados: [
          aniversarioDaCidade(DEZEMBRO, 28)
        ]
      },
      {
        nome: "Sena Madureira",
        feriados: [
          // https://www.senamadureira.ac.gov.br/product-page/decreto-n-029-2025-calend%C3%A1rio-de-feriados-e-pontos-facultativos-2025
          ff(ABRIL, 8, "Dia da Morte do Padre Paolino Maria Baldassari"),
          aniversarioDaCidade(SETEMBRO, 25),
          diaDeNossaSenhoraDaConceicao
        ]
      }
    ]
  },
  {
    acronimo: "AL",
    nome: "Alagoas",
    feriadosEstaduais: [
      // Dia da Consciência Negra -> Lei nº 5.724 de 01/08/1995 - Estadual - Alagoas
      ff(JUNHO, 24, "Dia de São João"),
      ff(JUNHO, 29, "Dia de São Pedro"),
      ff(SETEMBRO, 16, "Emancipação política de Alagoas"),
      ff(NOVEMBRO, 20, "Morte de Zumbi dos Palmares", 1995),
    ],
    cidades: [
      {
        nome: "Arapiraca",
        feriados: [
          ff(FEVEREIRO, 2, "Dia de Nossa Senhora do Bom Conselho"),
          diaDeCorpusChristi,
          ff(OUTUBRO, 30, "Emancipação Política de Arapiraca")
        ]
      },
      {
        nome: "Maceió",
        feriados: [
          diaDeCorpusChristi,
          ff(AGOSTO, 27, "Dia de Nossa Senhora dos Prazeres"),
          diaDeNossaSenhoraDaConceicao,
        ]
      }
    ]
  },
  {
    acronimo: "AP",
    nome: "Amapá",
    feriadosEstaduais: [
      // https://g1.globo.com/ap/amapa/noticia/2025/01/02/amapa-tera-mais-de-10-feriados-nacionais-e-estaduais-em-2025-veja-lista.ghtml
      // Dia de São Tiago e Dia do Evangélico não são feriados estaduais,
      // apesar de algumas prefeituras mencionarem erroneamente como tal.
      // Dia da Consciência Negra -> Lei nº 1.169 de 27/12/2007 - Estadual - Amapá
      ff(MARCO, 19, "Dia de São José"),
      ff(MAIO, 15, "Dia de Cabralzinho"),
      ff(SETEMBRO, 13, "Criação do Território Federal"),
      ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2008)
    ],
    cidades: [
      {
        nome: "Macapá",
        feriados: [
          aniversarioDaCidade(FEVEREIRO, 4)
        ]
      },
      {
        nome: "Oiapoque",
        feriados: [
          // https://www.oiapoque.ap.leg.br/transparencia/atos-da-presidencia/atos/atos-2023/atos/ato-da-presidencia-no-003-2024-gab-pres-cvmo-de-18-de-janeiro-de-2024/ato-da-presidencia-003-calendario-feriados-2024.pdf
          // https://www.tjap.jus.br/portal/noticias/1o-de-dezembro-123-anos-da-assinatura-do-laudo-suico-uma-historia-de-lutas-e-conquistas-do-povo-do-amapaense.html
          ff(ABRIL, 19, "Dia do Índio"),
          aniversarioDaCidade(MAIO, 23),
          ff(JULHO, 28, "Dia do Agricultor"),
          ff(AGOSTO, 15, "Dia de Nossa Senhora das Graças"),
          ff(DEZEMBRO, 1, "Dia do Laudo Suíço")
        ]
      },
      {
        nome: "Santana",
        feriados: [
          // https://portal.mpap.mp.br/calendario/
          diaDeSantAnna,
          aniversarioDaCidade(DEZEMBRO, 17)
        ]
      }
    ]
  },
  {
    acronimo: "AM",
    nome: "Amazonas",
    feriadosEstaduais: [
      // Dia da Consicência Negra -> Lei Ordinária nº 84, de 08 de julho de 2010 - SAPL
      ff(SETEMBRO, 5, "Elevação do Amazonas à categoria de província"),
      ff(DEZEMBRO, 8, "Dia de Nossa Senhora da Conceição"),
      ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2010)
    ],
    cidades: [
      {
        nome: "Itacoatiara",
        feriados: [
          // https://www.instagram.com/p/DFIPbnJqAxm/?img_index=3
          aniversarioDaCidade(ABRIL, 25),
          diaDeSaoPedro,
          ff(NOVEMBRO, 1, "Dia de Nossa Senhora do Rosário"),
        ]
      },
      {
        nome: "Manaus",
        feriados: [
          tercaFeiraDeCarnaval,
          aniversarioDaCidade(OUTUBRO, 24)
        ]
      },
      {
        nome: "Parintins",
        feriados: [
          // https://www.calendariox.com.br/feriados-parintins-am.html
          ff(MAIO, 14, "Sagração do Primeiro Bispo de Parintins"),
          ff(JULHO, 16, "Dia de Nossa Senhora do Carmo"),
          aniversarioDaCidade(OUTUBRO, 15)
        ]
      },
      {
        nome: "São Gabriel da Cachoeira",
        feriados: [
          // https://www.saogabrieldacachoeira.am.leg.br/leis/lei-organica-municipal/Lei%20Organica%20APROVADA.pdf/at_download/file
          aniversarioDaCidade(SETEMBRO, 3),
          ff(SETEMBRO, 29, "Dia de São Gabriel Arcanjo")
        ]
      }
    ]
  },
  {
    acronimo: "BA",
    nome: "Bahia",
    feriadosEstaduais: [
      ff(JULHO, 2, "Independência da Bahia"),
    ],
    cidades: [
      {
        nome: "Camaçari",
        feriados: [
          // https://arquivos.camacari.ba.gov.br/legislacao/Lei%202809.pdf
          ff(JANEIRO, 7, "Dia de São Tomaz da Cantuária", 1995),
          diaDeSaoJoao,
          ff(SETEMBRO, 28, "Emancipação do município")
        ]
      },
      {
        nome: "Feira de Santana",
        feriados: [
          // https://www.feiradesantana.ba.gov.br/servico.asp?id=2&link=segov/feriados.asp
          diaDeCorpusChristi,
          diaDeSaoJoao,
          diaDeSantAnna
        ]
      },
      {
        nome: "Luís Eduardo Magalhães",
        feriados: [
          // https://sai.io.org.br/HandlerPublicacao.ashx?mixed=ZG9jdW1lbnRvc1NFUC80NjkvMjAyNC8xLzE2LzI3MTg3MzQucGRm
          aniversarioDaCidade(MARCO, 30),
          diaDeCorpusChristi,
          diaDeSaoJoao,
          ff(AGOSTO, 2, "Dia do Evangélico"),
        ]
      },
      {
        nome: "Salvador",
        feriados: [
          diaDeCorpusChristi,
          diaDeSaoJoao,
          diaDeNossaSenhoraDaConceicao,
        ]
      },
      {
        nome: "Xique-Xique",
        feriados: [
          // https://xiquexique.ba.gov.br/prefeitura-de-xique-xique-divulga-calendario-de-feriados-do-municipio
          aniversarioDaCidade(JUNHO, 13),
          diaDeCorpusChristi,
          diaDeSaoJoao,
          ff(JULHO, 6, "Emancipação Política de Xique-Xique"),
          diaDeNossaSenhoraDaConceicao
        ]
      }
    ]
  },
  {
    acronimo: "CE",
    nome: "Ceará",
    feriadosEstaduais: [
      ff(MARCO, 19, "Dia de São José"),
      ff(MARCO, 25, "Abolição da escravidão no Ceará"),
      ff(AGOSTO, 15, "Dia de Nossa Senhora da Assunção (Padroeira de Fortaleza)"),
    ],
    cidades: [
      {
        nome: "Caucaia",
        feriados: [
          // https://www.caucaia.ce.gov.br/arquivos/1172/2209.pdf
          ff(AGOSTO, 15, "Dia de Nossa Senhora dos Prazeres"),
          aniversarioDaCidade(OUTUBRO, 15)
        ]
      },
      {
        nome: "Fortaleza",
        feriados: [
          aniversarioDaCidade(ABRIL, 13),
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Assunção de Nossa Senhora")
        ]
      },
      {
        nome: "Juazeiro do Norte",
        feriados: [
          // https://www.calendariox.com.br/feriados-juazeiro-do-norte-ce.html
          ff(MARCO, 24, "Aniversário de Padre Cícero"),
          aniversarioDaCidade(JULHO, 22),
          aniversarioDaCidade(SETEMBRO, 15, "Dia de Nossa Senhora das Dores")
        ]
      }
    ]
  },
  {
    acronimo: "DF",
    nome: "Distrito Federal",
    feriadosEstaduais: [
      ff(ABRIL, 21, "Fundação de Brasília"),
      ff(NOVEMBRO, 30, "Dia do evangélico"),
    ],
    cidades: [
      {
        nome: "Brasília",
        feriados: [
          // O aniversário de Brasília cai no dia de Tiradentes,
          // além disso, Brasília não possui municípios, por ser um distrito federal.
        ]
      }
    ]
  },
  {
    acronimo: "ES",
    nome: "Espírito Santo",
    feriadosEstaduais: [
      fm(calcularNossaSenhoraDaPenha, "Dia da Padroeira do Estado (Nossa Senhora da Penha)"),
    ],
    cidades: [
      {
        nome: "Cariacica",
        feriados: [
          // https://www.cariacica.es.gov.br/noticia/ler/89845/-/popup
          diaDeCorpusChristi,
          diaDeSaoJoao
        ]
      },
      {
        nome: "Serra",
        feriados: [
          // https://www.serra.es.gov.br/noticias/serra-divulga-calendario-de-feriados-e-pontos-facultativos-para-2025
          diaDeSaoPedro,
          diaDeNossaSenhoraDaConceicao,
          ff(DEZEMBRO, 26, "Dia do Serrano")
        ]
      },
      {
        nome: "Vila Velha",
        feriados: [
          // https://legislacao.vilavelha.es.gov.br/Arquivo/Documents/legislacao/html/D72025.html?identificador=340039003600310039003A004C00
          diaDeCorpusChristi,
          ff(MAIO, 23, "Colonização do Solo Espírito-Santense")
        ]
      },
      {
        nome: "Vitória",
        feriados: [
          diaDeCorpusChristi,
          ff(SETEMBRO, 8, "Dia de Nossa Senhora da Vitória"),
        ]
      }
    ]
  },
  {
    acronimo: "GO",
    nome: "Goiás",
    feriadosEstaduais: [
      ff(JULHO, 26, "Fundação da cidade de Goiás"),
      ff(OUTUBRO, 24, "Pedra Fundamental de Goiânia"),
    ],
    cidades: [
      {
        nome: "Anápolis",
        feriados: [
          // https://sapl.anapolis.go.leg.br/media/sapl/public/normajuridica/1968/3929/3929_texto_integral.pdf
          diaDeCorpusChristi,
          aniversarioDaCidade(JULHO, 31)
        ]
      },
      {
        nome: "Aparecida de Goiânia",
        feriados: [
          // https://www.calendariox.com.br/feriados-aparecida-de-goiania-go.html
          aniversarioDaCidade(MAIO, 11),
          ff(NOVEMBRO, 14, "Emacipação de Aparecida de Goiânia")
        ]
      },
      {
        nome: "Goiânia",
        feriados: [
          ff(MAIO, 24, "Dia de Nossa Senhora Auxiliadora"),
          diaDeCorpusChristi,
          aniversarioDaCidade(OUTUBRO, 24),
        ]
      }
    ]
  },
  {
    acronimo: "MA",
    nome: "Maranhão",
    feriadosEstaduais: [
      ff(JULHO, 28, "Adesão do Maranhão à independência do Brasil"),
    ],
    cidades: [
      {
        nome: "Imperatriz",
        feriados: [
          // https://novo.imperatriz.ma.gov.br/media/site/download/legislacao/LEI_N%C2%BA_370-85.pdf
          diaDeCorpusChristi,
          aniversarioDaCidade(JULHO, 16),
          ff(OUTUBRO, 15, "Dia de Santa Tereza D'Ávila"),
        ]
      },
      {
        nome: "São José de Ribamar",
        feriados: [
          // https://www.saojosederibamar.ma.gov.br/arquivo/legislacao/decreto_1127_2016
          diaDeSaoJose,
          diaDeCorpusChristi,
          ff(SETEMBRO, 24, "Emancipação Política do Município"),
          aniversarioDaCidade(DEZEMBRO, 16)
        ]
      },
      {
        nome: "São Luís",
        feriados: [
          diaDeSaoPedro,
          ff(SETEMBRO, 8, "Natividade de Nossa Senhora"),
          fm(calcularDiaDoComercio, "Dia do Comércio (apenas para comerciantes)"),
          diaDeNossaSenhoraDaConceicao,
        ]
      }
    ]
  },
  {
    acronimo: "MT",
    nome: "Mato Grosso",
    feriadosEstaduais: [
      // Dia da Consciência Negra -> lei de nº 7.879, de 27 de dezembro de 2002
      ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2003)
    ],
    cidades: [
      {
        nome: "Cuiabá",
        feriados: [
          aniversarioDaCidade(ABRIL, 8),
          diaDeCorpusChristi,
          diaDeNossaSenhoraDaConceicao
        ]
      },
      {
        nome: "Lucas do Rio Verde",
        feriados: [
          // https://www.lucasdorioverde.mt.gov.br/site/noticias/prefeitura-de-lucas-do-rio-verde-divulga-feriados-e-pontos-facultativos-de-2025-13456
          ff(MAIO, 13, "Dia de Nossa Senhora de Fátima"),
          aniversarioDaCidade(AGOSTO, 5),
        ]
      },
      {
        nome: "Primavera do Leste",
        feriados: [
          // DECRETO Nº 2.538, DE 07 DE FEVEREIRO DE 2025
          tercaFeiraDeCarnaval,
          ff(MAIO, 13, "Emancipação de Primavera do Leste"),
          diaDeCorpusChristi,
          ff(JULHO, 25, "Dia de São Cristóvão")
        ]
      },
      {
        nome: "Sinop",
        feriados: [
          // https://www.sonoticias.com.br/geral/prefeito-oficializa-lista-de-feriados-e-pontos-facultativos-em-sinop/
          diaDeSantoAntonio,
          aniversarioDaCidade(SETEMBRO, 14),
        ]
      },
      {
        nome: "Sorriso",
        feriados: [
          // https://site.sorriso.mt.gov.br/noticia/prefeitura-divulga-lista-de-feriados-e-pontos-facultativos-para-2025-67a0f34b30946
          aniversarioDaCidade(MAIO, 13),
          diaDeSaoPedro
        ]
      }
    ]
  },
  {
    acronimo: "MS",
    nome: "Mato Grosso do Sul",
    feriadosEstaduais: [
      ff(OUTUBRO, 11, "Criação do estado"),
    ],
    cidades: [
      {
        nome: "Campo Grande",
        feriados: [
          diaDeCorpusChristi,
          diaDeSantoAntonio,
          aniversarioDaCidade(AGOSTO, 26),
        ]
      },
      {
        nome: "Dourados",
        feriados: [
          // https://www.calendariox.com.br/feriados-dourados-ms.html
          diaDeNossaSenhoraDaConceicao,
          aniversarioDaCidade(DEZEMBRO, 20)
        ]
      },
      {
        nome: "Ponta Porã",
        feriados: [
          // https://www.mpms.mp.br/feriados/2025
          diaDeSaoJose,
          aniversarioDaCidade(JULHO, 18)
        ]
      },
      {
        nome: "Três Lagoas",
        feriados: [
          // https://www.calendariox.com.br/feriados-tres-lagoas-ms.html
          diaDeSantoAntonio,
          aniversarioDaCidade(JUNHO, 15)
        ]
      }
    ]
  },
  {
    acronimo: "MG",
    nome: "Minas Gerais",
    feriadosEstaduais: [
      ff(ABRIL, 21, "Data magna do estado"),
    ],
    cidades: [
      {
        nome: "Belo Horizonte",
        feriados: [
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Boa Viagem"),
          diaDeNossaSenhoraDaConceicao,
        ]
      },
      {
        nome: "Governador Valadares",
        feriados: [
          // https://www.valadares.mg.gov.br/detalhe-da-legislacao/info/lei-ordinaria-3831-1993/2389
          aniversarioDaCidade(JANEIRO, 30),
          diaDeCorpusChristi,
          diaDeSantoAntonio
        ]
      },
      {
        nome: "Itajubá",
        feriados: [
          // https://www.itajuba.mg.gov.br/abrir_arquivo.aspx/Portaria_183_2021?cdLocal=2&arquivo={4764771E-E70C-AA0B-6BAC-CD88BEDDBDD8}.pdf#search=feriados
          diaDeSaoJose,
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Piedade"),
        ]
      },
      {
        nome: "Nova Lima",
        feriados: [
          // https://cmnovalima.mg.gov.br/processo-legislativo/arquivos/3cf43abdcb3a0f16dc30f15307ce2879.pdf
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Dia de Nossa Senhora do Pilar"),
          diaDeNossaSenhoraDaConceicao
        ]
      },
      {
        nome: "Uberaba",
        feriados: [
          // http://www.uberaba.mg.gov.br/portal/acervo//legislacao/feriados_municipio/Lei%205545.pdf
          ff(MARCO, 2, "Dia de Uberaba"),
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Assunção de Nossa Senhora"),
        ]
      },
      {
        nome: "Uberlândia",
        feriados: [
          // https://www.uberlandia.mg.gov.br/prefeitura/secretarias/administracao/calendario-de-feriados/
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Abadia"),
          ff(AGOSTO, 31, "Dia de São Raimundo")
        ]
      }
    ]
  },
  {
    acronimo: "PA",
    nome: "Pará",
    feriadosEstaduais: [
      ff(AGOSTO, 15, "Adesão do Pará à independência do Brasil"),
    ],
    cidades: [
      {
        nome: "Ananindeua",
        feriados: [
          // https://www.ananindeua.pa.gov.br/midias/legislacao/2193_decreto_n_2_740_de_24_de_fevereiro_de_2025_.pdf
          aniversarioDaCidade(JANEIRO, 3),
          diaDeCorpusChristi,
          diaDeNossaSenhoraDaConceicao
        ]
      },
      {
        nome: "Belém",
        feriados: [
          aniversarioDaCidade(JANEIRO, 12),
          diaDeNossaSenhoraDaConceicao,
        ]
      },
      {
        nome: "Santarém",
        feriados: [
          // https://santarem.pa.gov.br/notas/governo-e-administracao/prefeitura-divulga-datas-de-feriados-nacionais-estadual-e-municipais-vgjyz7
          aniversarioDaCidade(JUNHO, 22),
          diaDeNossaSenhoraDaConceicao
        ]
      }
    ]
  },
  {
    acronimo: "PB",
    nome: "Paraíba",
    feriadosEstaduais: [
      ff(AGOSTO, 5, "Fundação do Estado em 1585 e dia da sua padroeira, Nossa Senhora das Neves"),
    ],
    cidades: [
      {
        nome: "Campina Grande",
        feriados: [
          // https://sapl.campinagrande.pb.leg.br/media/sapl/public/normajuridica/2019/7960/lei_no_7197.pdf
          diaDeCorpusChristi,
          diaDeSaoJoao,
          diaDeNossaSenhoraDaConceicao
        ]
      },
      {
        nome: "João Pessoa",
        feriados: [
          diaDeSaoJoao,
          aniversarioDaCidade(AGOSTO, 5),
          diaDeNossaSenhoraDaConceicao,
        ]
      },
      {
        nome: "Patos",
        feriados: [
          // https://www.ifpb.edu.br/patos/ensino/calendarios-2020/calendario-2025/tecnicos-integrados/integ2025.pdf
          ff(SETEMBRO, 24, "Dia de Nossa Senhora da Guia"),
          ff(OUTUBRO, 24, "Emancipação Política de Patos")
        ]
      }
    ]
  },
  {
    acronimo: "PR",
    nome: "Paraná",
    feriadosEstaduais: [
      // Desde 2014, por meio da lei estadual 18.384, 19 de dezembro (Emancipação política do estado do Paraná) deixou de ser feriado.
    ],
    cidades: [
      {
        nome: "Curitiba",
        feriados: [
          diaDeCorpusChristi,
          ff(SETEMBRO, 8, "Dia de Nossa Senhora da Luz dos Pinhais"),
        ]
      },
      {
        nome: "Foz do Iguaçu",
        feriados: [
          // https://www5.pmfi.pr.gov.br/noticia-49621
          aniversarioDaCidade(JUNHO, 10),
          diaDeCorpusChristi,
          diaDeSaoJoao
        ]
      },
      {
        nome: "Londrina",
        feriados: [
          // https://portal.londrina.pr.gov.br/feriados-pontos-facultativos
          diaDeCorpusChristi,
          diaDoSagradoCoracaoDeJesus,
          aniversarioDaCidade(DEZEMBRO, 10)
        ]
      },
      {
        nome: "Maringá",
        feriados: [
          // https://pt.scribd.com/document/841902321/Decreto-400-Feriados-2025-1
          aniversarioDaCidade(MAIO, 12),
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Abadia")
        ]
      }
    ]
  },
  {
    acronimo: "PE",
    nome: "Pernambuco",
    feriadosEstaduais: [
      ff(MARCO, 6, "Revolução Pernambucana de 1817"),
      ff(JUNHO, 24, "Dia de São João"),
    ],
    cidades: [
      {
        nome: "Garanhuns",
        feriados: [
          // https://garanhuns.pe.gov.br/nota-sobre-os-feriados-municipais-de-garanhuns/
          aniversarioDaCidade(FEVEREIRO, 4),
          diaDeCorpusChristi,
          diaDeSantoAntonio,
          diaDeSaoJoao
        ]
      },
      {
        nome: "Jaboatão dos Guararapes",
        feriados: [
          ff(JANEIRO, 15, "Dia de Santo Amaro"),
          ff(ABRIL, 17, "Dia de Nossa Senhora dos Prazeres"),
          aniversarioDaCidade(MAIO, 4),
        ]
      },
      {
        nome: "Olinda",
        feriados: [
          // https://www.olinda.pe.gov.br/nossa-cidade/feriados-municipais/
          aniversarioDaCidade(MARCO, 12),
          ff(AGOSTO, 6, "Dia de São Salvador do Mundo"),
          ff(NOVEMBRO, 10, "1º Grito de República no Brasil"),
        ]
      },
      {
        nome: "Petrolina",
        feriados: [
          // http://www.pe.portaldatransparencia.com.br/prefeitura/petrolina/?pagina=abreDocumento&arquivo=30EB0A5F
          diaDeCorpusChristi,
          diaDeSaoJoao,
          ff(AGOSTO, 15, "Dia de Nossa Senhora Rainha dos Anjos"),
          aniversarioDaCidade(SETEMBRO, 21),
        ]
      },
      {
        nome: "Recife",
        feriados: [
          ff(JULHO, 16, "Dia de Nossa Senhora do Carmo"),
          diaDeNossaSenhoraDaConceicao,
        ]
      }
    ]
  },
  {
    acronimo: "PI",
    nome: "Piauí",
    feriadosEstaduais: [
      ff(OUTUBRO, 19, "Dia do Piauí"),
    ],
    cidades: [
      {
        nome: "Parnaíba",
        feriados: [
          // https://www.parnaiba.pi.leg.br/wp-content/uploads/2023/09/PROJETO-DE-LEI-No-82-2023-PODER-EXECUTIVO.pdf
          diaDeCorpusChristi,
          aniversarioDaCidade(AGOSTO, 14),
          ff(SETEMBRO, 8, "Dia de Nossa Senhora Mãe da Divina Graça"),
          ff(OUTUBRO, 4, "Dia de São Francisco")
        ]
      },
      {
        nome: "Teresina",
        feriados: [
          diaDeCorpusChristi,
          aniversarioDaCidade(AGOSTO, 16),
          diaDeNossaSenhoraDaConceicao,
        ]
      }
    ]
  },
  {
    acronimo: "RJ",
    nome: "Rio de Janeiro",
    feriadosEstaduais: [
      // Dia da Consciência Negra -> LEI Nº 1929, DE 26 DE DEZEMBRO DE 1991.
      tercaFeiraDeCarnaval,
      ff(ABRIL, 23, "Dia de São Jorge"),
      fm(calcularDiaDoComercio, "Dia do Comércio (apenas para comerciantes e trabalhadores da construção civil)"),
      ff(NOVEMBRO, 20, "Dia da Consciência Negra", 1992)
    ],
    cidades: [
      {
        nome: "Duque de Caxias",
        feriados: [
          diaDeCorpusChristi,
          diaDeSantoAntonio,
        ]
      },
      {
        nome: "Nova Iguaçu",
        feriados: [
          diaDeSantoAntonio,
        ]
      },
      {
        nome: "Rio de Janeiro",
        feriados: [
          diaDeSaoSebastiao,
        ]
      },
      {
        nome: "São Gonçalo",
        feriados: [
          ff(JANEIRO, 10, "Dia de São Gonçalo"),
          aniversarioDaCidade(SETEMBRO, 22),
        ]
      }
    ]
  },
  {
    acronimo: "RN",
    nome: "Rio Grande do Norte",
    feriadosEstaduais: [
      ff(AGOSTO, 7, "Dia do Rio Grande do Norte"),
      ff(OUTUBRO, 3, "Mártires de Cunhaú e Uruaçu"),
    ],
    cidades: [
      {
        nome: "Caicó",
        feriados: [
          // https://pt.wikipedia.org/wiki/Caic%C3%B3
          fm(calcularDiaDaFestaDeSantaAna, "Festa de Sant'Ana"),
          aniversarioDaCidade(DEZEMBRO, 16),
        ]
      },
      {
        nome: "Mossoró",
        feriados: [
          // https://dom.mossoro.rn.gov.br/dom/ato/13663
          ff(SETEMBRO, 30, "Libertação dos escravos"),
          ff(DEZEMBRO, 13, "Dia de Santa Luzia")
        ]
      },
      {
        nome: "Natal",
        feriados: [
          ff(JANEIRO, 6, "Dia de Santos Reis"),
          diaDeCorpusChristi,
          ff(NOVEMBRO, 21, "Dia de Nossa Senhora da Apresentação"),
        ]
      }
    ]
  },
  {
    acronimo: "RS",
    nome: "Rio Grande do Sul",
    feriadosEstaduais: [
      ff(SETEMBRO, 20, "Dia do Gaúcho"),
    ],
    cidades: [
      {
        nome: "Chuí",
        feriados: [
          // https://chui.rs.gov.br/o-municipio/sobre-o-municipio/
          aniversarioDaCidade(OUTUBRO, 22)
        ]
      },
      {
        nome: "Porto Alegre",
        feriados: [
          ff(FEVEREIRO, 2, "Dia de Nossa Senhora dos Navegantes"),
        ]
      },
      {
        nome: "Santa Maria",
        feriados: [
          // https://www.santamaria.rs.gov.br/arquivos/baixar-arquivo/noticias/D10-2064.pdf
          aniversarioDaCidade(MAIO, 17),
          diaDeCorpusChristi,
          diaDeNossaSenhoraDaConceicao
        ]
      },
      {
        nome: "Uruguaiana",
        feriados: [
          // https://www.uruguaiana.rs.gov.br/portal/servicos/1269/feriados/
          diaDeCorpusChristi,
          diaDeSantAnna
        ]
      }
    ]
  },
  {
    acronimo: "RO",
    nome: "Rondônia",
    feriadosEstaduais: [
      ff(JANEIRO, 4, "Criação do estado"),
      ff(JUNHO, 18, "Dia do evangélico"),
    ],
    cidades: [
      {
        nome: "Ji-Paraná",
        feriados: [
          // https://rondonia.ro.gov.br/decreto-regulamenta-calendario-de-feriados-e-pontos-facultativos-para-2025-em-rondonia/
          ff(AGOSTO, 16, "Dia de São João Bosco"),
          aniversarioDaCidade(NOVEMBRO, 22)
        ]
      },
      {
        nome: "Porto Velho",
        feriados: [
          ff(JANEIRO, 24, "Dia de São Francisco de Sales"),
          aniversarioDaCidade(OUTUBRO, 2),
        ]
      }
    ]
  },
  {
    acronimo: "RR",
    nome: "Roraima",
    feriadosEstaduais: [
      ff(OUTUBRO, 5, "Criação do estado")
    ],
    cidades: [
      {
        nome: "Boa Vista",
        feriados: [
          diaDeSaoSebastiao,
          diaDeSaoPedro,
          aniversarioDaCidade(JULHO, 9),
          diaDeNossaSenhoraDaConceicao,
          ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2016) // Lei Ordinária nº 1.705, de 14 de junho de 2016 - SAPL
        ]
      },
      {
        nome: "Pacaraima",
        feriados: [
          // https://portal.pacaraima.rr.gov.br/index.php/publicacoes/preview/2178
          ff(OUTUBRO, 4, "Dia de São Francisco de Assis"),
          aniversarioDaCidade(OUTUBRO, 17)
        ]
      }
    ]
  },
  {
    acronimo: "SC",
    nome: "Santa Catarina",
    feriadosEstaduais: [
      deslocarFeriadoEstadualDeSantaCatarina(ff(AGOSTO, 11, "Dia de Santa Catarina (criação da capitania, separando-se de São Paulo)")),
      deslocarFeriadoEstadualDeSantaCatarina(ff(NOVEMBRO, 25, "Dia de Santa Catarina de Alexandria")),
    ],
    cidades: [
      {
        nome: "Balneário Camboriú",
        feriados: [
          tercaFeiraDeCarnaval,
          diaDeCorpusChristi,
          aniversarioDaCidade(JULHO, 20),
        ]
      },
      {
        nome: "Blumenau",
        feriados: [
          diaDeCorpusChristi,
          aniversarioDaCidade(SETEMBRO, 2),
        ]
      },
      {
        nome: "Florianópolis",
        feriados: [
          diaDeCorpusChristi,
          aniversarioDaCidade(MARCO, 23),
        ]
      },
      {
        nome: "Itajaí",
        feriados: [
          // https://leismunicipais.com.br/a/sc/i/itajai/decreto/2025/1347/13479/decreto-n-13479-2025-fixa-o-calendario-dos-pontos-facultativos-para-os-orgaos-da-administracao-direta-autarquias-e-fundacoes-publicas-do-poder-executivo-municipal
          // nenhum mesmo
        ]
      },
      {
        nome: "Jaraguá do Sul",
        feriados: [
          // https://senhas.jaraguadosul.sc.gov.br/calendario-feriados-e-pontos-facultativos?snow/BmRSdlFy/qoRZbeDe
          diaDeCorpusChristi,
          aniversarioDaCidade(JULHO, 25),
        ]
      },
      {
        nome: "Joinville",
        feriados: [
          aniversarioDaCidade(MARCO, 9),
          diaDeCorpusChristi,
        ]
      }
    ]
  },
  {
    acronimo: "SP",
    nome: "São Paulo",
    feriadosEstaduais: [
      // Dia da Consciência Negra -> Lei nº 17.746, de 12/09/2023
      ff(JULHO, 9, "Revolução Constitucionalista de 1932"),
      ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2023)
    ],
    cidades: [
      {
        nome: "Araraquara",
        feriados: [
          // https://www.camara-arq.sp.gov.br/Pagina/Listar/709
          // https://www.acidadeon.com/araraquara/economia/confira-os-feriados-e-pontos-facultativos-de-2025-em-araraquara/
          diaDeCorpusChristi,
          ff(JULHO, 11, "Dia de São Bento"),
          ff(AGOSTO, 22, "Imaculado Coração de Maria")
        ]
      },
      {
        nome: "Barueri",
        feriados: [
          diaDeSaoJoao,
          diaDeCorpusChristi,
          ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2007) // LEI Nº 1639, de 1 de Março de 2007
        ],
        excecoes: [
          {
            // https://peccicaccoadvogados.com.br/?p=10877
            ano: 2021,
            removidos: [
              "Dia de São João",
              "Dia da Consciência Negra"
            ],
            adicionados: [
              ff(MARCO, 29, "Dia de São João (adiantado de 2021, pandemia)"),
              ff(MARCO, 30, "Dia da Consciência Negra (adiantado de 2021, pandemia)"),
              ff(MARCO, 31, "Dia da Consciência Negra (adiantado de 2022, pandemia)"),
            ]
          },
          {
            ano: 2022,
            removidos: [
              "Dia da Consciência Negra",
            ]
          }
        ]
      },
      {
        nome: "Campinas",
        feriados: [
          // Dia da Consciência Negra -> Lei nº 11128 de 14 de janeiro de 2002
          diaDeCorpusChristi,
          diaDeNossaSenhoraDaConceicao,
          ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2002),
          ff(AGOSTO, 12, "Dia do Evangélico", 2026)
        ],
        excecoes: [
          {
            // https://campinas.sp.gov.br/noticias/para-melhorar-isolamento-social-campinas-antecipa-feriados-municipais-87625
            ano: 2020,
            removidos: [
              "Revolução Constitucionalista de 1932",
              "Quinta-feira de Corpus-Christi",
              "Dia da Consciência Negra"
            ],
            adicionados: [
              // TODO: 9 de julho foi adiantado em todo o estado de SP em 2020              
              ff(MAIO, 25, "Revolução Constitucionalista de 1932 (adiantado pela pandemia)"),
              ff(MAIO, 26, "Quinta-feira de Corpus-Christi (adiantado pela pandemia)"),
              ff(MAIO, 27, "Dia da Consciência Negra (adiantado pela pandemia)"),
            ]
          }
        ]
      },
      {
        nome: "Cubatão",
        feriados: [
          // https://diariooficial.cubatao.sp.gov.br/search_sres.php?id=MTYzMg==
          aniversarioDaCidade(ABRIL, 9),
          diaDeCorpusChristi,
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Lapa")
        ]
      },
      {
        nome: "Guarulhos",
        feriados: [
          diaDeNossaSenhoraDaConceicao
        ]
      },
      {
        nome: "Osasco",
        feriados: [
          aniversarioDaCidade(FEVEREIRO, 19),
          diaDeCorpusChristi,
          diaDeSantoAntonio,
        ]
      },
      {
        nome: "Paulínia",
        feriados: [
          // https://www.paulinia.sp.gov.br/feriados2025/
          aniversarioDaCidade(FEVEREIRO, 28),
          diaDoSagradoCoracaoDeJesus,
        ]
      },
      {
        nome: "Ribeirão Preto",
        feriados: [
          diaDeSaoSebastiao,
          diaDeCorpusChristi,
          ff(JUNHO, 19, "Dia de Santa Juliana Falconieri"),
        ]
      },
      {
        nome: "Santos",
        feriados: [
          // https://www.claudiamendes.com.br/boletim/feriados-e-pontos-facultativos-em-santos-2025-332
          aniversarioDaCidade(JANEIRO, 26),
          diaDeCorpusChristi,
          ff(SETEMBRO, 8, "Dia de Nossa Senhora do Monte Serrat")
        ]
      },
      {
        nome: "Santo André",
        feriados: [
          aniversarioDaCidade(ABRIL, 8),
          diaDeCorpusChristi
        ]
      },
      {
        nome: "São Bernardo do Campo",
        feriados: [
          diaDeCorpusChristi,
          aniversarioDaCidade(AGOSTO, 20)
        ]
      },
      {
        nome: "São Carlos",
        feriados: [
          // https://saocarlos.sp.gov.br/index.php/conheca-sao-carlos/115443-feriados.html
          ff(AGOSTO, 15, "Dia de Nossa Senhora da Babilônia"),
          ff(OUTUBRO, 15, "Dia do Professor (somente para os professores da rede municipal de ensino)"),
          aniversarioDaCidade(NOVEMBRO, 4),
          diaDeCorpusChristi,
        ]
      },
      {
        nome: "São José dos Campos",
        feriados: [
          diaDeSaoJose,
          diaDeCorpusChristi,
          aniversarioDaCidade(JULHO, 27),
        ]
      },
      {
        nome: "São Paulo",
        feriados: [
          // Dia da Consciência Negra, lei Nº 13.707 de 7 de Janeiro de 2004
          aniversarioDaCidade(JANEIRO, 25),
          diaDeCorpusChristi,
          ff(NOVEMBRO, 20, "Dia da Consciência Negra", 2004)
        ],
        excecoes: [
          {
            // https://g1.globo.com/sp/sao-paulo/noticia/2020/05/18/camara-de-sp-aprova-antecipacao-de-feriados-municipais-para-aumentar-isolamento-social.ghtml
            ano: 2020,
            removidos: [
              "Quinta-feira de Corpus-Christi",
              "Dia da Consciência Negra",
              "Revolução Constitucionalista de 1932"
            ],
            adicionados: [
              // TODO: 9 de julho foi adiantado em todo o estado de SP em 2020              
              ff(MAIO, 20, "Quinta-feira de Corpus-Christi (adiantado pela pandemia)"),
              ff(MAIO, 21, "Dia da Consciência Negra (adiantado pela pandemia)"),
              ff(MAIO, 25, "Revolução Constitucionalista de 1932 (adiantado pela pandemia)"),
            ]
          },
          {
            // https://g1.globo.com/sp/sao-paulo/noticia/2021/03/18/prefeitura-de-sp-antecipa-5-feriados-para-conter-avanco-da-covid-veja-como-fica-o-calendario.ghtml
            // https://peccicaccoadvogados.com.br/?p=10877
            ano: 2021,
            removidos: [
              "Quinta-feira de Corpus-Christi",
              "Dia da Consciência Negra",
            ],
            adicionados: [
              // TODO: 9 de julho foi adiantado em todo o estado de SP em 2020              
              ff(MARCO, 26, "Quinta-feira de Corpus-Christi (adiantado de 2021, pandemia)"),
              ff(MARCO, 29, "Dia da Consciência Negra (adiantado de 2021, pandemia)"),
              ff(MARCO, 30, "Aniversário da cidade de São Paulo (adiantado de 2022, pandemia)"),
              ff(MARCO, 31, "Quinta-feira de Corpus-Christi (adiantado de 2022, pandemia)"),
              ff(ABRIL, 1, "Dia da Consciência Negra (adiantado de 2022, pandemia)"),
            ]
          },
          {
            ano: 2022,
            removidos: [
              "Aniversário da cidade",
              "Quinta-feira de Corpus-Christi",
              "Dia da Consciência Negra",
            ]
          }
        ]
      },
      {
        nome: "Sumaré",
        feriados: [
          // https://www.sumare.sp.gov.br/pdfDiario.php?edicao=702&pdf=95a5e82515e74b2c82ed35bb9b27fb8b.pdf
          diaDeCorpusChristi,
          aniversarioDaCidade(JULHO, 26),
        ]
      },
      {
        nome: "Ubatuba",
        feriados: [
          // https://www.ubatuba.sp.gov.br/calendarios/calendario-municipal-2024/
          diaDeSaoPedro,
          ff(SETEMBRO, 14, "Paz de Iperoig"),
          aniversarioDaCidade(OUTUBRO, 28)
        ]
      },
      {
        nome: "Valinhos",
        feriados: [
          // https://www.valinhos.sp.gov.br/portal/secretarias-paginas/143/feriados-municipaisnacionais/
          diaDeSaoSebastiao,
          diaDeCorpusChristi
        ]
      },
      {
        nome: "Vinhedo",
        feriados: [
          // https://www.vinhedo.sp.gov.br/imgeditor/CALENDARIO%20PONTES%202025.pdf
          aniversarioDaCidade(ABRIL, 2),
          diaDeCorpusChristi,
          diaDeSantAnna
        ]
      }
    ]
  },
  {
    acronimo: "SE",
    nome: "Sergipe",
    feriadosEstaduais: [
      ff(JULHO, 8, "Emancipação política de Sergipe"),
    ],
    cidades: [
      {
        nome: "Aracaju",
        feriados: [
          aniversarioDaCidade(MARCO, 17),
          diaDeCorpusChristi,
          diaDeSaoJoao,
          diaDeNossaSenhoraDaConceicao,
        ]
      },
      {
        nome: "Nossa Senhora do Socorro",
        feriados: [
          // https://www.socorro.se.gov.br/feriados-municipais
          ff(FEVEREIRO, 2, "Dia de Nossa Senhora do Socorro"),
          diaDeCorpusChristi,
          ff(JULHO, 7, "Emancipação Política do Município"),
          ff(AGOSTO, 15, "Dia de Nossa Senhora do Amparo")
        ]
      }
    ]
  },
  {
    acronimo: "TO",
    nome: "Tocantins",
    feriadosEstaduais: [
      ff(MARCO, 18, "Autonomia do Estado (criação da Comarca do Norte)"),
      ff(SETEMBRO, 8, "Padroeira do Estado (Nossa Senhora da Natividade)"),
      ff(OUTUBRO, 5, "Criação do estado"),
    ],
    cidades: [
      {
        nome: "Araguaína",
        feriados: [
          // https://www.sindmetalurgicos-to.com.br/wp-content/uploads/2025/01/FERIADOS-2025-2.pdf
          diaDoSagradoCoracaoDeJesus,
          aniversarioDaCidade(NOVEMBRO, 14)
        ]
      },
      {
        nome: "Palmas",
        feriados: [
          diaDeSaoJose,
          aniversarioDaCidade(MAIO, 20),
        ]
      }
    ]
  }
];

function calcularFeriadosDoAnoParaLista(listaFeriados, tipo, ano) {
  var saida = [];
  listaFeriados.forEach(feriado => {
    var obj = feriado(ano);
    obj.tipo = tipo;
    if (obj.anoInicioVigencia != undefined && ano < obj.anoInicioVigencia) {
      // não incluir nesse caso.
    }
    else {
      saida.push(obj);
    }
  });
  return saida;
}

function obterTodosOsFeriadosParaAno(ano, uf, municipio, deveMarcarEmendas) {
  var nacionais = undefined;
  var estaduais = undefined;
  var municipais = undefined;

  // variável global com mesmo nome: feriadosNacionais
  nacionais = calcularFeriadosDoAnoParaLista(feriadosNacionais, "NACIONAL", ano);

  if (uf == undefined || uf == null || uf == "") {
    estaduais = [];
  } else {
    var uf = estados.find(x => x.acronimo == uf);
    estaduais = calcularFeriadosDoAnoParaLista(uf.feriadosEstaduais, "ESTADUAL", ano);
  }

  if (municipio == undefined || municipio == null || municipio == "") {
    municipais = [];
  } else {
    var municipio = uf.cidades.find(x => x.nome == municipio);
    municipais = calcularFeriadosDoAnoParaLista(municipio.feriados, "MUNICIPAL", ano);
  }

  // Gambiarra para tratar Carnaval repetido, por exemplo, no Rio de Janeiro e em Manaus
  var carnavalEstadual = estaduais.find(x => x.descricao.includes("Carnaval"));
  var carnavalMunicipal = municipais.find(x => x.descricao.includes("Carnaval"));

  if (carnavalEstadual != undefined || carnavalMunicipal != undefined) {
    // se houver feriado municipal ou estadual de Carnaval, vamos sobrepôr estes ao feriado nacional.
    nacionais = nacionais.filter(x => x.descricao.includes("Carnaval") == false);
  }

  // Gambiarra para tratar Dia da Consciência Negra repetido, por exemplo, em São Paulo e no Rio de Janeiro
  const conscienciaNegraStr = "Consciência Negra";
  var conscienciaNegraNacional = nacionais.find(x => x.descricao.includes(conscienciaNegraStr));
  var conscienciaNegraEstadual = estaduais.find(x => x.descricao.includes(conscienciaNegraStr));
  var conscienciaNegraMunicipal = municipais.find(x => x.descricao.includes(conscienciaNegraStr));

  if (conscienciaNegraNacional != undefined && (conscienciaNegraEstadual != undefined || conscienciaNegraMunicipal != undefined)) {
    // feriado nacional sobrepõe feriados estaduais e municipais.
    estaduais = estaduais.filter(x => x.descricao.includes(conscienciaNegraStr) == false);
    municipais = municipais.filter(x => x.descricao.includes(conscienciaNegraStr) == false);
  }
  else if (conscienciaNegraEstadual != undefined && conscienciaNegraMunicipal != undefined) {
    // feriado estadual sobrepõe feriados municipais.
    municipais = municipais.filter(x => x.descricao.includes(conscienciaNegraStr) == false);
  }

  var feriados = nacionais
    .concat(estaduais)
    .concat(municipais);

  // exceções da época da pandemia
  if (municipio != undefined && municipio.excecoes != undefined) {
    var excecoesAno = municipio.excecoes.find(x => x.ano == ano);
    if (excecoesAno != undefined && excecoesAno != null) {
      // tirar feriados removidos
      if (excecoesAno.removidos != undefined) {
        feriados = feriados.filter(x => !excecoesAno.removidos.includes(x.descricao));
      }
      // colocar feriados adicionados
      if (excecoesAno.adicionados != undefined) {
        feriados = feriados.concat(calcularFeriadosDoAnoParaLista(excecoesAno.adicionados, "MUNICIPAL", ano));
      }
    }
  }

  if (deveMarcarEmendas) {
    feriados = feriados.concat(obterEmendasDeFeriados(feriados));
  }

  return feriados.sort((a, b) => a.data - b.data);
}

function obterFinaisDeSemanaParaAno(ano) {
  const finaisDeSemana = [];
  var x = new Date(ano, JANEIRO, 1);
  while (x.getFullYear() == ano) {
    if (x.getDay() == SABADO || x.getDay() == DOMINGO) {
      finaisDeSemana.push(x);
    }
    x = x.addDays(1);
  }
  return finaisDeSemana;
}

function obterEmendasDeFeriados(feriados) {
  var emendasDeFeriado = [];
  for (var i = 0; i < feriados.length; i++) {
    var d = feriados[i].data;
    // TODO: Considerar emendas entre feriados com 2 dias de diferença entre um e outro
    if (d.getDay() == TERCA_FEIRA) {
      emendasDeFeriado.push({ ehEmenda: true, tipo: feriados[i].tipo, data: d.addDays(-1), descricao: "Emenda de feriado" });
    }
    else if (d.getDay() == QUINTA_FEIRA) {
      emendasDeFeriado.push({ ehEmenda: true, tipo: feriados[i].tipo, data: d.addDays(1), descricao: "Emenda de feriado" });
    }
  }
  return emendasDeFeriado;
}