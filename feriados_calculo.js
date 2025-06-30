// os estados estão em ordem alfabética considerando o nome por extenso

const estados = [
    { acronimo: "AC", nome: "Acre", cidades: ["Rio Branco", "Sena Madureira"] },
    { acronimo: "AL", nome: "Alagoas", cidades: ["Maceió"] },
    { acronimo: "AP", nome: "Amapá", cidades: ["Macapá", "Oiapoque"] },
    { acronimo: "AM", nome: "Amazonas", cidades: ["Manaus", "São Gabriel da Cachoeira"] },
    { acronimo: "BA", nome: "Bahia", cidades: ["Feira de Santana", "Luís Eduardo Magalhães", "Salvador", "Xique-Xique"] },
    { acronimo: "CE", nome: "Ceará", cidades: ["Fortaleza"] },
    { acronimo: "DF", nome: "Distrito Federal", cidades: ["Brasília"] },
    { acronimo: "ES", nome: "Espírito Santo", cidades: ["Vitória"] },
    { acronimo: "GO", nome: "Goiás", cidades: ["Goiânia"] },
    { acronimo: "MA", nome: "Maranhão", cidades: ["Imperatriz", "São Luís"] },
    { acronimo: "MT", nome: "Mato Grosso", cidades: ["Cuiabá", "Lucas do Rio Verde", "Sinop", "Sorriso"] },
    { acronimo: "MS", nome: "Mato Grosso do Sul", cidades: ["Campo Grande"] },
    { acronimo: "MG", nome: "Minas Gerais", cidades: ["Belo Horizonte", "Governador Valadares", "Itajubá", "Nova Lima", "Uberaba", "Uberlândia"] },
    { acronimo: "PA", nome: "Pará", cidades: ["Belém"] },
    { acronimo: "PB", nome: "Paraíba", cidades: ["Campina Grande", "João Pessoa"] },
    { acronimo: "PR", nome: "Paraná", cidades: ["Curitiba", "Foz do Iguaçu", "Londrina", "Maringá"] },
    { acronimo: "PE", nome: "Pernambuco", cidades: ["Garanhuns", "Jaboatão dos Guararapes", "Olinda", "Petrolina", "Recife"] },
    { acronimo: "PI", nome: "Piauí", cidades: ["Teresina"] },
    { acronimo: "RJ", nome: "Rio de Janeiro", cidades: ["Duque de Caxias", "Nova Iguaçu", "Rio de Janeiro", "São Gonçalo"] },
    { acronimo: "RN", nome: "Rio Grande do Norte", cidades: ["Caicó", "Mossoró", "Natal"] },
    { acronimo: "RS", nome: "Rio Grande do Sul", cidades: ["Chuí", "Porto Alegre", "Santa Maria", "Uruguaiana"] },
    { acronimo: "RO", nome: "Rondônia", cidades: ["Porto Velho"] },
    { acronimo: "RR", nome: "Roraima", cidades: ["Boa Vista", "Pacaraima"] },
    { acronimo: "SC", nome: "Santa Catarina", cidades: ["Balneário Camboriú", "Blumenau", "Florianópolis", "Itajaí", "Joinville"] },
    { acronimo: "SP", nome: "São Paulo", cidades: ["Araraquara", "Barueri", "Campinas", "Guarulhos", "Osasco", "Paulínia", "Ribeirão Preto", "Santo André", "São Bernardo do Campo", "São Carlos", "São José dos Campos", "São Paulo", "Sumaré", "Valinhos", "Vinhedo"] },
    { acronimo: "SE", nome: "Sergipe", cidades: ["Aracaju"] },
    { acronimo: "TO", nome: "Tocantins", cidades: ["Palmas"] }
];

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

