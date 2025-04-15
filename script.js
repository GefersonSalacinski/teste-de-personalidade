class CalculadoraInvestimentos {
    constructor() {
        this.formulario = document.getElementById("formulario-investimento");
        this.grafico = null;

        // Seletor dos elementos usados
        this.seletores = {
            valorInicial: "valor-inicial",
            taxaJuros: "taxa-juros",
            periodoInvestimento: "periodo-investimento",
            tipoJuros: "tipo-juros",
            escalaTempo: "escala-tempo",
            taxaInflacao: "taxa-inflacao",
            contribuicaoMensal: "contribuicao-mensal",
            metaValor: "meta-valor",
            calcularMeta: "calcular-meta",
            selecaoCenario: "cenarios-investimento",
            valorFinal: "valor-final",
            graficoCanvas: "grafico-investimentos",
            resumoResultado: "resumo-resultado"
        };

        // Cenários predefinidos
        this.cenarios = {
            conservador: 0.03,
            moderado: 0.06,
            agressivo: 0.12
        };

        this.bindEventos();
    }

    // Formatar número para o padrão brasileiro (milhar com ponto e decimais com vírgula)
    formatarNumero(valor) {
        valor = valor.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (valor === "") return "";

        // Converte para número e formata com 2 casas decimais
        const numero = parseFloat(valor) / 100;
        return numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Aplica a formatação no campo quando o usuário sai
    aplicarFormatacao(evento) {
        const campo = evento.target;
        campo.value = this.formatarNumero(campo.value);
    }

    obterValor(id, isFloat = true) {
        const campo = document.getElementById(this.seletores[id]);
        const valor = campo.value.replace(/\./g, "").replace(",", "."); // Substitui ponto por nada e vírgula por ponto
        return isFloat ? parseFloat(valor) || 0 : valor;
    }

    calcularTaxa(taxa, escala) {
        return escala === "anual" ? taxa / 12 : taxa;
    }

    calcularTaxaReal(taxa, inflacao) {
        return taxa - inflacao;
    }

    calcularCrescimento(inicial, taxa, periodo, tipo, contribuicao) {
        let total = inicial;
        let valores = [];

        for (let i = 1; i <= periodo; i++) {
            if (tipo === "composto") {
                total = (total + contribuicao) * (1 + taxa);
            } else {
                total += (inicial * taxa) + contribuicao;
            }
            valores.push(total.toFixed(2));
        }

        return valores;
    }

    renderizarGrafico(valores) {
        const ctx = document.getElementById(this.seletores.graficoCanvas).getContext("2d");

        if (this.grafico) {
            this.grafico.destroy();
        }

        this.grafico = new Chart(ctx, {
            type: "line",
            data: {
                labels: valores.map((_, i) => `Mês ${i + 1}`),
                datasets: [{
                    label: "Crescimento do Investimento",
                    data: valores,
                    borderColor: "#388f35",
                    backgroundColor: "rgba(56, 143, 53, 0.2)"
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: "Meses" } },
                    y: { title: { display: true, text: "Valor (R$)" } }
                }
            }
        });
    }

    mostrarResumo(valorFinal, periodo) {
        // Garantindo a formatação correta no padrão brasileiro
        const valorFormatado = valorFinal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    
        // Atualizando o elemento do HTML
        document.getElementById(this.seletores.resumoResultado).textContent =
            `Com os dados informados, seu investimento alcançará ${valorFormatado} após ${periodo} meses.`;
    }
    
    calcularProjecao() {
        const inicial = this.obterValor("valorInicial");
        const taxaBruta = this.obterValor("taxaJuros") / 100;
        const periodo = this.obterValor("periodoInvestimento", false);
        const tipo = this.obterValor("tipoJuros", false);
        const escala = this.obterValor("escalaTempo", false);
        const inflacao = this.obterValor("taxaInflacao") / 100;
        const contribuicao = this.obterValor("contribuicaoMensal");

        if (inicial <= 0 || periodo <= 0) {
            alert("Por favor, insira valores válidos para o investimento inicial e o período.");
            return;
        }

        const taxaAjustada = this.calcularTaxaReal(this.calcularTaxa(taxaBruta, escala), inflacao);
        const valores = this.calcularCrescimento(inicial, taxaAjustada, periodo, tipo, contribuicao);
        const valorFinal = valores[valores.length - 1];

        this.renderizarGrafico(valores);
        this.mostrarResumo(valorFinal, periodo);
    }

    calcularProjecaoMeta() {
        const inicial = this.obterValor("valorInicial");
        const taxaBruta = this.obterValor("taxaJuros") / 100;
        const escala = this.obterValor("escalaTempo", false);
        const contribuicao = this.obterValor("contribuicaoMensal");
        const meta = this.obterValor("metaValor");

        if (inicial <= 0 || contribuicao <= 0 || meta <= 0) {
            alert("Por favor, insira valores válidos para o investimento inicial, o aporte mensal e a meta.");
            return;
        }

        const taxa = this.calcularTaxa(taxaBruta, escala);

        let total = inicial;
        let meses = 0;

        while (total < meta) {
            total = (total + contribuicao) * (1 + taxa);
            meses++;
        }

        alert(`Você atingirá sua meta em ${meses} meses.`);
    }

    atualizarCenario() {
        const cenario = document.getElementById(this.seletores.selecaoCenario).value;
        const taxa = this.cenarios[cenario];
        document.getElementById(this.seletores.taxaJuros).value = (taxa * 100).toFixed(2);
    }

    bindEventos() {
        this.formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            this.calcularProjecao();
        });

        document.getElementById(this.seletores.calcularMeta).addEventListener("click", () => {
            this.calcularProjecaoMeta();
        });

        document.getElementById(this.seletores.selecaoCenario).addEventListener("change", () => {
            this.atualizarCenario();
        });

        // Adiciona evento de formatação nos campos ao sair
        document.querySelectorAll(`#${this.seletores.valorInicial}, #${this.seletores.taxaJuros}, #${this.seletores.taxaInflacao}, #${this.seletores.metaValor}, #${this.seletores.contribuicaoMensal}`).forEach(campo => {
            campo.addEventListener("blur", (evento) => this.aplicarFormatacao(evento));
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new CalculadoraInvestimentos();

    const alternarTema = document.getElementById("alternar-tema");

    alternarTema.addEventListener("click", () => {
        document.body.classList.toggle("modo-escuro");
        alternarTema.textContent = document.body.classList.contains("modo-escuro") ? "Modo Claro" : "Modo Escuro";
        localStorage.setItem("tema", document.body.classList.contains("modo-escuro") ? "escuro" : "claro");
    });

    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "escuro") {
        document.body.classList.add("modo-escuro");
        alternarTema.textContent = "Modo Claro";
    } else {
        alternarTema.textContent = "Modo Escuro";
    }
});