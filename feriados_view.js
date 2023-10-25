let tooltip = null;
let calendar = null;
let outraCidadeVisivelParaEscolha = false;
let periodo1 = null;
let periodo2 = null;
let periodo3 = null;

function setupView(tela) {
    const slEstado = document.getElementById("slEstado"),
        slEstado2 = document.getElementById("slEstado2"),
        slCidade = document.getElementById("slCidade"),
        slCidade2 = document.getElementById("slCidade2"),
        inpAno = document.getElementById("inpAno"),
        btnIncluirOutraCidade = document.getElementById("btnIncluirOutraCidade"),
        btnExportarParaJson = document.getElementById("btnExportarParaJson"),
        btnExportarParaCsv = document.getElementById("btnExportarParaCsv"),
        divPeriodoSelecionado1 = document.getElementById("divPeriodoSelecionado1");

    // setup para ambas as telas: calendário e tabela
    atualizarListaDeEstados(1);
    atualizarListaDeCidades(1);
    atualizarListaDeEstados(2);
    atualizarListaDeCidades(2);
    atualizarAnoInicial();

    slEstado.addEventListener('change', function () {
        atualizarListaDeCidades(1);
    });
    slCidade.addEventListener('change', function () {
        validarECalcularFeriados(tela);
    });
    slEstado2.addEventListener('change', function () {
        atualizarListaDeCidades(2);
    });
    slCidade2.addEventListener('change', function () {
        validarECalcularFeriados(tela);
    });
    inpAno.addEventListener('change', function () {
        if (tela == "calendario") {
            atualizarCalendarioComAnoSelecionado();
        }
        validarECalcularFeriados(tela);
    });
    btnIncluirOutraCidade.addEventListener('click', function () {
        if (outraCidadeVisivelParaEscolha == false) {
            btnIncluirOutraCidade.innerText = "Esquecer segunda cidade";
            outraCidadeVisivelParaEscolha = true;
        } else {
            btnIncluirOutraCidade.innerText = "Incluir outra cidade";
            outraCidadeVisivelParaEscolha = false;
        }
        validarECalcularFeriados(tela);
    });

    // setup exclusivo para tela de calendário
    if (tela == "calendario") {
        construirCalendario();
        divPeriodoSelecionado1.addEventListener('click', function () {
            divPeriodoSelecionado1.style.visibility = "collapse";
            periodo1 = null;
            validarECalcularFeriados(tela);
        });
        divPeriodoSelecionado2.addEventListener('click', function () {
            divPeriodoSelecionado2.style.visibility = "collapse";
            periodo2 = null;
            validarECalcularFeriados(tela);
        });
        divPeriodoSelecionado3.addEventListener('click', function () {
            divPeriodoSelecionado3.style.visibility = "collapse";
            periodo3 = null;
            validarECalcularFeriados(tela);
        });
    }
    if (tela == "tabela") {
        btnExportarParaJson.addEventListener('click', function () {
            validarECalcularFeriados("exportarParaJson");
        });
        btnExportarParaCsv.addEventListener('click', function () {
            validarECalcularFeriados("exportarParaCsv");
        });
    }
}

function construirCalendario() {
    calendar = new Calendar('#calendar', {
        style: 'background',
        language: 'pt',
        enableRangeSelection: true,
        mouseOnDay: function (e) {
            if (e.events.length > 0) {
                var content = '';

                for (var i in e.events) {
                    content += '<div class="event-tooltip-content">'
                        + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
                        + '<div class="event-details">' + e.events[i].details + '</div>'
                        + '</div>';
                }

                if (tooltip !== null) {
                    tooltip.destroy();
                    tooltip = null;
                }

                tooltip = tippy(e.element, {
                    placement: 'right',
                    content: content,
                    animateFill: false,
                    animation: 'shift-away',
                    arrow: true
                });
                tooltip.show();
            }
        },
        mouseOutDay: function () {
            if (tooltip !== null) {
                tooltip.destroy();
                tooltip = null;
            }
        },
        selectRange: function (p) {
            marcarPeriodoSelecionadoNoCalendario(p);
        }
    });
}

