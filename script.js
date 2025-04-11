document.querySelector("#quiz").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio do formulário

    // Coleta as respostas
    const q1 = Array.from(document.querySelectorAll('input[name="q1"]:checked')).map(input => input.value);
    const q2 = Array.from(document.querySelectorAll('input[name="q2"]:checked')).map(input => input.value);

    let respostas = "";

    if (q1.length === 0 || q2.length === 0) {
        respostas = "Por favor, responda todas as perguntas.";
    } else if (q1.includes("frontend") && q2.includes("frontend")) {
        respostas = "Frontend é a sua cara! Você ama criar designs lindos e interativos.";
    } else if (q1.includes("backend") && q2.includes("backend")) {
        respostas = "Backend é a sua paixão! Resolver problemas complexos te encanta.";
    } else {
        respostas = "Você é Fullstack! O melhor dos dois mundos.";
    }

    // Exibe o resultado
    document.querySelector("#resultado").innerText = respostas;
});