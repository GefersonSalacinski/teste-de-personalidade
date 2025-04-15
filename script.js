class CalculadoraInvestimentos {
  constructor() {
      this.formulario = document.getElementById("formulario-investimento");
      this.grafico = null;

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
          graficoCanvas: "grafico-investimentos"
      };

      this.cenarios = {
          conservador: 0.03,
          moderado: 0.06,
          agressivo: 0.12
      };

      this.bindEventos();
  }

  obterValor(id, isFloat = true) {
      const valor = document.getElementById(this.seletores[id]).value;
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
                  borderColor: "#4caf50",
                  backgroundColor: "rgba(76, 175, 80, 0.2)"
              }]
          }
      });
  }

  mostrarValorFinal(valor) {
      document.getElementById(this.seletores.valorFinal).textContent = `Rendimento Final: R$ ${parseFloat(valor).toFixed(2)}`;
  }

  calcularProjecao() {
      const inicial = this.obterValor("valorInicial");
      const taxaBruta = this.obterValor("taxaJuros") / 100;
      const periodo = this.obterValor("periodoInvestimento", false);
      const tipo = this.obterValor("tipoJuros", false);
      const escala = this.obterValor("escalaTempo", false);
      const inflacao = this.obterValor("taxaInflacao") / 100;
      const contribuicao = this.obterValor("contribuicaoMensal");

      const taxaAjustada = this.calcularTaxaReal(this.calcularTaxa(taxaBruta, escala), inflacao);
      const valores = this.calcularCrescimento(inicial, taxaAjustada, periodo, tipo, contribuicao);
      const valorFinal = valores[valores.length - 1];

      this.renderizarGrafico(valores);
      this.mostrarValorFinal(valorFinal);
  }

  calcularProjecaoMeta() {
      const inicial = this.obterValor("valorInicial");
      const taxaBruta = this.obterValor("taxaJuros") / 100;
      const escala = this.obterValor("escalaTempo", false);
      const contribuicao = this.obterValor("contribuicaoMensal");
      const meta = this.obterValor("metaValor");

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
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CalculadoraInvestimentos();

  const alternarTema = document.getElementById("alternar-tema");

  alternarTema.addEventListener("click", () => {
      document.body.classList.toggle("modo-escuro");
      alternarTema.textContent = document.body.classList.contains("modo-escuro") ? "☀️" : "🌙";
      localStorage.setItem("tema", document.body.classList.contains("modo-escuro") ? "escuro" : "claro");
  });

  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "escuro") {
      document.body.classList.add("modo-escuro");
      alternarTema.textContent = "☀️";
  } else {
      alternarTema.textContent = "🌙";
  }
});