function validarECalcularFeriados(saida) {
    var ano = obterAnoSelecionado();
    var uf1 = obterEstadoSelecionado(1);
    var cidade1 = obterCidadeSelecionada(1);

    if (ano == undefined || ano == null) {
        return;
    }
    if (uf1 == undefined || uf1 == null || uf1 == "") {
        return;
    }
    if (cidade1 == undefined || cidade1 == null || cidade1 == "") {
        return;
    }

    var feriados1 = obterTodosOsFeriadosParaAno(ano, uf1, cidade1);
    var feriados2;
    var cidadeEstado1 = obterCidadeBarraEstadoSelecionados(1);
    var cidadeEstado2;
    if (outraCidadeVisivelParaEscolha) {
        var uf2 = obterEstadoSelecionado(2);
        var cidade2 = obterCidadeSelecionada(2);

        if (uf2 == undefined || uf2 == null || uf2 == "") {
            return;
        }
        if (cidade2 == undefined || cidade2 == null || cidade2 == "") {
            return;
        }

        cidadeEstado2 = obterCidadeBarraEstadoSelecionados(2);
        feriados2 = obterTodosOsFeriadosParaAno(ano, uf2, cidade2);
    }

    const mostrarApenasEm1 = (feriados2 == undefined);
    const feriados = agruparFeriadosComunsOuDistintos(feriados1, feriados2);

    if (saida == "calendario") {
        atualizarCalendarioComFeriados(mostrarApenasEm1, feriados);
    }
    else if (saida == "tabela") {
        montarResumoTabelaDeFeriados(mostrarApenasEm1, feriados, cidadeEstado1, cidadeEstado2);
    }
    else if (saida == "exportarParaJson") {
        exportarFeriadosParaArquivoJson(feriados, ano, cidadeEstado1, cidadeEstado2);
    }
    else if (saida == "exportarParaCsv") {
        exportarFeriadosParaArquivoCsv(feriados, ano, cidadeEstado1, cidadeEstado2);
    }
}

function atualizarAnoInicial() {
    document.getElementById("inpAno").value = new Date().getFullYear();
}

function atualizarListaDeEstados(numSelecao) {
    var slEstado;
    if (numSelecao == 2) {
        slEstado = document.getElementById("slEstado2");
    } else {
        slEstado = document.getElementById("slEstado");
    }

    while (slEstado.hasChildNodes()) {
        slEstado.removeChild(slEstado.lastChild);
    }

    var opSelecionarEstado = document.createElement("option");
    opSelecionarEstado.disabled = true;
    opSelecionarEstado.selected = true;
    opSelecionarEstado.innerHTML = "Selecione um estado";
    opSelecionarEstado.value = "";

    slEstado.appendChild(opSelecionarEstado);

    for (var i = 0; i < estados.length; i++) {
        var estado = estados[i];
        var opEstado = document.createElement("option");
        opEstado.innerHTML = estado.nome;
        opEstado.value = estado.acronimo;
        slEstado.appendChild(opEstado);
    }
}

function atualizarListaDeCidades(numSelecao) {
    var slCidade;
    if (numSelecao == 2) {
        slCidade = document.getElementById("slCidade2");
    } else {
        slCidade = document.getElementById("slCidade");
    }

    while (slCidade.hasChildNodes()) {
        slCidade.removeChild(slCidade.lastChild);
    }

    var opSelecionarCidade = document.createElement("option");
    opSelecionarCidade.disabled = true;
    opSelecionarCidade.selected = true;
    opSelecionarCidade.innerHTML = "Selecione uma cidade";
    opSelecionarCidade.value = "";

    slCidade.appendChild(opSelecionarCidade);

    var uf = obterEstadoSelecionado(numSelecao);
    if (uf != undefined && uf != null && uf != "") {
        var cidades = obterCidadesDoEstado(uf);
        for (var i = 0; i < cidades.length; i++) {
            var cidade = cidades[i];
            var opCidade = document.createElement("option");
            opCidade.innerHTML = cidade;
            opCidade.value = cidade;
            opCidade.selected = false;
            slCidade.appendChild(opCidade);
        }
    }
}

