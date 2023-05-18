let tooltip = null;
let calendar = null;

function setupView(tela) {
    atualizarListaDeEstados();
    atualizarListaDeCidades();
    atualizarAnoInicial();
    document.getElementById("slEstado").addEventListener('change', function () {
        atualizarListaDeCidades();
    });
    document.getElementById("slCidade").addEventListener('change', function () {
        validarECalcularFeriados(tela);
    });
    document.getElementById("inpAno").addEventListener('change', function () {
        if (tela == "calendario") {
            atualizarCalendarioComAnoSelecionado();
        }
        validarECalcularFeriados(tela);
    });

    if (tela == "calendario") {
        construirCalendario();
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
        }
    });
}

function validarECalcularFeriados(tela) {
    var ano = obterAnoSelecionado();
    var uf = obterEstadoSelecionado();
    var cidade = obterCidadeSelecionada();

    if (ano == undefined || ano == null) {
        return;
    }
    if (uf == undefined || uf == null || uf == "") {
        return;
    }
    if (cidade == undefined || cidade == null || cidade == "") {
        return;
    }

    var feriados = obterTodosOsFeriadosParaAno(ano, uf, cidade);

    if (tela == "calendario") {
        atualizarCalendarioComFeriados(feriados);
    }
    else if (tela == "tabela") {
        montarResumoTabelaDeFeriados(feriados);
    }
}

function atualizarAnoInicial() {
    document.getElementById("inpAno").value = new Date().getFullYear();
}

function atualizarListaDeEstados() {
    var slEstado = document.getElementById("slEstado");
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

function atualizarListaDeCidades() {
    var slCidade = document.getElementById("slCidade");
    while (slCidade.hasChildNodes()) {
        slCidade.removeChild(slCidade.lastChild);
    }

    var opSelecionarCidade = document.createElement("option");
    opSelecionarCidade.disabled = true;
    opSelecionarCidade.selected = true;
    opSelecionarCidade.innerHTML = "Selecione uma cidade";
    opSelecionarCidade.value = "";

    slCidade.appendChild(opSelecionarCidade);

    var uf = obterEstadoSelecionado();
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

function montarResumoTabelaDeFeriados(feriados) {
    document.getElementById("cardFeriados").style.visibility = "visible";

    var bodyTabela = "";
    feriados.forEach(f => {
        bodyTabela += "<tr>"
            + "<td>" + f.data.toLocaleDateString("pt-BR", { month: "long", day: "numeric" }) + "</td>"
            + "<td>" + f.data.toLocaleDateString("pt-BR", { weekday: "long" }) + "</td>"
            + "<td>" + f.descricao + "</td>"
            + "<td>" + mapearTipoFeriadoPorExtenso(f.tipo) + "</td>"
            + "<tr/>";
    });
    document.getElementById("tbodyTabelaFeriados").innerHTML = bodyTabela;
}

function atualizarCalendarioComAnoSelecionado() {
    calendar.setYear(obterAnoSelecionado());
}

function atualizarCalendarioComFeriados(feriados) {
    document.getElementById("cardCalendario").style.visibility = "visible";

    var feriadosMapeadosCalendario = feriados.map(function (x) {
        return {
            name: mapearTipoFeriadoPorExtenso(x.tipo),
            details: x.descricao,
            color: '#00CC4E',
            startDate: x.data,
            endDate: x.data
        };
    });

    calendar.setDataSource(feriadosMapeadosCalendario);
}

function obterAnoSelecionado() {
    return document.getElementById("inpAno").value;
}

function obterEstadoSelecionado() {
    var federativeUnitSelect = document.getElementById("slEstado");
    return federativeUnitSelect.options[federativeUnitSelect.selectedIndex].value;
}

function obterCidadesDoEstado(uf) {
    for (var i = 0; i < cidadesDosEstados.length; i++) {
        var estado = cidadesDosEstados[i];
        if (uf == estado.uf) {
            return estado.cidades;
        }
    }
    return [];
}

function obterCidadeSelecionada() {
    var citySelect = document.getElementById("slCidade");
    return citySelect.options[citySelect.selectedIndex].value;
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