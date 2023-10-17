// os estados estão em ordem alfabética considerando o nome por extenso

const estados = [
    { acronimo: "AC", nome: "Acre", cidades: ["Rio Branco"] },
    { acronimo: "AL", nome: "Alagoas", cidades: ["Maceió"] },
    { acronimo: "AP", nome: "Amapá", cidades: ["Macapá"] },
    { acronimo: "AM", nome: "Amazonas", cidades: ["Manaus"] },
    { acronimo: "BA", nome: "Bahia", cidades: ["Salvador"] },
    { acronimo: "CE", nome: "Ceará", cidades: ["Fortaleza"] },
    { acronimo: "DF", nome: "Distrito Federal", cidades: ["Brasília"] },
    { acronimo: "ES", nome: "Espírito Santo", cidades: ["Vitória"] },
    { acronimo: "GO", nome: "Goiás", cidades: ["Goiânia"] },
    { acronimo: "MA", nome: "Maranhão", cidades: ["São Luís"] },
    { acronimo: "MT", nome: "Mato Grosso", cidades: ["Cuiabá"] },
    { acronimo: "MS", nome: "Mato Grosso do Sul", cidades: ["Campo Grande"] },
    { acronimo: "MG", nome: "Minas Gerais", cidades: ["Belo Horizonte", "Uberlândia"] },
    { acronimo: "PA", nome: "Pará", cidades: ["Belém"] },
    { acronimo: "PB", nome: "Paraíba", cidades: ["João Pessoa"] },
    { acronimo: "PR", nome: "Paraná", cidades: ["Curitiba"] },
    { acronimo: "PE", nome: "Pernambuco", cidades: ["Jaboatão dos Guararapes", "Recife"] },
    { acronimo: "PI", nome: "Piauí", cidades: ["Teresina"] },
    { acronimo: "RJ", nome: "Rio de Janeiro", cidades: ["Duque de Caxias", "Nova Iguaçu", "Rio de Janeiro", "São Gonçalo"] },
    { acronimo: "RN", nome: "Rio Grande do Norte", cidades: ["Natal"] },
    { acronimo: "RS", nome: "Rio Grande do Sul", cidades: ["Porto Alegre"] },
    { acronimo: "RO", nome: "Rondônia", cidades: ["Porto Velho"] },
    { acronimo: "RR", nome: "Roraima", cidades: ["Boa Vista"] },
    { acronimo: "SC", nome: "Santa Catarina", cidades: ["Balneário Camboriú", "Blumenau", "Florianópolis", "Joinville"] },
    { acronimo: "SP", nome: "São Paulo", cidades: ["Barueri", "Campinas", "Guarulhos", "Osasco", "Ribeirão Preto", "Santo André", "São Bernardo do Campo", "São Carlos", "São José dos Campos", "São Paulo"] },
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
            // PL 370/2023 torna Dia da Consciência Negra feriado estadual em SP
            { tipo: "ESTADUAL", data: new Date(ano, JULHO, 9), descricao: "Revolução Constitucionalista de 1932" },
            { tipo: "ESTADUAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" },
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
    // feriados mais comuns
    const diaDeSaoSebastiao = { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 20), descricao: "Dia de São Sebastião" };
    const diaDeCorpusChristi = { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano), descricao: "Quinta-feira de Corpus-Christi" };
    const diaDeSantoAntonio = { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 13), descricao: "Dia de Santo Antônio" };
    const diaDeSaoJoao = { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" };
    const diaDeSaoPedro = { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 29), descricao: "Dia de São Pedro" };
    const diaDeNossaSenhoraDaConceicao = { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 8), descricao: "Dia de Nossa Senhora da Conceição" };
    //const diaDaConscienciaNegra = { tipo: "MUNICIPAL", data: new Date(ano, NOVEMBRO, 20), descricao: "Dia da Consciência Negra" };

    var ufMunicipio = uf + "/" + municipio;
    switch (ufMunicipio) {
        case "AC/Rio Branco": return [
            { tipo: "MUNICIPAL", data: new Date(ano, DEZEMBRO, 28), descricao: "Aniversário de Rio Branco" },
        ];
        case "AL/Maceió": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 27), descricao: "Dia de Nossa Senhora dos Prazeres" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "AP/Macapá": return [
            { tipo: "MUNICIPAL", data: new Date(ano, FEVEREIRO, 4), descricao: "Aniversário de Macapá" },
        ];
        case "AM/Manaus": return [
            { tipo: "MUNICIPAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 24), descricao: "Aniversário de Manaus" },
        ];
        case "BA/Salvador": return [
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "CE/Fortaleza": return [
            { tipo: "MUNICIPAL", data: new Date(ano, ABRIL, 13), descricao: "Aniversário de Fortaleza" },
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 15), descricao: "Dia de Nossa Senhora da Assunção" },
        ];
        case "DF/Brasília": return [
            // O aniversário de Brasília cai no dia de Tiradentes,
            // além disso, Brasília não possui municípios, por ser um distrito federal.
        ];
        case "ES/Vitória": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 8), descricao: "Dia de Nossa Senhora da Vitória" },
        ];
        case "GO/Goiânia": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MAIO, 24), descricao: "Dia de Nossa Senhora Auxiliadora" },
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 24), descricao: "Aniversário de Goiânia" },
        ];
        case "MA/São Luís": return [
            diaDeSaoPedro,
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 8), descricao: "Natividade de Nossa Senhora" },
            { tipo: "MUNICIPAL", data: calcularDiaDoComercio(ano), descricao: "Dia do Comércio (apenas para comerciantes)" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MT/Cuiabá": return [
            { tipo: "MUNICIPAL", data: new Date(ano, ABRIL, 8), descricao: "Aniversário de Cuiabá" },
            diaDeCorpusChristi,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MS/Campo Grande": return [
            diaDeCorpusChristi,
            diaDeSantoAntonio,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 26), descricao: "Aniversário de Campo Grande" },
        ];
        case "MG/Belo Horizonte": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 15), descricao: "Dia de Nossa Senhora da Assunção" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MG/Uberlândia": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 15), descricao: "Dia de Nossa Senhora da Abadia" },
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 31), descricao: "Dia de São Raimundo" }
        ];
        case "PA/Belém": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 12), descricao: "Aniversário de Belém" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PB/João Pessoa": return [
            diaDeSaoJoao,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 5), descricao: "Aniversário de João Pessoa" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PR/Curitiba": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 8), descricao: "Dia de Nossa Senhora da Luz dos Pinhais" },
        ];
        case "PE/Jaboatão dos Guararapes": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 15), descricao: "Dia de Santo Amaro" },
            { tipo: "MUNICIPAL", data: new Date(ano, ABRIL, 17), descricao: "Dia de Nossa Senhora dos Prazeres" },
            { tipo: "MUNICIPAL", data: new Date(ano, MAIO, 4), descricao: "Aniversário da cidade" },
        ];
        case "PE/Recife": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JULHO, 16), descricao: "Dia de Nossa Senhora do Carmo" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PI/Teresina": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 16), descricao: "Aniversário de Teresina" },
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
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 10), descricao: "Dia de São Gonçalo" },
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 22), descricao: "Emancipação de São Gonçalo" },
        ];
        case "RN/Natal": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 6), descricao: "Dia de Santos Reis" },
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, NOVEMBRO, 21), descricao: "Dia de Nossa Senhora da Apresentação" },
        ];
        case "RS/Porto Alegre": return [
            { tipo: "MUNICIPAL", data: new Date(ano, FEVEREIRO, 2), descricao: "Dia de Nossa Senhora dos Navegantes" },
        ];
        case "RO/Porto Velho": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 24), descricao: "Dia de São Francisco de Sales" },
            { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 2), descricao: "Aniversário de Porto Velho" },
        ];
        case "RR/Boa Vista": return [
            diaDeSaoSebastiao,
            diaDeSaoPedro,
            { tipo: "MUNICIPAL", data: new Date(ano, JULHO, 9), descricao: "Aniversário de Boa Vista" },
            diaDeNossaSenhoraDaConceicao,
        ];
        case "SC/Balneário Camboriú": return [
            { tipo: "MUNICIPAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, JULHO, 20), descricao: "Aniversário da cidade" },
        ];    
        case "SC/Blumenau": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, SETEMBRO, 2), descricao: "Aniversário da cidade" },
        ];     
        case "SC/Florianópolis": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 23), descricao: "Aniversário de Florianópolis" },
        ];
        case "SC/Joinville": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 9), descricao: "Aniversário da cidade" },
            diaDeCorpusChristi,
        ]; 
        case "SP/Barueri": return [
            diaDeSaoJoao,
            diaDeCorpusChristi,
            //diaDaConscienciaNegra, // estadual e municipal
        ];
        case "SP/Campinas": return [
            diaDeCorpusChristi,
            //diaDaConscienciaNegra,  // estadual e municipal
            diaDeNossaSenhoraDaConceicao,
        ];
        case "SP/Guarulhos": return [
            diaDeNossaSenhoraDaConceicao
        ];
        case "SP/Osasco": return [
            { tipo: "MUNICIPAL", data: new Date(ano, FEVEREIRO, 19), descricao: "Emancipação de Osasco" },
            diaDeCorpusChristi,
            diaDeSantoAntonio,
        ];
        case "SP/Ribeirão Preto": return [
            diaDeSaoSebastiao,
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, JUNHO, 19), descricao: "Dia de Santa Juliana Falconieri" },
        ];
        case "SP/Santo André": return [
            { tipo: "MUNICIPAL", data: new Date(ano, ABRIL, 8), descricao: "Aniversário da cidade" },
            diaDeCorpusChristi,
            //diaDaConscienciaNegra, // estadual e municipal
        ];
        case "SP/São Bernardo do Campo": return [
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 20), descricao: "Aniversário da cidade" },
            //diaDaConscienciaNegra, // estadual e municipal
        ];
        case "SP/São Carlos": return [
          { tipo: "MUNICIPAL", data: new Date(ano, AGOSTO, 15), descricao: "Nossa Senhora da Babilônia" },
          { tipo: "MUNICIPAL", data: new Date(ano, OUTUBRO, 15), descricao: "Dia do Professor (somente para os professores da rede municipal de ensino)" },
          { tipo: "MUNICIPAL", data: new Date(ano, NOVEMBRO, 4), descricao: "Aniversário de São Carlos" },
          diaDeCorpusChristi,
        ];
        case "SP/São José dos Campos": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 13), descricao: "Dia de São José" },
            diaDeCorpusChristi,
            { tipo: "MUNICIPAL", data: new Date(ano, JULHO, 27), descricao: "Aniversário da cidade" },
        ];
        case "SP/São Paulo": return [
            { tipo: "MUNICIPAL", data: new Date(ano, JANEIRO, 25), descricao: "Aniversário de São Paulo" },
            diaDeCorpusChristi,
            //diaDaConscienciaNegra, // estadual e municipal
        ];
        case "SE/Aracaju": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 17), descricao: "Aniversário de Aracaju" },
            diaDeCorpusChristi,
            diaDeSaoJoao,
            diaDeNossaSenhoraDaConceicao,
        ];
        case "TO/Palmas": return [
            { tipo: "MUNICIPAL", data: new Date(ano, MARCO, 19), descricao: "Dia de São José" },
            { tipo: "MUNICIPAL", data: new Date(ano, MAIO, 20), descricao: "Aniversário de Palmas" },
        ];
        default: return [];
    }
}

function obterTodosOsFeriadosParaAno(ano, uf, municipio) {
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

    return feriadosNacionais
        .concat(feriadosEstaduais)
        .concat(feriadosMunicipais)
        .sort((a, b) => a.data - b.data);
}