function montarResumoTabelaDeFeriados(mostrarApenasEm1, feriados, cidadeEstado1, cidadeEstado2) {
    document.getElementById("cardFeriados").style.visibility = "visible";

    const mapearGrupoParaTabela = (grupo) => {
        switch (grupo) {
            case "comum": return "Ambas";
            case "apenasEm1": return cidadeEstado1;
            case "apenasEm2": return cidadeEstado2;
        }
    }

    var bodyTabela = "";
    feriados.forEach(f => {
        bodyTabela += "<tr>"
            + "<td>" + f.data.toLocaleDateString("pt-BR", { month: "long", day: "numeric" }) + "</td>"
            + "<td>" + f.data.toLocaleDateString("pt-BR", { weekday: "long" }) + "</td>"
            + "<td>" + f.descricao.join(", ") + "</td>"
            + "<td>" + (mostrarApenasEm1 ? mapearTipoFeriadoPorExtenso(f.tipo) : mapearGrupoParaTabela(f.grupo)) + "</td>"
            + "<tr/>";
    });
    document.getElementById("tbodyTabelaFeriados").innerHTML = bodyTabela;
}

function atualizarCalendarioComAnoSelecionado() {
    calendar.setYear(obterAnoSelecionado());
}

function marcarPeriodoSelecionadoNoCalendario(p) {
    const dataInicialStr = p.startDate.toLocaleDateString().slice(0, 5);
    const dataFinalStr = p.endDate.toLocaleDateString().slice(0, 5);
    const totalDias = p.startDate.countDaysUpTo(p.endDate);
    const txt = totalDias + " dias: de " + dataInicialStr + " a " + dataFinalStr;
    const periodo = { qtdDias: totalDias, descricao: ("de " + dataInicialStr + " a " + dataFinalStr), startDate: p.startDate, endDate: p.endDate };

    var div = null;
    if (periodo1 == null) {
        periodo1 = periodo;
        div = document.getElementById("divPeriodoSelecionado1");
    }
    else if (periodo2 == null) {
        periodo2 = periodo;
        div = document.getElementById("divPeriodoSelecionado2");
    }
    else if (periodo3 == null) {
        periodo3 = periodo;
        div = document.getElementById("divPeriodoSelecionado3");
    }

    div.innerText = txt;
    div.style.visibility = "visible";
    validarECalcularFeriados("calendario");
}

function obterPeriodosSelecionadosParaCalendario() {
    var periodos = [];

    if (periodo1 != null && periodo1 != undefined) {
        periodos.push(periodo1);
    }
    if (periodo2 != null && periodo2 != undefined) {
        periodos.push(periodo2);
    }
    if (periodo3 != null && periodo3 != undefined) {
        periodos.push(periodo3);
    }

    return periodos.map(function (x) {
        return {
            name: "" + x.qtdDias + " dias",
            details: x.descricao,
            color: "#ffe566",
            startDate: x.startDate,
            endDate: x.endDate
        };
    });
}

function atualizarCalendarioComFeriados(mostrarApenasEm1, feriados) {
    document.getElementById("cardCalendario").style.visibility = "visible";

    const escolherCorDoFeriado = function (x) {
        switch (x.grupo) {
            case "comum": return "#9AB8FE";
            case "apenasEm1": return "#00CC4E";
            case "apenasEm2": return "#FEDD00";
        }
    };

    var periodos = obterPeriodosSelecionadosParaCalendario();

    periodos = periodos.concat(feriados.map(function (x) {
        return {
            name: (mostrarApenasEm1 ? mapearTipoFeriadoPorExtenso(x.tipo) : x.cidadeBarraEstado.join(", ")),
            details: x.descricao.join(", "),
            color: escolherCorDoFeriado(x),
            startDate: x.data,
            endDate: x.data
        };
    }));

    calendar.setDataSource(periodos);
}

