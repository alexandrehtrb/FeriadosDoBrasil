// os estados estão em ordem alfabética considerando o nome por extenso

const estados = [
    { acronimo: "AC", nome: "Acre", cidades: ["Cruzeiro do Sul", "Rio Branco", "Sena Madureira"] },
    { acronimo: "AL", nome: "Alagoas", cidades: ["Arapiraca", "Maceió"] },
    { acronimo: "AP", nome: "Amapá", cidades: ["Macapá", "Oiapoque", "Santana"] },
    { acronimo: "AM", nome: "Amazonas", cidades: ["Itacoatiara", "Manaus", "Parintins", "São Gabriel da Cachoeira"] },
    { acronimo: "BA", nome: "Bahia", cidades: ["Feira de Santana", "Luís Eduardo Magalhães", "Salvador", "Xique-Xique"] },
    { acronimo: "CE", nome: "Ceará", cidades: ["Caucaia", "Fortaleza", "Juazeiro do Norte"] },
    { acronimo: "DF", nome: "Distrito Federal", cidades: ["Brasília"] },
    { acronimo: "ES", nome: "Espírito Santo", cidades: ["Cariacica", "Serra", "Vila Velha", "Vitória"] },
    { acronimo: "GO", nome: "Goiás", cidades: ["Anápolis", "Aparecida de Goiânia", "Goiânia"] },
    { acronimo: "MA", nome: "Maranhão", cidades: ["Imperatriz", "São José de Ribamar", "São Luís"] },
    { acronimo: "MT", nome: "Mato Grosso", cidades: ["Cuiabá", "Lucas do Rio Verde", "Sinop", "Sorriso"] },
    { acronimo: "MS", nome: "Mato Grosso do Sul", cidades: ["Campo Grande", "Dourados", "Ponta Porã", "Três Lagoas"] },
    { acronimo: "MG", nome: "Minas Gerais", cidades: ["Belo Horizonte", "Governador Valadares", "Itajubá", "Nova Lima", "Uberaba", "Uberlândia"] },
    { acronimo: "PA", nome: "Pará", cidades: ["Ananindeua", "Belém", "Santarém"] },
    { acronimo: "PB", nome: "Paraíba", cidades: ["Campina Grande", "João Pessoa", "Patos"] },
    { acronimo: "PR", nome: "Paraná", cidades: ["Curitiba", "Foz do Iguaçu", "Londrina", "Maringá"] },
    { acronimo: "PE", nome: "Pernambuco", cidades: ["Garanhuns", "Jaboatão dos Guararapes", "Olinda", "Petrolina", "Recife"] },
    { acronimo: "PI", nome: "Piauí", cidades: ["Parnaíba", "Teresina"] },
    { acronimo: "RJ", nome: "Rio de Janeiro", cidades: ["Duque de Caxias", "Nova Iguaçu", "Rio de Janeiro", "São Gonçalo"] },
    { acronimo: "RN", nome: "Rio Grande do Norte", cidades: ["Caicó", "Mossoró", "Natal"] },
    { acronimo: "RS", nome: "Rio Grande do Sul", cidades: ["Chuí", "Porto Alegre", "Santa Maria", "Uruguaiana"] },
    { acronimo: "RO", nome: "Rondônia", cidades: ["Ji-Paraná", "Porto Velho"] },
    { acronimo: "RR", nome: "Roraima", cidades: ["Boa Vista", "Pacaraima"] },
    { acronimo: "SC", nome: "Santa Catarina", cidades: ["Balneário Camboriú", "Blumenau", "Florianópolis", "Itajaí", "Joinville"] },
    { acronimo: "SP", nome: "São Paulo", cidades: ["Araraquara", "Barueri", "Campinas", "Guarulhos", "Osasco", "Paulínia", "Ribeirão Preto", "Santos", "Santo André", "São Bernardo do Campo", "São Carlos", "São José dos Campos", "São Paulo", "Sumaré", "Ubatuba", "Valinhos", "Vinhedo"] },
    { acronimo: "SE", nome: "Sergipe", cidades: ["Aracaju", "Nossa Senhora do Socorro"] },
    { acronimo: "TO", nome: "Tocantins", cidades: ["Araguaína", "Palmas"] }
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
            { tipo: "ESTADUAL", data: new Date(ano, JUNHO, 24), descricao: "Dia de São João" },
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
    const diaDoSagradoCoracaoDeJesus = { tipo: "MUNICIPAL", data: calcularQuintaFeiraDeCorpusChristi(ano).addDays(8), descricao: "Sagrado Coração de Jesus" };
    const diaDeSantoAntonio = fm(JUNHO, 13, "Dia de Santo Antônio");
    const diaDeSaoJoao = fm(JUNHO, 24, "Dia de São João");
    const diaDeSaoPedro = fm(JUNHO, 29, "Dia de São Pedro");
    const diaDeSantAnna = fm(JULHO, 26, "Dia de Sant'Anna");
    const diaDeNossaSenhoraDaConceicao = fm(DEZEMBRO, 8, "Dia de Nossa Senhora da Conceição");
    const diaDeAssuncaoDeNossaSenhora = function(padroeira)
    {
        // Várias cidades têm os dias de suas padroeiras 
        // celebrados no dia de Assunção de Nossa Senhora (15/08).
        const str = (padroeira == null || padroeira == undefined) ?
                    "Assunção de Nossa Senhora" :
                    padroeira;
        return fm(AGOSTO, 15, str);
    }
    const aniversarioDaCidade = function(mes, dia) {
        return fm(mes, dia, "Aniversário da cidade");
    }   

    var ufMunicipio = uf + "/" + municipio;
    switch (ufMunicipio) {
        case "AC/Cruzeiro do Sul": return [
            // https://www.cruzeirodosul.ac.gov.br/paginas/feriados-2025
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora da Glória"),
            fm(SETEMBRO, 27, "Dia da Marcha para Jesus"),
            aniversarioDaCidade(SETEMBRO, 28)
        ];
        case "AC/Rio Branco": return [
            aniversarioDaCidade(DEZEMBRO, 28)
        ];
        case "AC/Sena Madureira": return [
            // https://www.senamadureira.ac.gov.br/product-page/decreto-n-029-2025-calend%C3%A1rio-de-feriados-e-pontos-facultativos-2025
            fm(ABRIL, 8, "Dia da Morte do Padre Paolino Maria Baldassari"),
            aniversarioDaCidade(SETEMBRO, 25),
            diaDeNossaSenhoraDaConceicao
        ];
        case "AL/Arapiraca": return [
            fm(FEVEREIRO, 2, "Dia de Nossa Senhora do Bom Conselho"),
            diaDeCorpusChristi,
            fm(OUTUBRO, 30, "Emancipação Política de Arapiraca")
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
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora das Graças"),
            fm(DEZEMBRO, 1, "Dia do Laudo Suíço")
        ];
        case "AP/Santana": return [
            // https://portal.mpap.mp.br/calendario/
            diaDeSantAnna,
            aniversarioDaCidade(DEZEMBRO, 17)
        ];     
        case "AM/Itacoatiara": return [
            // https://www.instagram.com/p/DFIPbnJqAxm/?img_index=3
            aniversarioDaCidade(ABRIL, 25),
            diaDeSaoPedro,
            fm(NOVEMBRO, 1, "Dia de Nossa Senhora do Rosário"),
        ];
        case "AM/Manaus": return [
            { tipo: "MUNICIPAL", data: calcularTercaFeiraDeCarnaval(ano), descricao: "Terça-feira de Carnaval" },
            aniversarioDaCidade(OUTUBRO, 24)
        ];
        case "AM/Parintins": return [
            // https://www.calendariox.com.br/feriados-parintins-am.html
            fm(MAIO, 14, "Sagração do Primeiro Bispo de Parintins"),
            fm(JULHO, 16, "Dia de Nossa Senhora do Carmo"),
            aniversarioDaCidade(OUTUBRO, 15)
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
        case "CE/Caucaia": return [
            // https://www.caucaia.ce.gov.br/arquivos/1172/2209.pdf
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora dos Prazeres"),
            aniversarioDaCidade(OUTUBRO, 15)
        ];        
        case "CE/Fortaleza": return [
            aniversarioDaCidade(ABRIL, 13),
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora()
        ];
        case "CE/Juazeiro do Norte": return [
            // https://www.calendariox.com.br/feriados-juazeiro-do-norte-ce.html
            fm(MARCO, 24, "Aniversário de Padre Cícero"),
            aniversarioDaCidade(JULHO, 22),
            aniversarioDaCidade(SETEMBRO, 15, "Dia de Nossa Senhora das Dores")
        ];
        case "DF/Brasília": return [
            // O aniversário de Brasília cai no dia de Tiradentes,
            // além disso, Brasília não possui municípios, por ser um distrito federal.
        ];        
        case "ES/Cariacica": return [
            // https://www.cariacica.es.gov.br/noticia/ler/89845/-/popup
            diaDeCorpusChristi,
            diaDeSaoJoao
        ];
        case "ES/Serra": return [
            // https://www.serra.es.gov.br/noticias/serra-divulga-calendario-de-feriados-e-pontos-facultativos-para-2025
            diaDeSaoPedro,
            diaDeNossaSenhoraDaConceicao,
            fm(DEZEMBRO, 26, "Dia do Serrano")
        ];
        case "ES/Vila Velha": return [
            // https://legislacao.vilavelha.es.gov.br/Arquivo/Documents/legislacao/html/D72025.html?identificador=340039003600310039003A004C00
            diaDeCorpusChristi,
            fm(MAIO, 23, "Colonização do Solo Espírito-Santense")
        ];        
        case "ES/Vitória": return [
            diaDeCorpusChristi,
            fm(SETEMBRO, 8, "Dia de Nossa Senhora da Vitória"),
        ];
        case "GO/Anápolis": return [
            // https://sapl.anapolis.go.leg.br/media/sapl/public/normajuridica/1968/3929/3929_texto_integral.pdf
            diaDeCorpusChristi,
            aniversarioDaCidade(JULHO, 31)
        ];
        case "GO/Aparecida de Goiânia": return [
            // https://www.calendariox.com.br/feriados-aparecida-de-goiania-go.html
            aniversarioDaCidade(MAIO, 11),
            fm(NOVEMBRO, 14, "Emacipação de Aparecida de Goiânia")
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
        case "MA/São José de Ribamar": return [
            // https://www.saojosederibamar.ma.gov.br/arquivo/legislacao/decreto_1127_2016
            diaDeSaoJose,
            diaDeCorpusChristi,
            fm(SETEMBRO, 24, "Emancipação Política do Município"),
            aniversarioDaCidade(DEZEMBRO, 16)
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
        case "MS/Dourados": return [
            // https://www.calendariox.com.br/feriados-dourados-ms.html
            diaDeNossaSenhoraDaConceicao,
            aniversarioDaCidade(DEZEMBRO, 20)
        ];
        case "MS/Ponta Porã": return [
            // https://www.mpms.mp.br/feriados/2025
            diaDeSaoJose,
            aniversarioDaCidade(JULHO, 18)
        ];
        case "MS/Três Lagoas": return [
            // https://www.calendariox.com.br/feriados-tres-lagoas-ms.html
            diaDeSantoAntonio,
            aniversarioDaCidade(JUNHO, 15)
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
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora da Piedade"),
        ];
        case "MG/Nova Lima": return [
            // https://cmnovalima.mg.gov.br/processo-legislativo/arquivos/3cf43abdcb3a0f16dc30f15307ce2879.pdf
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora do Pilar"),
            diaDeNossaSenhoraDaConceicao
        ];
        case "MG/Uberaba": return [
            // http://www.uberaba.mg.gov.br/portal/acervo//legislacao/feriados_municipio/Lei%205545.pdf
            fm(MARCO, 2, "Dia de Uberaba"),
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora(),
        ];
        case "MG/Belo Horizonte": return [
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora da Boa Viagem"),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "MG/Uberlândia": return [
            // https://www.uberlandia.mg.gov.br/prefeitura/secretarias/administracao/calendario-de-feriados/
            diaDeCorpusChristi,
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora da Abadia"),
            fm(AGOSTO, 31, "Dia de São Raimundo")
        ];
        case "PA/Ananindeua": return [
            // https://www.ananindeua.pa.gov.br/midias/legislacao/2193_decreto_n_2_740_de_24_de_fevereiro_de_2025_.pdf
            aniversarioDaCidade(JANEIRO, 3),
            diaDeCorpusChristi,
            diaDeNossaSenhoraDaConceicao
        ];
        case "PA/Belém": return [
            aniversarioDaCidade(JANEIRO, 12),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PA/Santarém": return [
            // https://santarem.pa.gov.br/notas/governo-e-administracao/prefeitura-divulga-datas-de-feriados-nacionais-estadual-e-municipais-vgjyz7
            aniversarioDaCidade(JUNHO, 22),
            diaDeNossaSenhoraDaConceicao
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
        case "PB/Patos": return [
            // https://www.ifpb.edu.br/patos/ensino/calendarios-2020/calendario-2025/tecnicos-integrados/integ2025.pdf
            fm(SETEMBRO, 24, "Dia de Nossa Senhora da Guia"),
            fm(OUTUBRO, 24, "Emancipação Política de Patos")
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
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora da Abadia")
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
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora Rainha dos Anjos"),
            aniversarioDaCidade(SETEMBRO, 21),
        ];
        case "PE/Recife": return [
            fm(JULHO, 16, "Dia de Nossa Senhora do Carmo"),
            diaDeNossaSenhoraDaConceicao,
        ];
        case "PI/Parnaíba": return [
            // https://www.parnaiba.pi.leg.br/wp-content/uploads/2023/09/PROJETO-DE-LEI-No-82-2023-PODER-EXECUTIVO.pdf
            diaDeCorpusChristi,
            aniversarioDaCidade(AGOSTO, 14),
            fm(SETEMBRO, 8, "Dia de Nossa Senhora Mãe da Divina Graça"),
            fm(OUTUBRO, 4, "Dia de São Francisco")
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
        case "RO/Ji-Paraná": return [
            // https://rondonia.ro.gov.br/decreto-regulamenta-calendario-de-feriados-e-pontos-facultativos-para-2025-em-rondonia/
            fm(AGOSTO, 16, "Dia de São João Bosco"),
            aniversarioDaCidade(NOVEMBRO, 22)
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
        case "SP/Santos": return [
            // https://www.claudiamendes.com.br/boletim/feriados-e-pontos-facultativos-em-santos-2025-332
            aniversarioDaCidade(JANEIRO, 26),
            diaDeCorpusChristi,
            fm(SETEMBRO, 8, "Dia de Nossa Senhora do Monte Serrat")
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
            // https://saocarlos.sp.gov.br/index.php/conheca-sao-carlos/115443-feriados.html
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora da Babilônia"),
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
        case "SP/Ubatuba": return [
            // https://www.ubatuba.sp.gov.br/calendarios/calendario-municipal-2024/
            diaDeSaoPedro,
            fm(SETEMBRO, 14, "Paz de Iperoig"),
            aniversarioDaCidade(OUTUBRO, 28)
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
        case "SE/Nossa Senhora do Socorro": return [
            // https://www.socorro.se.gov.br/feriados-municipais
            fm(FEVEREIRO, 2, "Dia de Nossa Senhora do Socorro"),
            diaDeCorpusChristi,
            fm(JULHO, 7, "Emancipação Política do Município"),
            diaDeAssuncaoDeNossaSenhora("Dia de Nossa Senhora do Amparo")
        ];
        case "TO/Araguaína": return [
            // https://www.sindmetalurgicos-to.com.br/wp-content/uploads/2025/01/FERIADOS-2025-2.pdf
            diaDoSagradoCoracaoDeJesus,
            aniversarioDaCidade(NOVEMBRO, 14)
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
