let tooltip = null;
let calendar = null;
let outraCidadeVisivelParaEscolha = false;
let periodo1 = null;
let periodo2 = null;
let periodo3 = null;

function parametroNaoEhVazio (p) {
    return p != undefined && p != null && p != "";
}

function setupView(tela) {
    const slEstado = document.getElementById("slEstado"),
        slEstado2 = document.getElementById("slEstado2"),
        slCidade = document.getElementById("slCidade"),
        slCidade2 = document.getElementById("slCidade2"),
        inpAno = document.getElementById("inpAno"),
        inpMarcarEmendas = document.getElementById("inpMarcarEmendas"),
        btnIncluirOutraCidade = document.getElementById("btnIncluirOutraCidade"),
        btnExportar = document.getElementById("btnExportar"),
        slFormatoExportacao = document.getElementById("slFormatoExportacao"),
        divPeriodoSelecionado1 = document.getElementById("divPeriodoSelecionado1"),
        divPeriodoSelecionado2 = document.getElementById("divPeriodoSelecionado2"),
        divPeriodoSelecionado3 = document.getElementById("divPeriodoSelecionado3"),
        btPeriodoSelecionado1 = document.getElementById("btPeriodoSelecionado1"),
        btPeriodoSelecionado2 = document.getElementById("btPeriodoSelecionado2"),
        btPeriodoSelecionado3 = document.getElementById("btPeriodoSelecionado3"),
        qryParams = lerQueryParametersDaUrl();

    // setup para ambas as telas: calendário e tabela
    atualizarListaDeEstados(1);
    atualizarListaDeCidades(1);
    atualizarListaDeEstados(2);
    atualizarListaDeCidades(2);
    atualizarAnoInicial();

    slEstado.addEventListener('change', function () {
        salvarQueryParametersNaUrl();
        atualizarListaDeCidades(1);
        validarECalcularFeriados(tela);
    });
    slCidade.addEventListener('change', function () {
        salvarQueryParametersNaUrl();
        validarECalcularFeriados(tela);
    });
    slEstado2.addEventListener('change', function () {
        salvarQueryParametersNaUrl();
        atualizarListaDeCidades(2);
    });
    slCidade2.addEventListener('change', function () {
        salvarQueryParametersNaUrl();
        validarECalcularFeriados(tela);
    });
    inpAno.addEventListener('change', function () {
        salvarQueryParametersNaUrl();
        if (tela == "calendario") {
            atualizarCalendarioComAnoSelecionado();
        }
        validarECalcularFeriados(tela);
    });
    inpMarcarEmendas.addEventListener('change', function () {
        validarECalcularFeriados(tela);
    });
    btnIncluirOutraCidade.addEventListener('click', function () {
        if (outraCidadeVisivelParaEscolha == false) {
            btnIncluirOutraCidade.innerText = "Esquecer segunda cidade";
            outraCidadeVisivelParaEscolha = true;
            divEstado2.style.visibility = "visible";
            divEstado2.style.display = "initial";
            divCidade2.style.visibility = "visible";
            divCidade2.style.display = "initial";
        } else {
            btnIncluirOutraCidade.innerText = "Incluir outra cidade";
            outraCidadeVisivelParaEscolha = false;
            divEstado2.style.visibility = "collapse";
            divEstado2.style.display = "none";
            divCidade2.style.visibility = "collapse";
            divCidade2.style.display = "none";
        }
        validarECalcularFeriados(tela);
    });

    // setup exclusivo para tela de calendário
    if (tela == "calendario") {
        construirCalendario();
        btPeriodoSelecionado1.addEventListener('click', function () {
            divPeriodoSelecionado1.style.visibility = "collapse";
            divPeriodoSelecionado1.style.display = "none";
            periodo1 = null;
            validarECalcularFeriados(tela);
        });
        btPeriodoSelecionado2.addEventListener('click', function () {
            divPeriodoSelecionado2.style.visibility = "collapse";
            divPeriodoSelecionado2.style.display = "none";
            periodo2 = null;
            validarECalcularFeriados(tela);
        });
        btPeriodoSelecionado3.addEventListener('click', function () {
            divPeriodoSelecionado3.style.visibility = "collapse";
            divPeriodoSelecionado3.style.display = "none";
            periodo3 = null;
            validarECalcularFeriados(tela);
        });
    }
    if (tela == "tabela") {
        atualizarListaDeFormatosDeExportacao();
        btnExportar.addEventListener('click', function () {
            const formatoExportacao = obterFormatoExportacaoSelecionado();
            if (formatoExportacao != undefined && formatoExportacao != null && formatoExportacao != "") {
                slFormatoExportacao.classList.remove("is-invalid")
                validarECalcularFeriados("exportarPara" + formatoExportacao);
            } else {
                slFormatoExportacao.classList.add("is-invalid")
            }

        });
    }

    // recuperação de parâmetros vindo via URL query parameters
    if (parametroNaoEhVazio(qryParams.ano)) {
        inpAno.value = parseInt(qryParams.ano, 10);
        if (tela == "calendario") {
            atualizarCalendarioComAnoSelecionado();
        }
    }
    if (parametroNaoEhVazio(qryParams.estado) && (estados.find(x => x.acronimo == qryParams.estado) != undefined)) {
        slEstado.value = qryParams.estado;
        atualizarListaDeCidades(1);
    }
    if (parametroNaoEhVazio(qryParams.cidade) && obterCidadesDoEstado(qryParams.estado).includes(qryParams.cidade)) {
        slCidade.value = qryParams.cidade;
    }
    if (parametroNaoEhVazio(qryParams.estado2) && (estados.find(x => x.acronimo == qryParams.estado2) != undefined)) {        
        btnIncluirOutraCidade.click();
        slEstado2.value = qryParams.estado2;
        atualizarListaDeCidades(2);
    }
    if (parametroNaoEhVazio(qryParams.cidade2) && obterCidadesDoEstado(qryParams.estado2).includes(qryParams.cidade2)) {
        slCidade2.value = qryParams.cidade2;
    }

    validarECalcularFeriados(tela);
}