function agruparFeriadosComunsOuDistintos(feriados1, feriados2) {
    if (feriados2 == undefined || feriados2 == null) {
        feriados2 = [];
    }

    var feriadosComuns = [], feriadosApenasEm1 = [], feriadosApenasEm2 = [];

    var cidadeEstado1 = obterCidadeBarraEstadoSelecionados(1);
    var cidadeEstado2 = obterCidadeBarraEstadoSelecionados(2);

    var datasFeriados1 = feriados1.map(x => x.data);
    var datasFeriados2 = feriados2.map(x => x.data);
    var datasFeriadosComuns = filtrarApenasDatasDistintas(datasFeriados1.filter(x => datasFeriados2.find(y => y.isEqualTo(x)) != undefined));

    var cidadeEstado1 = obterCidadeBarraEstadoSelecionados(1);
    var cidadeEstado2 = obterCidadeBarraEstadoSelecionados(2);

    for (var i = 0; i < datasFeriadosComuns.length; i++) {
        var data = datasFeriadosComuns[i];
        var descricoesFeriados1NaData = feriados1.filter(f => f.data.isEqualTo(data)).map(f => f.descricao);
        var descricoesFeriados2NaData = feriados2.filter(f => f.data.isEqualTo(data)).map(f => f.descricao);
        var descricaoFeriadosNaData = filtrarApenasDistintos(descricoesFeriados1NaData.concat(descricoesFeriados2NaData));

        var cidadesBarraEstados = [];
        cidadesBarraEstados.push(cidadeEstado1);
        if (cidadeEstado2 != null && cidadeEstado2 != undefined) {
            cidadesBarraEstados.push(cidadeEstado2);
        }

        var fc = {
            grupo: "comum",
            data: data,
            tipo: undefined,
            cidadeBarraEstado: cidadesBarraEstados,
            descricao: descricaoFeriadosNaData
        };

        feriadosComuns.push(fc);
    }

    for (var i = 0; i < feriados1.length; i++) {
        var f = feriados1[i];
        var fc = feriadosComuns.find(x => x.data.isEqualTo(f.data));
        if (fc === undefined) {
            feriadosApenasEm1.push({ ...f, grupo: "apenasEm1", descricao: [f.descricao], cidadeBarraEstado: [cidadeEstado1] });
        }
    }

    for (var i = 0; i < feriados2.length; i++) {
        var f = feriados2[i];
        var fc = feriadosComuns.find(x => x.data.isEqualTo(f.data));
        if (fc === undefined) {
            feriadosApenasEm2.push({ ...f, grupo: "apenasEm2", descricao: [f.descricao], cidadeBarraEstado: [cidadeEstado2] });
        }
    }

    return feriadosComuns
        .concat(feriadosApenasEm1)
        .concat(feriadosApenasEm2)
        .sort((a, b) => a.data - b.data);
}

function obterAnoSelecionado() {
    return document.getElementById("inpAno").value;
}

function obterEstadoSelecionado(numSelecao) {
    var slEstado;
    if (numSelecao == 2) {
        slEstado = document.getElementById("slEstado2");
    } else {
        slEstado = document.getElementById("slEstado");
    }
    return slEstado.options[slEstado.selectedIndex].value;
}

function obterCidadesDoEstado(uf) {
    for (var i = 0; i < estados.length; i++) {
        var estado = estados[i];
        if (uf == estado.acronimo) {
            return estado.cidades;
        }
    }
    return [];
}

