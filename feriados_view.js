let tooltip = null;
let calendar = null;
let outraCidadeVisivelParaEscolha = false;

function setupView(tela) {
    const slEstado = document.getElementById("slEstado"),
        slEstado2 = document.getElementById("slEstado2"),
        slCidade = document.getElementById("slCidade"),
        slCidade2 = document.getElementById("slCidade2"),
        btnIncluirOutraCidade = document.getElementById("btnIncluirOutraCidade");

    // setup para ambas as telas: calendário e tabela
    atualizarListaDeEstados(1);
    atualizarListaDeCidades(1);
    atualizarAnoInicial();

    slEstado.addEventListener('change', function () {
        atualizarListaDeCidades(1);
    });
    slCidade.addEventListener('change', function () {
        validarECalcularFeriados(tela);
    });
    document.getElementById("inpAno").addEventListener('change', function () {
        if (tela == "calendario") {
            atualizarCalendarioComAnoSelecionado();
        }
        validarECalcularFeriados(tela);
    });

    // setup exclusivo para tela de calendário
    if (tela == "calendario") {
        atualizarListaDeEstados(2);
        atualizarListaDeCidades(2);
        slEstado2.addEventListener('change', function () {
            atualizarListaDeCidades(2);
        });
        slCidade2.addEventListener('change', function () {
            validarECalcularFeriados(tela);
        });
        btnIncluirOutraCidade.addEventListener('click', function () {
            if (outraCidadeVisivelParaEscolha == false) {
                btnIncluirOutraCidade.innerText = "Esquecer segunda cidade";
                outraCidadeVisivelParaEscolha = true;
            } else  {
                btnIncluirOutraCidade.innerText = "Incluir outra cidade";
                outraCidadeVisivelParaEscolha = false;
            }
            validarECalcularFeriados(tela);
        });
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

    if (tela == "calendario") {
        var feriados2;

        if (outraCidadeVisivelParaEscolha) {
            var uf2 = obterEstadoSelecionado(2);
            var cidade2 = obterCidadeSelecionada(2);

            if (uf2 == undefined || uf2 == null || uf2 == "") {
                return;
            }
            if (cidade2 == undefined || cidade2 == null || cidade2 == "") {
                return;
            }

            feriados2 = obterTodosOsFeriadosParaAno(ano, uf2, cidade2);
        }

        atualizarCalendarioComFeriados(feriados1, feriados2);
    }
    else if (tela == "tabela") {
        montarResumoTabelaDeFeriados(feriados1);
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

function atualizarCalendarioComFeriados(feriados1, feriados2) {
    document.getElementById("cardCalendario").style.visibility = "visible";

    const mostrarApenasEm1 = (feriados2 == undefined);
    const feriados = agruparFeriadosComunsOuDistintos(feriados1, feriados2);

    const escolherCorDoFeriado = function (x) {
        switch (x.grupo) {
            case "comum" : return "#9AB8FE";
            case "apenasEm1" : return "#00CC4E";
            case "apenasEm2" : return "#FEDD00";
        }
    };

    var feriadosCalendario = feriados.map(function (x) {
        return {
            name: (mostrarApenasEm1 ? mapearTipoFeriadoPorExtenso(x.tipo) : x.cidadeBarraEstado),
            details: x.descricao,
            color: escolherCorDoFeriado(x),
            startDate: x.data,
            endDate: x.data
        };
    });

    calendar.setDataSource(feriadosCalendario);
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
        var descricaoFeriadosNaData = filtrarApenasDistintos(descricoesFeriados1NaData.concat(descricoesFeriados2NaData)).join(", ");

        var fc = {
            grupo: "comum", 
            data: data,
            tipo: undefined,
            cidadeBarraEstado: (cidadeEstado1 == cidadeEstado2 ? cidadeEstado1 : cidadeEstado1 + ", " + cidadeEstado2),
            descricao: descricaoFeriadosNaData
        };

        feriadosComuns.push(fc);
    }
    
    for (var i = 0; i < feriados1.length; i++) {
        var f = feriados1[i];
        var fc = feriadosComuns.find(x => x.data.isEqualTo(f.data));
        if (fc === undefined) {
            feriadosApenasEm1.push({ ...f, grupo: "apenasEm1", cidadeBarraEstado: cidadeEstado1 });
        }
    }

    for (var i = 0; i < feriados2.length; i++) {
        var f = feriados2[i];
        var fc = feriadosComuns.find(x => x.data.isEqualTo(f.data));
        if (fc === undefined) {
            feriadosApenasEm2.push({ ...f, grupo: "apenasEm2", cidadeBarraEstado:cidadeEstado2 });
        }
    }

    return feriadosComuns.concat(feriadosApenasEm1).concat(feriadosApenasEm2);
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
