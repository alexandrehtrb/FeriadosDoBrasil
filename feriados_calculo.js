// os estados estão em ordem alfabética considerando o nome por extenso

const estados = [
    { acronimo: "AC", nome: "Acre" },
    { acronimo: "AL", nome: "Alagoas" },
    { acronimo: "AP", nome: "Amapá" },
    { acronimo: "AM", nome: "Amazonas" },
    { acronimo: "BA", nome: "Bahia" },
    { acronimo: "CE", nome: "Ceará" },
    { acronimo: "DF", nome: "Distrito Federal" },
    { acronimo: "ES", nome: "Espírito Santo" },
    { acronimo: "GO", nome: "Goiás" },
    { acronimo: "MA", nome: "Maranhão" },
    { acronimo: "MT", nome: "Mato Grosso" },
    { acronimo: "MS", nome: "Mato Grosso do Sul" },
    { acronimo: "MG", nome: "Minas Gerais" },
    { acronimo: "PA", nome: "Pará" },
    { acronimo: "PB", nome: "Paraíba" },
    { acronimo: "PR", nome: "Paraná" },
    { acronimo: "PE", nome: "Pernambuco" },
    { acronimo: "PI", nome: "Piauí" },
    { acronimo: "RJ", nome: "Rio de Janeiro" },
    { acronimo: "RN", nome: "Rio Grande do Norte" },
    { acronimo: "RS", nome: "Rio Grande do Sul" },
    { acronimo: "RO", nome: "Rondônia" },
    { acronimo: "RR", nome: "Roraima" },
    { acronimo: "SC", nome: "Santa Catarina" },
    { acronimo: "SP", nome: "São Paulo" },
    { acronimo: "SE", nome: "Sergipe" },
    { acronimo: "TO", nome: "Tocantins" }
];