function lerQueryParametersDaUrl() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params;
}

function montarQueryParametersAtuais(urlSearchParams) {
    const ano = obterAnoSelecionado();
    const uf = obterEstadoSelecionado(1);
    const cidade = obterCidadeSelecionada(1);
    const uf2 = obterEstadoSelecionado(2);
    const cidade2 = obterCidadeSelecionada(2);

    if (ano != new Date().getFullYear()) urlSearchParams.set('ano', ano.toString());
    if (parametroNaoEhVazio(uf)) urlSearchParams.set('estado', uf);
    if (parametroNaoEhVazio(cidade)) urlSearchParams.set('cidade', cidade);
    if (parametroNaoEhVazio(uf2)) urlSearchParams.set('estado2', uf2);
    if (parametroNaoEhVazio(cidade2)) urlSearchParams.set('cidade2', cidade2);
}

function salvarQueryParametersNaUrl() {
    const url = new URL(window.location);
    montarQueryParametersAtuais(url.searchParams);
    window.history.pushState({}, '', url);
}

function alternarModo(modo) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    montarQueryParametersAtuais(urlSearchParams);
    let urlSearchParamsStr = urlSearchParams.toString();
    if (parametroNaoEhVazio(urlSearchParamsStr)) {
        urlSearchParamsStr = "?" + urlSearchParamsStr;
    }

    if (modo == "calendario") {
        window.location.href = "index.html" + urlSearchParamsStr;
    } else if (modo == "tabela") {
        window.location.href = "tabela.html" + urlSearchParamsStr;
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

                // TODO: descobrir como deixar sticky e interactive;
                // não está funcionando direito, 
                // talvez por causa do HTML content
                tooltip = tippy(e.element, {
                    placement: 'top',
                    content: content,
                    allowHTML: true,
                    interactive: true,
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
            const totalDias = p.startDate.countDaysUpTo(p.endDate);
            if (totalDias > 1) {
                marcarPeriodoSelecionadoNoCalendario(p);
            }
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
    /*if (uf1 == undefined || uf1 == null || uf1 == "") {
        return;
    }
    if (cidade1 == undefined || cidade1 == null || cidade1 == "") {
        return;
    }*/

    var deveMarcarEmendas = outraCidadeVisivelParaEscolha ? false : obterMarcarEmendas();
    var feriados1 = obterTodosOsFeriadosParaAno(ano, uf1, cidade1, deveMarcarEmendas);
    var feriados2;
    var cidadeEstado1 = obterCidadeBarraEstadoSelecionados(1);
    var cidadeEstado2;
    if (outraCidadeVisivelParaEscolha) {

        var uf2 = obterEstadoSelecionado(2);
        var cidade2 = obterCidadeSelecionada(2);

        if (uf1 == undefined || uf1 == null || uf1 == "") {
            return;
        }
        if (cidade1 == undefined || cidade1 == null || cidade1 == "") {
            return;
        }
        if (uf2 == undefined || uf2 == null || uf2 == "") {
            return;
        }
        if (cidade2 == undefined || cidade2 == null || cidade2 == "") {
            return;
        }

        cidadeEstado2 = obterCidadeBarraEstadoSelecionados(2);
        feriados2 = obterTodosOsFeriadosParaAno(ano, uf2, cidade2, false);
    }

    const mostrarApenasEm1 = (feriados2 == undefined);
    const nomearLocalComoAmbas =
           saida == "calendario"
        || saida == "tabela"
        || saida == "exportarParaJson"
        || saida == "exportarParaCsvExcel";
    const feriados = agruparFeriadosComunsOuDistintos(feriados1, feriados2, nomearLocalComoAmbas);

    if (saida == "calendario") {
        atualizarCalendarioComFeriados(mostrarApenasEm1, feriados);
    }
    else if (saida == "tabela") {
        montarResumoTabelaDeFeriados(mostrarApenasEm1, feriados);
    }
    else if (saida == "exportarParaJson") {
        exportarFeriadosParaArquivoJson(feriados, ano, cidadeEstado1, cidadeEstado2);
    }
    else if (saida == "exportarParaCsvExcel") {
        exportarFeriadosParaArquivoCsvExcel(feriados, ano, cidadeEstado1, cidadeEstado2);
    }
    else if (saida == "exportarParaICalendar") {
        exportarFeriadosParaArquivoICalendar(feriados, ano, cidadeEstado1, cidadeEstado2);
    }
    else if (saida == "exportarParaCsvGoogleCalendar") {
        exportarFeriadosParaArquivoCsvGoogleCalendar(feriados, ano, cidadeEstado1, cidadeEstado2);
    }
}

function atualizarAnoInicial() {
    document.getElementById("inpAno").value = new Date().getFullYear();
}

function atualizarListaDeFormatosDeExportacao() {
    const slFormatoExportacao = document.getElementById("slFormatoExportacao");

    const opSelecionarFormato = document.createElement("option");
    opSelecionarFormato.disabled = true;
    opSelecionarFormato.selected = true;
    opSelecionarFormato.innerHTML = "Selecione um formato";
    opSelecionarFormato.value = "";

    const opJson = document.createElement("option");
    opJson.innerHTML = "JSON";
    opJson.value = "Json";

    const opCsvExcel = document.createElement("option");
    opCsvExcel.innerHTML = "CSV para Microsoft Excel";
    opCsvExcel.value = "CsvExcel";

    const opICalendar = document.createElement("option");
    opICalendar.innerHTML = "iCalendar (.ics)";
    opICalendar.value = "ICalendar";

    const opCsvGoogleCalendar = document.createElement("option");
    opCsvGoogleCalendar.innerHTML = "CSV para Google Calendar";
    opCsvGoogleCalendar.value = "CsvGoogleCalendar";

    slFormatoExportacao.appendChild(opSelecionarFormato);
    slFormatoExportacao.appendChild(opJson);
    slFormatoExportacao.appendChild(opCsvExcel);
    slFormatoExportacao.appendChild(opICalendar);
    slFormatoExportacao.appendChild(opCsvGoogleCalendar);
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

function montarResumoTabelaDeFeriados(mostrarApenasEm1, feriados) {
    document.getElementById("cardFeriados").style.visibility = "visible";

    var bodyTabela = "";
    feriados.forEach(f => {
        bodyTabela += "<tr>"
            + "<td>" + f.data.toLocaleDateString("pt-BR", { month: "long", day: "numeric" }) + "</td>"
            + "<td>" + f.data.toLocaleDateString("pt-BR", { weekday: "long" }) + "</td>"
            + "<td>" + f.descricao + "</td>"
            + "<td>" + (mostrarApenasEm1 ? mapearTipoFeriadoPorExtenso(f.tipo) : f.local) + "</td>"
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

    var div = null, bt = null;
    if (periodo1 == null) {
        periodo1 = periodo;
        div = document.getElementById("divPeriodoSelecionado1");
        bt = document.getElementById("btPeriodoSelecionado1");
    }
    else if (periodo2 == null) {
        periodo2 = periodo;
        div = document.getElementById("divPeriodoSelecionado2");
        bt = document.getElementById("btPeriodoSelecionado2");
    }
    else if (periodo3 == null) {
        periodo3 = periodo;
        div = document.getElementById("divPeriodoSelecionado3");
        bt = document.getElementById("btPeriodoSelecionado3");
    }

    bt.innerText = txt;
    div.style.visibility = "visible";
    div.style.display = "initial";
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
    document.getElementById("calendar").style.visibility = "visible";

    const escolherCorDoFeriado = function (x) {
        if (x.ehEmenda) return "#e6ffcc";

        switch (x.grupo) {
            case "comum": return "#9AB8FE";
            case "apenasEm1": return "#00CC4E";
            case "apenasEm2": return "#FEDD00";
        }
    };

    var periodos = obterFinaisDeSemanaParaAno(obterAnoSelecionado()).map(function (x) {
        return {
            name: "Fim de semana",
            details: x.getDay() == SABADO ? "Sábado" : "Domingo",
            color: "#e6ffcc",
            startDate: x,
            endDate: x
        };
    });

    periodos = periodos.concat(obterPeriodosSelecionadosParaCalendario());

    periodos = periodos.concat(feriados.map(function (x) {
        return {
            name: (mostrarApenasEm1 ? mapearTipoFeriadoPorExtenso(x.tipo) : x.local),
            details: x.descricao,
            color: escolherCorDoFeriado(x),
            startDate: x.data,
            endDate: x.data
        };
    }));

    calendar.setDataSource(periodos);
}

function agruparFeriadosComunsOuDistintos(feriados1, feriados2, nomearLocalComoAmbas) {
    if (feriados2 == undefined || feriados2 == null) {
        feriados2 = [];
    }

    var feriadosComuns = [], feriadosApenasEm1 = [], feriadosApenasEm2 = [];

    var municipio1 = obterCidadeBarraEstadoSelecionados(1);
    var municipio2 = obterCidadeBarraEstadoSelecionados(2);

    var f1 = undefined;
    var f2 = undefined;

    for (var i = 0; i < feriados1.length; i++) {
        f1 = feriados1[i];
        for (var j = 0; j < feriados2.length; j++) {
            f2 = feriados2[j];
            if (f1.data.isEqualTo(f2.data)) {

                // se for a mesma data e mesma descrição,
                // então apenas um feriado comum será adicionado.

                // senão, dois feriados comuns serão adicionados.
                // ex.: Aniversário de Boa Vista / RR e Revolução Constitucionalista de 1932 em SP
                // (ambos em 9 de julho), serão considerados feriados separados.

                if (f1.descricao == f2.descricao) {
                    feriadosComuns.push({ grupo: "comum", ...f1, local: nomearLocalComoAmbas ? "Ambas" : (municipio1 + " e " + municipio2) });
                } else {
                    feriadosComuns.push({ grupo: "comum", ...f1, local: municipio1 });
                    feriadosComuns.push({ grupo: "comum", ...f2, local: municipio2 });
                }
                break;
            }
        }
    }

    for (var i = 0; i < feriados1.length; i++) {
        f1 = feriados1[i];
        var ehFeriadoComum = feriadosComuns.find(x => x.data.isEqualTo(f1.data) && x.descricao == f1.descricao);
        if (!ehFeriadoComum) {
            feriadosApenasEm1.push({ ...f1, grupo: "apenasEm1", local: municipio1 });
        }
    }

    for (var i = 0; i < feriados2.length; i++) {
        f2 = feriados2[i];
        var ehFeriadoComum = feriadosComuns.find(x => x.data.isEqualTo(f2.data) && x.descricao == f2.descricao);
        if (!ehFeriadoComum) {
            feriadosApenasEm2.push({ ...f2, grupo: "apenasEm2", local: municipio2 });
        }
    }

    return feriadosComuns
        .concat(feriadosApenasEm1)
        .concat(feriadosApenasEm2)
        .sort((a, b) => a.data - b.data);
}

function obterMarcarEmendas() {
    return document.getElementById("inpMarcarEmendas").checked;
}

function obterAnoSelecionado() {
    return parseInt(document.getElementById("inpAno").value, 10);
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
            return estado.cidades.map(x => x.nome);
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

function obterFormatoExportacaoSelecionado() {
    const slFormatoExportacao = document.getElementById("slFormatoExportacao");
    return slFormatoExportacao.options[slFormatoExportacao.selectedIndex].value;
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

function exportarFeriadosParaArquivoJson(feriados, ano, cidadeEstado1, cidadeEstado2) {
    const nomeArquivo = gerarNomeDoArquivoExportacao(".json", ano, cidadeEstado1, cidadeEstado2);
    const conteudoStringArquivo = JSON.stringify(feriados, null, 2);
    const mimeType = "application/json";
    exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeType);
}

function exportarFeriadosParaArquivoCsvExcel(feriados, ano, cidadeEstado1, cidadeEstado2) {
    const nomeArquivo = gerarNomeDoArquivoExportacao(".csv", ano, cidadeEstado1, cidadeEstado2);
    const conteudoStringArquivo = converterJsonFeriadosParaCsvExcel(feriados);
    const mimeType = "text/csv";
    exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeType);
}

function exportarFeriadosParaArquivoICalendar(feriados, ano, cidadeEstado1, cidadeEstado2) {
    const nomeArquivo = gerarNomeDoArquivoExportacao(".ics", ano, cidadeEstado1, cidadeEstado2);
    const conteudoStringArquivo = converterJsonFeriadosParaICalendar(feriados);
    const mimeType = "text/calendar";
    exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeType);
}

function exportarFeriadosParaArquivoCsvGoogleCalendar(feriados, ano, cidadeEstado1, cidadeEstado2) {
    const nomeArquivo = gerarNomeDoArquivoExportacao(".csv", ano, cidadeEstado1, cidadeEstado2);
    const conteudoStringArquivo = converterJsonFeriadosParaCsvGoogleCalendar(feriados);
    const mimeType = "text/csv";
    exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeType);
}

function converterJsonFeriadosParaCsvExcel(feriados) {
    var csv = "\"tipo\";\"grupo\";\"data\";\"feriado\";\"local\";\n";

    const converterDataParaString = (data) => {
        const offset = data.getTimezoneOffset();
        data = new Date(data.getTime() - (offset * 60 * 1000));
        return data.toISOString().split('T')[0];
    };

    feriados.forEach(f => {
        csv += "\"" + (f.tipo || "") + "\";";
        csv += "\"" + (f.grupo || "") + "\";";
        csv += "\"" + converterDataParaString(f.data) + "\";";
        csv += "\"" + (f.descricao || "") + "\";";
        csv += "\"" + (f.local || "") + "\";";
        csv += "\n";
    });

    return csv;
}

function converterJsonFeriadosParaICalendar(feriados) {

    const formatarDataParaICalendar = function (date) {
        const pad = function (i) {
            return i < 10 ? `0${i}` : `${i}`;
        }
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        return `${year}${month}${day}`;
    }

    const formatarDataHoraParaICalendar = function (date) {
        const pad = function (i) {
            return i < 10 ? `0${i}` : `${i}`;
        }
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hour = pad(date.getUTCHours());
        const minute = pad(date.getUTCMinutes());
        const second = pad(date.getUTCSeconds());
        return `${year}${month}${day}T${hour}${minute}${second}Z`;
    }

    const normalizarEJuntarTextoAscii = function (str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replaceAll(/[\(\)\,]/gi, "")
            .replaceAll(/ /g, "_");
    }

    const gerarUIDEvento = (feriado) => {
        const anoEvento = feriado.data.getUTCFullYear();
        const nomeEvento = normalizarEJuntarTextoAscii(feriado.descricao);
        const nomeLocal = normalizarEJuntarTextoAscii(feriado.local);
        return nomeEvento + "@" + anoEvento + "@" + nomeLocal;
    };

    const agora = new Date();
    var txt = "";
    txt += "BEGIN:VCALENDAR\n";
    txt += "VERSION:2.0\n";
    txt += "PRODID:-//AlexandreHTRB//Feriados do Brasil//PT\n";
    txt += "CALSCALE:GREGORIAN\n";
    txt += "METHOD:PUBLISH\n";

    feriados.forEach(f => {
        txt += "BEGIN:VEVENT\n";
        txt += "UID:" + gerarUIDEvento(f) + "\n"; // data de criação do evento
        txt += "DTSTAMP:" + formatarDataHoraParaICalendar(agora) + "\n"; // data de criação do evento
        txt += "DTSTART;VALUE=DATE:" + formatarDataParaICalendar(f.data) + "\n"; // data de início do evento
        txt += "DTEND;VALUE=DATE:" + formatarDataParaICalendar(f.data.addDays(1)) + "\n"; // data de fim do evento (+1 dia)
        //txt += "DURATION:P1D\n"; // 1 dia de duração; quando tem DURATION, não precisa de DTEND
        txt += "SUMMARY:" + f.descricao + "\n"; // título / nome
        txt += "DESCRIPTION:Feriado " + f.tipo.toLowerCase() + " em " + f.local + "\n"; // tipo do feriado
        txt += "PRIORITY:1\n"; // prioridade 1 (máxima)
        txt += "TRANSP:OPAQUE\n"; // transparência opaca -> o evento ocupa tempo
        txt += "CATEGORIES:HOLIDAYS,FERIADOS\n"; // categorias
        txt += "END:VEVENT\n";
    });

    txt += "END:VCALENDAR";
    return txt;
}

function converterJsonFeriadosParaCsvGoogleCalendar(feriados) {
    var csv = "Subject,Start Date,Start Time,End Date,End Time,All day event,Description,Location,\n";

    const formatarNome = (feriado) => {
        return feriado.descricao.replaceAll(",", "");
    }

    const formatarDescricao = (feriado) => {
        // tipo: nacional, estadual, municipal
        return "Feriado " + feriado.tipo.toLowerCase() + " em " + feriado.local;
    }

    const formatarData = (feriado) => {
        // dd/MM/yyyy, precisa ser assim senão o Google Calendar 
        // configurado para Brasil entende errado
        return feriado.data.toLocaleDateString('pt-BR');
    }

    const formatarLocal = (feriado) => {
        return feriado.local;
    }

    feriados.forEach(f => {
        csv += formatarNome(f) + ",";
        csv += formatarData(f) + ",";
        csv += "07:00 AM,";
        csv += formatarData(f) + ",";
        csv += "10:00 PM,";
        csv += "TRUE,"; // Dia inteiro
        csv += formatarDescricao(f) + ",";
        csv += formatarLocal(f) + ",";
        csv += "\n";
    });

    return csv;
}

function gerarNomeDoArquivoExportacao(extensaoComPonto, ano, cidadeEstado1, cidadeEstado2) {
    if (cidadeEstado2 == null || cidadeEstado2 == undefined) {
        return "feriados_" + ano + "_" + (cidadeEstado1.replace("/", "-")) + extensaoComPonto;
    } else {
        return "feriados_" + ano + "_" + (cidadeEstado1.replace("/", "-")) + "_" + (cidadeEstado2.replace("/", "-")) + extensaoComPonto;
    }
}

function exportarParaArquivo(nomeArquivo, conteudoStringArquivo, mimeTypeArquivo) {
    var blob = new Blob([
        new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
        conteudoStringArquivo], { type: mimeTypeArquivo });
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