function obterCidadeSelecionada(numSelecao) {
    var slCidade;
    if (numSelecao == 2) {
        slCidade = document.getElementById("slCidade2");
    } else {
        slCidade = document.getElementById("slCidade");
    }

    return slCidade.options[slCidade.selectedIndex].value;
}

function obterCidadeBarraEstadoSelecionados(numSelecao) {
    return obterCidadeSelecionada(numSelecao) + "/" + obterEstadoSelecionado(numSelecao);
}

function mapearTipoFeriadoPorExtenso(tipo) {
    switch (tipo) {
        case "NACIONAL":
            return "Nacional";
        case "ESTADUAL":
            return "Estadual";
        case "MUNICIPAL":
            return "Municipal";
        default:
            return null;
    }
}

// tem que ser por método normal ao invés de método de extensão (prototype),
// senão, conflita com a lib de calendário por algum motivo
function filtrarApenasDistintos(arr) {
    return arr.filter(function (x, i, a) {
        return a.indexOf(x) == i;
    });
}

function filtrarApenasDatasDistintas(arr) {
    var ret = [];
    arr.forEach(x => {
        if (ret.find(y => y.isEqualTo(x)) == undefined) {
            ret.push(x);
        }
    });
    return ret;
}

function exportarFeriadosParaArquivoJson(feriados, ano, cidadeEstado1, cidadeEstado2) {
    const nomeArquivo = gerarNomeDoArquivoExportacao(".json", ano, cidadeEstado1, cidadeEstado2);
    const conteudoStringArquivo = JSON.stringify(feriados, null, 2);
    const mimeType = "application/json";
    exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeType);
}

function exportarFeriadosParaArquivoCsv(feriados, ano, cidadeEstado1, cidadeEstado2) {
    const nomeArquivo = gerarNomeDoArquivoExportacao(".csv", ano, cidadeEstado1, cidadeEstado2);
    const conteudoStringArquivo = converterJsonFeriadosParaCsv(feriados);
    const mimeType = "text/csv";
    exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeType);
}

function converterJsonFeriadosParaCsv(feriados) {
    var csv = "\"tipo\",\"grupo\",\"data\",\"descricao\",\"cidadeEstado1\",\"cidadeEstado2\"\n";

    const converterDataParaString = (data) => {
        const offset = data.getTimezoneOffset();
        data = new Date(data.getTime() - (offset * 60 * 1000));
        return data.toISOString().split('T')[0];
    };

    feriados.forEach(f => {
        var cidadeEstado1 = f.cidadeBarraEstado[0];
        var cidadeEstado2 = f.cidadeBarraEstado.length > 1 ? f.cidadeBarraEstado[1] : "";

        csv += "\"" + (f.tipo || "") + "\",";
        csv += "\"" + (f.grupo || "") + "\",";
        csv += "\"" + converterDataParaString(f.data) + "\",";
        csv += "\"" + f.descricao + "\",";
        csv += "\"" + (f.grupo == "apenasEm2" ? "" : cidadeEstado1) + "\",";
        csv += "\"" + (f.grupo == "apenasEm2" ? cidadeEstado1 : cidadeEstado2) + "\",";
        csv += "\n";
    });

    return csv;
}

function gerarNomeDoArquivoExportacao(extensaoComPonto, ano, cidadeEstado1, cidadeEstado2) {
    if (cidadeEstado2 == null || cidadeEstado2 == undefined) {
        return "feriados_" + ano + "_" + (cidadeEstado1.replace("/", "-")) + extensaoComPonto;
    }
    else {
        return "feriados_" + ano + "_" + (cidadeEstado1.replace("/", "-")) + "_" + (cidadeEstado2.replace("/", "-")) + extensaoComPonto;
    }
}

function exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeTypeArquivo) {
    var blob = new Blob([conteudoStringArquivo], { type: mimeTypeArquivo });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, nomeArquivo);
    } else {
        var e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
        a.download = nomeArquivo;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = [mimeTypeArquivo, a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
}
