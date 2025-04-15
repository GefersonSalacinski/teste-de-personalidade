document.querySelector("#quiz").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio do formulário

    // Coleta as respostas de todas as perguntas
    const respostasPorPergunta = [];
    for (let i = 1; i <= 10; i++) {
        const respostas = Array.from(document.querySelectorAll(`input[name="q${i}"]:checked`)).map(input => input.value);
        respostasPorPergunta.push(respostas);
    }

    let resultadoFinal = "";

    // Verifica se todas as perguntas foram respondidas
    if (respostasPorPergunta.some(respostas => respostas.length === 0)) {
        resultadoFinal = "Por favor, responda todas as perguntas.";
    } else {
        // Contadores para cada área (frontend e backend)
        let contadorFrontend = 0;
        let contadorBackend = 0;

        respostasPorPergunta.forEach(respostas => {
            if (respostas.includes("frontend")) contadorFrontend++;
            if (respostas.includes("backend")) contadorBackend++;
        });

        // Define o resultado com base nos contadores
        if (contadorFrontend > contadorBackend) {
            resultadoFinal = "Frontend é a sua cara! Você ama criar designs lindos e interativos.";
        } else if (contadorBackend > contadorFrontend) {
            resultadoFinal = "Backend é a sua paixão! Resolver problemas complexos te encanta.";
        } else {
            resultadoFinal = "Você é Fullstack! O melhor dos dois mundos.";
        }
    }

    // Exibe o resultado
    document.querySelector("#resultado").innerText = resultadoFinal;
});