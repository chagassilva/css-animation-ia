let webhook = "https://n8n.chagassilva.com/webhook/animation-css";

// Função auxiliar: gera uma Promise que rejeita após X ms
function timeoutPromise(ms) {
  return new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            "⏰ Tempo limite excedido. O servidor demorou para responder."
          )
        ),
      ms
    )
  );
}

// Função principal chamada ao clicar no botão
async function cliqueiNoBotao() {
  let textoInput = document.querySelector(".input-animacao").value;
  let codigo = document.querySelector(".area-codigo");
  let areaResultado = document.querySelector(".area-resultado");
  let loader = document.querySelector(".loader");
  let botao = document.querySelector(".botao-magica");
 

  // Prepara a interface
  botao.disabled = true;
  botao.textContent = "Criando...";
  botao.style.background = "#888888";
  loader.style.display = "block";
  areaResultado.innerHTML = ""; // limpa resultado anterior

  try {
    // Executa o fetch com timeout de 10s
    let resposta = await Promise.race([
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digitado: textoInput }),
      }),
      timeoutPromise(10000), // 10 segundos de limite
    ]);

    if (!resposta.ok) {
      throw new Error("❌ Erro na resposta do servidor");
    }

    let resultado = await resposta.json();
    let info = JSON.parse(resultado.resposta);

    // Coloca os resultados na tela
    codigo.innerHTML = info.code; // mostra ao usuário
    areaResultado.innerHTML = info.preview; // mostra o preview
    // Cria uma nova <style> e injeta o CSS completo retornado
    
    

    // Adiciona o CSS retornado
    document.head.insertAdjacentHTML(
      "beforeend",
      "<style>" + info.style + "</style>"
    );

    // Atualiza a interface
    botao.textContent = "Criar Mágica ✨";
    botao.style.background = "#5d1f2e";
  } catch (error) {
    console.error("Erro:", error);

    areaResultado.innerHTML = `<p style="color: red;">${error.message}</p>`;
    botao.textContent = "Tentar Novamente";
    botao.style.background = "#E35959";
  } finally {
    loader.style.display = "none";
    botao.disabled = false;
  }
}

// Ativa/desativa o botão com base no input
let input = document.querySelector(".input-animacao");
let botao = document.querySelector(".botao-magica");

function checarInput() {
  if (input.value.trim() === "") {
    botao.disabled = true;
    botao.style.background = "rgb(93 31 46 / 47%)";
  } else {
    botao.disabled = false;
    botao.style.background = "#5d1f2e";
  }
}

input.addEventListener("input", checarInput);
document
  .querySelector(".botao-magica")
  .addEventListener("mouseover", function () {
    if (input.value.trim() === "") {
      alert("Por favo! escolha sua animação");
    }
  });

checarInput(); // roda ao carregar