function calcularDiaDaFestaDeSantaAna(ano) {
    // https://pt.wikipedia.org/wiki/Festa_de_Sant%27Ana_de_Caic%C3%B3
    // O dia de Sant'Ana é 26 de julho,
    // porém, o dia da festa na cidade é sempre a última quinta-feira de julho.
    var ultimoDiaJulho = new Date(ano, JULHO, 31);
    var dia = ultimoDiaJulho;
    while (dia.getDay() != QUINTA_FEIRA)
    {
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

function deslocarFeriadoEstadualDoAcre(dataOriginal) {
    /*
    Por meio da lei estadual nº 2.247/2009, os feriados estaduais que caírem entre as terças e quintas-feiras
    são comemorados, por adiamento, nas sextas-feiras, à exceção do feriado alusivo ao aniversário do estado do Acre.
    */
    switch (dataOriginal.getDay()) {
        case TERCA_FEIRA:
        case QUARTA_FEIRA:
        case QUINTA_FEIRA:
            return dataOriginal.getNextWeekday(SEXTA_FEIRA);
        default:
            return dataOriginal;
    }
}

function deslocarFeriadoEstadualDeSantaCatarina(dataOriginal) {
    /*
    Caso o dia 11 de agosto e o 25 de novembro coincidirem com dias úteis da semana,
    os feriados e os eventos alusivos às datas são transferidos para o domingo subsequente.
    Lei 13.408, de 15 de julho de 2005, Santa Catarina.
    */
    if (dataOriginal.getDay() == SABADO)
        return dataOriginal;
    else
        return dataOriginal.getNextWeekday(DOMINGO);
}

function obterFeriadosNacionais(ano) {
    return [
        { tipo: "NACIONAL", data: new Date(ano, JANEIRO, 1), descricao: "Ano Novo" },
        { tipo: "NACIONAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval (feriado a depender do lugar)" },
        { tipo: "NACIONAL", data: calcularSextaFeiraSanta(ano), descricao: "Sexta-feira santa (Paixão de Cristo)" },
        { tipo: "NACIONAL", data: new Date(ano, ABRIL, 21), descricao: "Tiradentes" },
        { tipo: "NACIONAL", data: new Date(ano, MAIO, 1), descricao: "Dia do Trabalho" },
        { tipo: "NACIONAL", data: new Date(ano, SETEMBRO, 7), descricao: "Independência do Brasil" },
        { tipo: "NACIONAL", data: new Date(ano, OUTUBRO, 12), descricao: "Dia de Nossa Senhora Aparecida" },
        { tipo: "NACIONAL", data: new Date(ano, OUTUBRO, 28), descricao: "Dia do Servidor Público (ponto facultativo para eles)" },
        { tipo: "NACIONAL", data: new Date(ano, NOVEMBRO, 2), descricao: "Finados" },
        { tipo: "NACIONAL", data: new Date(ano, NOVEMBRO, 15), descricao: "Proclamação da República" },
        // PL 370/2023 torna Dia da Consciência Negra feriado estadual em SP
		// Dia da Consciência Negra agora é feriado nacional, PL 3268 / 2021
        { tipo: "NACIONAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
        { tipo: "NACIONAL", data: new Date(ano, DEZEMBRO, 25), descricao: "Natal" }
    ];
}
function obterFeriadosEstaduais(ano, uf) {
    switch (uf) {
        case "AC": return [
            { tipo: "ESTADUAL", data: deslocarFeriadoEstadualDoAcre(new Date(ano, JANEIRO, 23)), descricao: "Dia do evangélico" },
            { tipo: "ESTADUAL", data: deslocarFeriadoEstadualDoAcre(new Date(ano, MARCO, 8)), descricao: "Dia Internacional da Mulher" },
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 15), descricao: "Aniversário do estado" },
            { tipo: "ESTADUAL", data: deslocarFeriadoEstadualDoAcre(new Date(ano, SETEMBRO, 5)), descricao: "Dia da Amazônia" },
            { tipo: "ESTADUAL", data: deslocarFeriadoEstadualDoAcre(new Date(ano, NOVEMBRO, 17)), descricao: "Assinatura do Tratado de Petrópolis" },
        ];
        case "AL": return [
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" },
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 29), descricao: "Dia de São Pedro" },
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 16), descricao: "Emancipação política de Alagoas" },
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Morte de Zumbi dos Palmares" },
        ];
        case "AP": return [
            // https://g1.globo.com/ap/amapa/noticia/2025/01/02/amapa-tera-mais-de-10-feriados-nacionais-e-estaduais-em-2025-veja-lista.ghtml
            // Dia de São Tiago e Dia do Evangélico não são feriados estaduais,
            // apesar de algumas prefeituras mencionarem erroneamente como tal.
            { tipo: "ESTADUAL", data: new Date(ano, MARCO, 19), descricao: "Dia de São José" },
            { tipo: "ESTADUAL", data: new Date(ano, MAIO, 15), descricao: "Dia de Cabralzinho" },
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 13), descricao: "Criação do Território Federal" },
        ];
        case "AM": return [
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 5), descricao: "Elevação do Amazonas à categoria de província" },
            { tipo: "ESTADUAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "BA": return [
            { tipo: "ESTADUAL", data: new Date(ano, JULHO, 2), descricao: "Independência da Bahia" },
        ];
        case "CE": return [
            { tipo: "ESTADUAL", data: new Date(ano, MARCO, 19), descricao: "Dia de São José" },
            { tipo: "ESTADUAL", data: new Date(ano, MARCO, 25), descricao: "Abolição da escravidão no Ceará" },
            { tipo: "ESTADUAL", data: new Date(ano, AGOSTO, 15), descricao: "Dia de Nossa Senhora da Assunção (Padroeira de Fortaleza)" },
        ];
        case "DF": return [
            { tipo: "ESTADUAL", data: new Date(ano, ABRIL, 21), descricao: "Fundação de Brasília" },
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 30), descricao: "Dia do evangélico" },
        ];
        case "ES": return [
            { tipo: "ESTADUAL", data: calcularDomingoDePascoa(ano).addDays(8.0), descricao: "Dia da Padroeira do Estado (Nossa Senhora da Penha)" },
        ];
        case "GO": return [
            { tipo: "ESTADUAL", data: new Date(ano, JULHO, 26), descricao: "Fundação da cidade de Goiás" },
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 24), descricao: "Pedra Fundamental de Goiânia" },
        ];
        case "MA": return [
            { tipo: "ESTADUAL", data: new Date(ano, JULHO, 28), descricao: "Adesão do Maranhão à independência do Brasil" },
        ];
        case "MT": return [
        ];
        case "MS": return [
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 11), descricao: "Criação do estado" },
        ];
        case "MG": return [
            { tipo: "ESTADUAL", data: new Date(ano, ABRIL, 21), descricao: "Data magna do estado" },
        ];
        case "PA": return [
            { tipo: "ESTADUAL", data: new Date(ano, AGOSTO, 15), descricao: "Adesão do Pará à independência do Brasil" },
        ];
        case "PB": return [
            { tipo: "ESTADUAL", data: new Date(ano, AGOSTO, 5), descricao: "Fundação do Estado em 1585 e dia da sua padroeira, Nossa Senhora das Neves" },
        ];
        case "PR": return [
            // Desde 2014, por meio da lei estadual 18.384, 19 de dezembro (Emancipação política do estado do Paraná) deixou de ser feriado.
        ];
        case "PE": return [
            { tipo: "ESTADUAL", data: new Date(ano, MARCO, 6), descricao: "Revolução Pernambucana de 1817" },
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 24), descricao: "Festa de São João (Festa Junina)" },
        ];
        case "PI": return [
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 19), descricao: "Dia do Piauí" },
        ];
        case "RJ": return [
            { tipo: "ESTADUAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            { tipo: "ESTADUAL", data: new Date(ano, ABRIL, 23), descricao: "Dia de São Jorge" },
            { tipo: "ESTADUAL", data: calcularDiaDoComercio(ano), descricao: "Dia do Comércio (apenas para comerciantes e trabalhadores da construção civil)" },
        ];
        case "RN": return [
            { tipo: "ESTADUAL", data: new Date(ano, AGOSTO, 7), descricao: "Dia do Rio Grande do Norte" },
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 3), descricao: "Mártires de Cunhaú e Uruaçu" },
        ];
        case "RS": return [
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 20), descricao: "Dia do Gaúcho" },
        ];
        case "RO": return [
            { tipo: "ESTADUAL", data: new Date(ano, JANEIRO, 4), descricao: "Criação do estado" },
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 18), descricao: "Dia do evangélico" },
        ];
        case "RR": return [
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 5), descricao: "Criação do estado" }
        ];
        case "SC": return [
            { tipo: "ESTADUAL", data: deslocarFeriadoEstadualDeSantaCatarina(new Date(ano, AGOSTO, 11)), descricao: "Dia de Santa Catarina (criação da capitania, separando-se de São Paulo)" },
            { tipo: "ESTADUAL", data: deslocarFeriadoEstadualDeSantaCatarina(new Date(ano, NOVEMBRO, 25)), descricao: "Dia de Santa Catarina de Alexandria" },
        ];
        case "SP": return [
            
            { tipo: "ESTADUAL", data: new Date(ano, JULHO, 9), descricao: "Revolução Constitucionalista de 1932" },
        ];
        case "SE": return [
            { tipo: "ESTADUAL", data: new Date(ano, JULHO, 8), descricao: "Emancipação política de Sergipe" },
        ];
        case "TO": return [
            { tipo: "ESTADUAL", data: new Date(ano, MARCO, 18), descricao: "Autonomia do Estado (criação da Comarca do Norte)" },
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 8), descricao: "Padroeira do Estado (Nossa Senhora da Natividade)" },
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 5), descricao: "Criação do estado" },
        ];
        default:
            return [];
    }
}