const cidadesDosEstados = [
    { uf: "AC", cidades: ["Rio Branco"] },
    { uf: "AL", cidades: ["Maceió"] },
    { uf: "AP", cidades: ["Macapá"] },
    { uf: "AM", cidades: ["Manaus"] },
    { uf: "BA", cidades: ["Salvador"] },
    { uf: "CE", cidades: ["Fortaleza"] },
    { uf: "DF", cidades: ["Brasília"] },
    { uf: "ES", cidades: ["Vitória"] },
    { uf: "GO", cidades: ["Goiânia"] },
    { uf: "MA", cidades: ["São Luís"] },
    { uf: "MT", cidades: ["Cuiabá"] },
    { uf: "MS", cidades: ["Campo Grande"] },
    { uf: "MG", cidades: ["Belo Horizonte"] },
    { uf: "PA", cidades: ["Belém"] },
    { uf: "PB", cidades: ["João Pessoa"] },
    { uf: "PR", cidades: ["Curitiba"] },
    { uf: "PE", cidades: ["Recife"] },
    { uf: "PI", cidades: ["Teresina"] },
    { uf: "RJ", cidades: ["Rio de Janeiro"] },
    { uf: "RN", cidades: ["Natal"] },
    { uf: "RS", cidades: ["Porto Alegre"] },
    { uf: "RO", cidades: ["Porto Velho"] },
    { uf: "RR", cidades: ["Boa Vista"] },
    { uf: "SC", cidades: ["Florianópolis"] },
    { uf: "SP", cidades: ["Campinas", "São Paulo"] },
    { uf: "SE", cidades: ["Aracaju"] },
    { uf: "TO", cidades: ["Palmas"] }
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

function calcularDiaDoComercio(ano) {
    var primeiroDiaOutubro = new Date(ano, OUTUBRO, 1);
    var primeiraSegundaFeiraOutubro = primeiroDiaOutubro.getNextWeekday(SEGUNDA_FEIRA);
    var terceiraSegundaFeiraOutubro = primeiraSegundaFeiraOutubro.addDays(14);
    return terceiraSegundaFeiraOutubro;
}

function deslocarFeriadoDoAcre(dataOriginal) {
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

function deslocarFeriadoDeSantaCatarina(dataOriginal) {
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
        { tipo: "NACIONAL", data: new Date(ano, DEZEMBRO, 25), descricao: "Natal" }
    ];
}
function obterFeriadosEstaduais(ano, uf) {
    switch (uf) {
        case "AC": return [
            { tipo: "ESTADUAL", data: deslocarFeriadoDoAcre(new Date(ano, JANEIRO, 23)), descricao: "Dia do evangélico" },
            { tipo: "ESTADUAL", data: deslocarFeriadoDoAcre(new Date(ano, MARCO, 8)), descricao: "Dia Internacional da Mulher" },
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 15), descricao: "Aniversário do estado" },
            { tipo: "ESTADUAL", data: deslocarFeriadoDoAcre(new Date(ano, SETEMBRO, 5)), descricao: "Dia da Amazônia" },
            { tipo: "ESTADUAL", data: deslocarFeriadoDoAcre(new Date(ano, NOVEMBRO, 17)), descricao: "Assinatura do Tratado de Petrópolis" },
        ];
        case "AL": return [
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" },
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 29), descricao: "Dia de São Pedro" },
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 16), descricao: "Emancipação política de Alagoas" },
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Morte de Zumbi dos Palmares" },
        ];
        case "AP": return [
            { tipo: "ESTADUAL", data: new Date(ano, MARCO, 19), descricao: "Dia de São José" },
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 13), descricao: "Criação do Território Federal" },
        ];
        case "AM": return [
            { tipo: "ESTADUAL", data: new Date(ano, SETEMBRO, 5), descricao: "Elevação do Amazonas à categoria de província" },
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
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
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
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
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
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
            { tipo: "ESTADUAL", data: new Date(ano, OUTUBRO, 5), descricao: "Criação do estado" },
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
        ];
        case "SC": return [
            { tipo: "ESTADUAL", data: deslocarFeriadoDeSantaCatarina(new Date(ano, AGOSTO, 11)), descricao: "Dia de Santa Catarina (criação da capitania, separando-se de São Paulo)" },
            { tipo: "ESTADUAL", data: deslocarFeriadoDeSantaCatarina(new Date(ano, NOVEMBRO, 25)), descricao: "Dia de Santa Catarina de Alexandria" },
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
    var ufMunicipio = uf + "/" + municipio;
    switch (ufMunicipio) {
        case "AC/Rio Branco": return [
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 28), descricao: "Aniversário de Rio Branco" },
        ];
        case "AL/Maceió": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 27), descricao: "Dia de Nossa Senhora dos Prazeres" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "AP/Macapá": return [
            { tipo: "MUNICIPAL", data: new Date(ano, FEVEREIRO, 4), descricao: "Aniversário de Macapá" },
        ];
        case "AM/Manaus": return [
            { tipo: "MUNICIPAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 24), descricao: "Aniversário de Manaus" },
        ];
        case "BA/Salvador": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "CE/Fortaleza": return [
            // Sexta-feira Santa é feriado nacional e municipal
            // Dia de São José é feriado estadual e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, ABRIL, 13), descricao: "Aniversário de Fortaleza" },
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 15), descricao: "Dia de Nossa Senhora da Assunção" },
        ];
        case "DF/Brasília": return [
            // O aniversário de Brasília cai no dia de Tiradentes,
            // além disso, Brasília não possui municípios, por ser um distrito federal.
        ];
        case "ES/Vitória": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 8), descricao: "Dia de Nossa Senhora da Vitória" },
        ];
        case "GO/Goiânia": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, MAIO, 24), descricao: "Dia de Nossa Senhora Auxiliadora" },
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 24), descricao: "Aniversário de Goiânia" },
        ];
        case "MA/São Luís": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 29), descricao: "Dia de São Pedro" },
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 8), descricao: "Natividade de Nossa Senhora" },
            { tipo: "MUNICIPAL", data: calcularDiaDoComercio(ano), descricao: "Dia do Comércio (apenas para comerciantes)" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "MT/Cuiabá": return [
            { tipo: "MUNICIPAL", data: new Date(ano, ABRIL, 8), descricao: "Aniversário de Cuiabá" },
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "MS/Campo Grande": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 13), descricao: "Dia de Santo Antônio" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 26), descricao: "Aniversário de Campo Grande" },
        ];
        case "MG/Belo Horizonte": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 15), descricao: "Dia de Nossa Senhora da Assunção" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "PA/Belém": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 12), descricao: "Aniversário de Belém" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "PB/João Pessoa": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 5), descricao: "Aniversário de João Pessoa" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "PR/Curitiba": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 8), descricao: "Dia de Nossa Senhora da Luz dos Pinhais" },
        ];
        case "PE/Recife": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, JULHO, 16), descricao: "Dia de Nossa Senhora do Carmo" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "PI/Teresina": return [
            // Sexta-feira Santa e Finados são feriados nacionais e municipais
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 16), descricao: "Aniversário de Teresina" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "RJ/Rio de Janeiro": return [
            // Dia de São Jorge é feriado estadual e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 20), descricao: "Dia de São Sebastião" }
        ];
        case "RN/Natal": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 6), descricao: "Dia de Santos Reis" },
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, NOVEMBRO, 21), descricao: "Dia de Nossa Senhora da Apresentação" },
        ];
        case "RS/Porto Alegre": return [
            { tipo: "MUNICIPAL", data: new Date(ano, FEVEREIRO, 2), descricao: "Dia de Nossa Senhora dos Navegantes" },
            // Sexta-feira Santa, Corpus Christi e Finados são feriados nacionais e municipais
        ];
        case "RO/Porto Velho": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 24), descricao: "Dia de São Francisco de Sales" },
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 2), descricao: "Aniversário de Porto Velho" },
        ];
        case "RR/Boa Vista": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 20), descricao: "Dia de São Sebastião" },
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 29), descricao: "Dia de São Pedro" },
            { tipo: "MUNICIPAL", data: new Date(ano, JULHO, 9), descricao: "Aniversário de Boa Vista" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "SC/Florianópolis": return [
            // Sexta-feira Santa e Finados são feriados nacionais e municipais
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 23), descricao: "Aniversário de Florianópolis" },
        ];
        case "SP/Campinas": return [
            // Sexta-feira Santa é feriado nacional e municipal
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "SP/São Paulo": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 25), descricao: "Aniversário de São Paulo" },
            // Sexta-feira Santa e Finados são feriados nacionais e municipais
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
        ];
        case "SE/Aracaju": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 17), descricao: "Aniversário de Aracaju" },
            { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" },
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" },
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" },
        ];
        case "TO/Palmas": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 19), descricao: "Dia de São José" },
            // Sexta-feira Santa e Finados são feriados nacionais e municipais
            { tipo: "MUNICIPAL", data: new Date(ano, MAIO, 20), descricao: "Aniversário de Palmas" },
        ];
        default: return [];
    }
}

function obterTodosOsFeriadosParaAno(ano, uf, municipio) {
    var feriadosNacionais = obterFeriadosNacionais(ano);
    var feriadosEstaduais = obterFeriadosEstaduais(ano, uf);
    var feriadosMunicipais = obterFeriadosMunicipais(ano, uf, municipio);

    return feriadosNacionais
        .concat(feriadosEstaduais)
        .concat(feriadosMunicipais)
        .sort((a, b) => a.data - b.data);
}