function obterFeriadosMunicipais(ano, uf, municipio) {
    const fm = function (mes, dia, desc)
    {
        return { tipo: "MUNICIPAL", data: new Date(ano, mes, dia), descricao: desc };
    }
    // feriados mais comuns
    const diaDeSaoSebastiao = fm(JANEIRO, 20, "Dia de São Sebastião");
    const diaDeSaoJose = fm(MARCO, 19, "Dia de São José");
    const diaDeCorpusChristi = { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" };
    const diaDoSagradoCoracaoDeJesus = { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano).addDays(8), descricao: "Dia do Sagrado Coração de Jesus" };
    const diaDeSantoAntonio = fm(JUNHO, 13, "Dia de Santo Antônio");
    const diaDeSaoJoao = fm(JUNHO, 24, "Dia de São João");
    const diaDeSaoPedro = fm(JUNHO, 29, "Dia de São Pedro");
    const diaDeSantAnna = fm(JULHO, 26, "Dia de Sant'Anna");
    const diaDeAssuncaoDeNossaSenhora = fm(AGOSTO, 15, "Assunção de Nossa Senhora");
    const diaDeNossaSenhoraDaConceicao = fm(DEZEMBRO, 8, "Dia de Nossa Senhora da Conceição");
    const aniversarioDaCidade = function(mes, dia) {
        return fm(mes, dia, "Aniversário da cidade");
    }   

    var ufMunicipio = uf + "/" + municipio;
    switch (ufMunicipio) {
        case "AC/Rio Branco": return [
            aniversarioDaCidade(DEZEMBRO, 28)
        ];
        case "AC/Sena Madureira": return [
            // https://www.senamadureira.ac.gov.br/product-page/decreto-n-029-2025-calend%C3%A1rio-de-feriados-e-pontos-facultativos-2025
            fm(ABRIL, 8, "Dia da Morte do Padre Paolino Maria Baldassari"),
            aniversarioDaCidade(SETEMBRO, 25),
            diaDeNossaSenhoraDaConceicao
        ];
        case "AL/Maceió": return [
            diaDeCorpusChristi,
            fm(AGOSTO, 27, "Dia de Nossa Senhora dos Prazeres"),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "AP/Macapá": return [
            aniversarioDaCidade(FEVEREIRO, 4)
        ];
        case "AP/Oiapoque": return [
            // https://www.oiapoque.ap.leg.br/transparencia/atos-da-presidencia/atos/atos-2023/atos/ato-da-presidencia-no-003-2024-gab-pres-cvmo-de-18-de-janeiro-de-2024/ato-da-presidencia-003-calendario-feriados-2024.pdf
            // https://www.tjap.jus.br/portal/noticias/1o-de-dezembro-123-anos-da-assinatura-do-laudo-suico-uma-historia-de-lutas-e-conquistas-do-povo-do-amapaense.html
            fm(ABRIL, 19, "Dia do Índio"),
            aniversarioDaCidade(MAIO, 23),
            fm(JULHO, 28, "Dia do Agricultor"),
            diaDeAssuncaoDeNossaSenhora,
            fm(DEZEMBRO, 1, "Dia do Laudo Suíço")
        ];
        case "AM/Manaus": return [
            { tipo: "MUNICIPAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            aniversarioDaCidade(OUTUBRO, 24)
        ];
        case "AM/São Gabriel da Cachoeira": return [
            // https://www.saogabrieldacachoeira.am.leg.br/leis/lei-organica-municipal/Lei%20Organica%20APROVADA.pdf/at_download/file
            aniversarioDaCidade(SETEMBRO, 3),
            fm(SETEMBRO, 29, "Dia de São Gabriel Arcanjo")
        ];
        case "BA/Luís Eduardo Magalhães": return [
            // https://sai.io.org.br/HandlerPublicacao.ashx?mixed=ZG9jdW1lbnRvc1NFUC80NjkvMjAyNC8xLzE2LzI3MTg3MzQucGRm
            aniversarioDaCidade(MARCO, 30),
            diaDeCorpusChristi,
            diaDeSaoJoao,
            fm(AGOSTO, 2, "Dia do Evangélico"),
        ];
        case "BA/Feira de Santana": return [
            // https://www.feiradesantana.ba.gov.br/servico.asp?id=2&link=segov/feriados.asp
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeSantAnna
        ];
        case "BA/Salvador": return [
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "BA/Xique-Xique": return [
            // https://xiquexique.ba.gov.br/prefeitura-de-xique-xique-divulga-calendario-de-feriados-do-municipio
            aniversarioDaCidade(JUNHO, 13),
            diaDeCorpusChristi,
            diaDeSaoJoao,
            fm(JULHO, 6, "Emancipação Política de Xique-Xique"),
            diaDeNossaSenhoraDaConceicao
        ];
        case "CE/Fortaleza": return [
            aniversarioDaCidade(ABRIL, 13),
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora
        ];
        case "DF/Brasília": return [
            // O aniversário de Brasília cai no dia de Tiradentes,
            // além disso, Brasília não possui municípios, por ser um distrito federal.
        ];
        case "ES/Vitória": return [
            diaDeCorpusChristi,
            fm(SETEMBRO, 8, "Dia de Nossa Senhora da Vitória"),
        ];
        case "GO/Goiânia": return [
            fm(MAIO, 24, "Dia de Nossa Senhora Auxiliadora"),
            diaDeCorpusChristi,
            aniversarioDaCidade(OUTUBRO, 24),
        ];
        case "MA/Imperatriz": return [
            // https://novo.imperatriz.ma.gov.br/media/site/download/legislacao/LEI_N%C2%BA_370-85.pdf
            diaDeCorpusChristi,
            aniversarioDaCidade(JULHO, 16),
            fm(OUTUBRO, 15, "Dia de Santa Tereza D'Ávila"),
        ];
        case "MA/São Luís": return [
            diaDeSaoPedro,
            fm(SETEMBRO, 8, "Natividade de Nossa Senhora"),
            { tipo: "MUNICIPAL", data: calcularDiaDoComercio(ano), descricao: "Dia do Comércio (apenas para comerciantes)" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MT/Cuiabá": return [
            aniversarioDaCidade(ABRIL, 8),
            diaDeCorpusChristi,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MT/Lucas do Rio Verde": return [
            // https://www.lucasdorioverde.mt.gov.br/site/noticias/prefeitura-de-lucas-do-rio-verde-divulga-feriados-e-pontos-facultativos-de-2025-13456
            fm(MAIO, 13, "Dia de Nossa Senhora de Fátima"),
            aniversarioDaCidade(AGOSTO, 5),
        ];
        case "MT/Sinop": return [
            // https://www.sonoticias.com.br/geral/prefeito-oficializa-lista-de-feriados-e-pontos-facultativos-em-sinop/
            diaDeSantoAntonio,
            aniversarioDaCidade(SETEMBRO, 14),
        ];
        case "MT/Sorriso": return [
            // https://site.sorriso.mt.gov.br/noticia/prefeitura-divulga-lista-de-feriados-e-pontos-facultativos-para-2025-67a0f34b30946
            aniversarioDaCidade(MAIO, 13),
            diaDeSaoPedro
        ];
        case "MS/Campo Grande": return [
            diaDeCorpusChristi,
            diaDeSantoAntonio,
            aniversarioDaCidade(AGOSTO, 26),
        ];
        case "MG/Governador Valadares": return [
            // https://www.valadares.mg.gov.br/detalhe-da-legislacao/info/lei-ordinaria-3831-1993/2389
            aniversarioDaCidade(JANEIRO, 30),
            diaDeCorpusChristi,
            diaDeSantoAntonio
        ];
        case "MG/Itajubá": return [
            // https://www.itajuba.mg.gov.br/abrir_arquivo.aspx/Portaria_183_2021?cdLocal=2&arquivo={4764771E-E70C-AA0B-6BAC-CD88BEDDBDD8}.pdf#search=feriados
            diaDeSaoJose,
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora,
        ];
        case "MG/Nova Lima": return [
            // https://cmnovalima.mg.gov.br/processo-legislativo/arquivos/3cf43abdcb3a0f16dc30f15307ce2879.pdf
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora,
            diaDeNossaSenhoraDaConceicao
        ];
        case "MG/Uberaba": return [
            // http://www.uberaba.mg.gov.br/portal/acervo//legislacao/feriados_municipio/Lei%205545.pdf
            fm(MARCO, 2, "Dia de Uberaba"),
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora,
        ];
        case "MG/Belo Horizonte": return [
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MG/Uberlândia": return [
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora,
            fm(AGOSTO, 31, "Dia de São Raimundo")
        ];
        case "PA/Belém": return [
            aniversarioDaCidade(JANEIRO, 12),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PB/Campina Grande": return [
            // https://sapl.campinagrande.pb.leg.br/media/sapl/public/normajuridica/2019/7960/lei_no_7197.pdf
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeNossaSenhoraDaConceicao
        ];
        case "PB/João Pessoa": return [
            diaDeSaoJoao,
            aniversarioDaCidade(AGOSTO, 5),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PR/Curitiba": return [
            diaDeCorpusChristi,
            fm(SETEMBRO, 8, "Dia de Nossa Senhora da Luz dos Pinhais"),
        ];
        case "PR/Foz do Iguaçu": return [
            // https://www5.pmfi.pr.gov.br/noticia-49621
            aniversarioDaCidade(JUNHO, 10),
            diaDeCorpusChristi,
            diaDeSaoJoao
        ];
        case "PR/Londrina": return [
            // https://portal.londrina.pr.gov.br/feriados-pontos-facultativos
            diaDeCorpusChristi,
            diaDoSagradoCoracaoDeJesus,
            aniversarioDaCidade(DEZEMBRO, 10)
        ];
        case "PR/Maringá": return [
            // https://pt.scribd.com/document/841902321/Decreto-400-Feriados-2025-1
            aniversarioDaCidade(MAIO, 12),
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora
        ];
        case "PE/Garanhuns": return [
            // https://garanhuns.pe.gov.br/nota-sobre-os-feriados-municipais-de-garanhuns/
            aniversarioDaCidade(FEVEREIRO, 4),
            diaDeCorpusChristi,
            diaDeSantoAntonio,
            diaDeSaoJoao
        ];
        case "PE/Jaboatão dos Guararapes": return [
            fm(JANEIRO, 15, "Dia de Santo Amaro"),
            fm(ABRIL, 17, "Dia de Nossa Senhora dos Prazeres"),
            aniversarioDaCidade(MAIO, 4),
        ];
        case "PE/Olinda": return [
            // https://www.olinda.pe.gov.br/nossa-cidade/feriados-municipais/
            aniversarioDaCidade(MARCO, 12),
            fm(AGOSTO, 6, "Dia de São Salvador do Mundo"),
            fm(NOVEMBRO, 10, "1º Grito de República no Brasil"),
        ];
        case "PE/Petrolina": return [
            // http://www.pe.portaldatransparencia.com.br/prefeitura/petrolina/?pagina=abreDocumento&arquivo=30EB0A5F
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeAssuncaoDeNossaSenhora,
            aniversarioDaCidade(SETEMBRO, 21),
        ];
        case "PE/Recife": return [
            fm(JULHO, 16, "Dia de Nossa Senhora do Carmo"),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PI/Teresina": return [
            diaDeCorpusChristi,
            aniversarioDaCidade(AGOSTO, 16),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "RJ/Duque de Caxias": return [
            diaDeCorpusChristi,
            diaDeSantoAntonio,
        ];
        case "RJ/Nova Iguaçu": return [
            diaDeSantoAntonio,
        ];
        case "RJ/Rio de Janeiro": return [
            diaDeSaoSebastiao,
        ];
        case "RJ/São Gonçalo": return [
            fm(JANEIRO, 10, "Dia de São Gonçalo"),
            aniversarioDaCidade(SETEMBRO, 22),
        ];
        case "RN/Caicó": return [
            // https://pt.wikipedia.org/wiki/Caic%C3%B3
            { tipo: "MUNICIPAL", data: calcularDiaDaFestaDeSantaAna(ano), descricao: "Festa de Sant'Ana" },
            aniversarioDaCidade(DEZEMBRO, 16),
        ];
        case "RN/Mossoró": return [
            // https://dom.mossoro.rn.gov.br/dom/ato/13663
            fm(SETEMBRO, 30, "Libertação dos escravos"),
            fm(DEZEMBRO, 13, "Dia de Santa Luzia")
        ];
        case "RN/Natal": return [
            fm(JANEIRO, 6, "Dia de Santos Reis"),
            diaDeCorpusChristi,
            fm(NOVEMBRO, 21, "Dia de Nossa Senhora da Apresentação"),
        ];
        case "RS/Chuí": return [
            // https://chui.rs.gov.br/o-municipio/sobre-o-municipio/
            aniversarioDaCidade(OUTUBRO, 22)
        ];
        case "RS/Porto Alegre": return [
            fm(FEVEREIRO, 2, "Dia de Nossa Senhora dos Navegantes"),
        ];
        case "RS/Santa Maria": return [
            // https://www.santamaria.rs.gov.br/arquivos/baixar-arquivo/noticias/D10-2064.pdf
            aniversarioDaCidade(MAIO, 17),
            diaDeCorpusChristi,
            diaDeNossaSenhoraDaConceicao
        ];
        case "RS/Uruguaiana": return [
            // https://www.uruguaiana.rs.gov.br/portal/servicos/1269/feriados/
            diaDeCorpusChristi,
            diaDeSantAnna
        ];
        case "RO/Porto Velho": return [
            fm(JANEIRO, 24, "Dia de São Francisco de Sales"),
            aniversarioDaCidade(OUTUBRO, 2),
        ];
        case "RR/Boa Vista": return [
            diaDeSaoSebastiao,
            diaDeSaoPedro,
            aniversarioDaCidade(JULHO, 9),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "RR/Pacaraima": return [
            // https://portal.pacaraima.rr.gov.br/index.php/publicacoes/preview/2178
            fm(OUTUBRO, 4, "Dia de São Francisco de Assis"),
            aniversarioDaCidade(OUTUBRO, 17)
        ];
        case "SC/Balneário Camboriú": return [
            { tipo: "MUNICIPAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            diaDeCorpusChristi,
            aniversarioDaCidade(JULHO, 20),
        ];
        case "SC/Blumenau": return [
            diaDeCorpusChristi,
            aniversarioDaCidade(SETEMBRO, 2),
        ];
        case "SC/Florianópolis": return [
            diaDeCorpusChristi,
            aniversarioDaCidade(MARCO, 23),
        ];
        case "SC/Itajaí": return [
            // https://leismunicipais.com.br/a/sc/i/itajai/decreto/2025/1347/13479/decreto-n-13479-2025-fixa-o-calendario-dos-pontos-facultativos-para-os-orgaos-da-administracao-direta-autarquias-e-fundacoes-publicas-do-poder-executivo-municipal
            // nenhum mesmo
        ];
        case "SC/Joinville": return [
            aniversarioDaCidade(MARCO, 9),
            diaDeCorpusChristi,
        ];
        case "SP/Araraquara": return [
            // https://www.camara-arq.sp.gov.br/Pagina/Listar/709
            // https://www.acidadeon.com/araraquara/economia/confira-os-feriados-e-pontos-facultativos-de-2025-em-araraquara/
            diaDeCorpusChristi,
            fm(JULHO, 11, "Dia de São Bento"),
            fm(AGOSTO, 22, "Imaculado Coração de Maria")
        ];
        case "SP/Barueri": return [
            diaDeSaoJoao,
            diaDeCorpusChristi,
        ];
        case "SP/Campinas": return [
            diaDeCorpusChristi,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "SP/Guarulhos": return [
            diaDeNossaSenhoraDaConceicao
        ];
        case "SP/Paulínia": return [
            // https://www.paulinia.sp.gov.br/feriados2025/
            aniversarioDaCidade(FEVEREIRO, 28),
            diaDoSagradoCoracaoDeJesus,
        ];
        case "SP/Osasco": return [
            aniversarioDaCidade(FEVEREIRO, 19),
            diaDeCorpusChristi,
            diaDeSantoAntonio,
        ];
        case "SP/Ribeirão Preto": return [
            diaDeSaoSebastiao,
            diaDeCorpusChristi,
            fm(JUNHO, 19, "Dia de Santa Juliana Falconieri"),
        ];
        case "SP/Santo André": return [
            aniversarioDaCidade(ABRIL, 8),
            diaDeCorpusChristi
        ];
        case "SP/São Bernardo do Campo": return [
            diaDeCorpusChristi,
            aniversarioDaCidade(AGOSTO, 20)
        ];
        case "SP/São Carlos": return [
            diaDeAssuncaoDeNossaSenhora,
            fm(OUTUBRO, 15, "Dia do Professor (somente para os professores da rede municipal de ensino)"),
            aniversarioDaCidade(NOVEMBRO, 4),
            diaDeCorpusChristi,
        ];
        case "SP/São José dos Campos": return [
            diaDeSaoJose,
            diaDeCorpusChristi,
            aniversarioDaCidade(JULHO, 27),
        ];
        case "SP/São Paulo": return [
            aniversarioDaCidade(JANEIRO, 25),
            diaDeCorpusChristi
        ];
        case "SP/Sumaré": return [
            // https://www.sumare.sp.gov.br/pdfDiario.php?edicao=702&pdf=95a5e82515e74b2c82ed35bb9b27fb8b.pdf
            diaDeCorpusChristi,
            aniversarioDaCidade(JULHO, 26),
        ];
        case "SP/Valinhos": return [
            // https://www.valinhos.sp.gov.br/portal/secretarias-paginas/143/feriados-municipaisnacionais/
            diaDeSaoSebastiao,
            diaDeCorpusChristi
        ];
        case "SP/Vinhedo": return [
            // https://www.vinhedo.sp.gov.br/imgeditor/CALENDARIO%20PONTES%202025.pdf
            aniversarioDaCidade(ABRIL, 2),
            diaDeCorpusChristi,
            diaDeSantAnna
        ];
        case "SE/Aracaju": return [
            aniversarioDaCidade(MARCO, 17),
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "TO/Palmas": return [
            diaDeSaoJose,
            aniversarioDaCidade(MAIO, 20),
        ];
        default: return [];
    }
}

function obterTodosOsFeriadosParaAno(ano, uf, municipio, deveMarcarEmendas) {
    var feriadosNacionais = obterFeriadosNacionais(ano);
    var feriadosEstaduais = obterFeriadosEstaduais(ano, uf);
    var feriadosMunicipais = obterFeriadosMunicipais(ano, uf, municipio);

    // Gambiarra para tratar Carnaval repetido, por exemplo, no Rio de Janeiro e em Manaus
    var feriadoCarnavalEstadual = feriadosEstaduais.find(x => x.descricao.includes("Carnaval"));
    var feriadoCarnavalMunicipal = feriadosMunicipais.find(x => x.descricao.includes("Carnaval"));

    if (feriadoCarnavalEstadual != undefined || feriadoCarnavalMunicipal != undefined) {
        // se houver feriado municipal ou estadual de Carnaval, vamos sobrepôr estes ao feriado nacional.
        feriadosNacionais = feriadosNacionais.filter(x => x.descricao.includes("Carnaval") == false);
    }

    var feriados = feriadosNacionais
        .concat(feriadosEstaduais)
        .concat(feriadosMunicipais);

    if (deveMarcarEmendas)
    {
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
