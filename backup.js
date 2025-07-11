// URL do webhook que responde com o CSS e preview da animação gerada pela IA
let webhook = "https://n8n.chagassilva.com/webhook/animation-css";

// Função auxiliar que cria uma Promise que rejeita após X milissegundos
// Isso serve para limitar o tempo de espera da resposta do servidor (timeout)
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

// Função principal disparada ao clicar no botão "Criar Mágica"
async function cliqueiNoBotao() {
  // Seleciona elementos do DOM para manipular interface
  let textoInput = document.querySelector(".input-animacao").value; // texto digitado pelo usuário
  let codigo = document.querySelector(".area-codigo"); // área que mostrará o código CSS gerado
  let areaResultado = document.querySelector(".area-resultado"); // área que mostrará a prévia da animação
  let loader = document.querySelector(".loader"); // indicador de carregamento
  let botao = document.querySelector(".botao-magica"); // botão que dispara a criação

  // Prepara a interface para o processo: desabilita botão, muda texto e mostra loader
  botao.disabled = true;
  botao.textContent = "Criando...";
  botao.style.background = "#888888";
  loader.style.display = "block";
  areaResultado.innerHTML = ""; // limpa resultado anterior

  try {
    // Faz a requisição POST para o webhook enviando o texto do usuário,
    // usando Promise.race para aplicar timeout de 10 segundos
    let resposta = await Promise.race([
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digitado: textoInput }),
      }),
      timeoutPromise(10000), // timeout de 10 segundos
    ]);

    // Verifica se a resposta HTTP foi OK (status 200-299)
    if (!resposta.ok) {
      throw new Error("❌ Erro na resposta do servidor");
    }

    // Pega o JSON da resposta
    let resultado = await resposta.json();

    // Parseia o campo 'resposta' que vem como string JSON para objeto JS
    let info = JSON.parse(resultado.resposta);

    // Atualiza o HTML da área de código com o CSS gerado pela IA
    codigo.innerHTML = info.code;

    // Atualiza a área de resultado com o preview da animação (HTML gerado)
    areaResultado.innerHTML = info.preview;

    // Para debug: mostra no console a resposta bruta do webhook
    console.log(resultado.resposta);

    // Insere o CSS retornado dentro da tag <head> para aplicar no site
    document.head.insertAdjacentHTML(
      "beforeend",
      "<style>" + info.style + "</style>"
    );

    // --- Aqui começa a parte da decoração animada no body ---

    // Cria um container div para conter as animações decorativas no body
    let decoracaoContainer = document.createElement("div");
    decoracaoContainer.className = "decoracao-body";

    // Cria 50 cópias da animação para espalhar pela tela
    for (let i = 0; i < 50; i++) {
      let clone = document.createElement("div");
      clone.className = "item";

      // Insere o HTML da animação gerada (exemplo: <div class="bola"></div>)
      clone.innerHTML = info.preview;

      // Posiciona cada cópia em local aleatório na tela (top e left %)
      clone.style.top = Math.random() * 100 + "%";
      clone.style.left = Math.random() * 100 + "%";

      // Aplica escala aleatória para variar o tamanho (entre 0.5 e 1)
      clone.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;

      // Adiciona o clone dentro do container de decoração
      decoracaoContainer.appendChild(clone);
    }

    // Finalmente adiciona o container com as animações decorativas dentro do body
    document.body.appendChild(decoracaoContainer);

    // --- Fim da decoração ---

    // Atualiza a interface: habilita botão, texto e cor padrão
    botao.textContent = "Criar Mágica ✨";
    botao.style.background = "#5d1f2e";

  } catch (error) {
    // Em caso de erro, mostra no console e na tela para o usuário
    console.error("Erro:", error);

    areaResultado.innerHTML = `<p style="color: red;">${error.message}</p>`;
    botao.textContent = "Tentar Novamente";
    botao.style.background = "#E35959";

  } finally {
    // Sempre esconde o loader e habilita o botão no final
    loader.style.display = "none";
    botao.disabled = false;
  }
}

// Seleciona input e botão para controlar estado do botão com base no input
let input = document.querySelector(".input-animacao");
let botao = document.querySelector(".botao-magica");

// Função que ativa/desativa o botão conforme o input está vazio ou não
function checarInput() {
  if (input.value.trim() === "") {
    botao.disabled = true; // desativa botão se vazio
    botao.style.background = "rgb(93 31 46 / 47%)"; // cor desativada
  } else {
    botao.disabled = false; // ativa botão se tiver texto
    botao.style.background = "#5d1f2e"; // cor padrão
  }
}

// Adiciona listener para atualizar botão ao digitar no input
input.addEventListener("input", checarInput);

// Adiciona listener para alertar o usuário se passar mouse no botão sem texto
document
  .querySelector(".botao-magica")
  .addEventListener("mouseover", function () {
    if (input.value.trim() === "") {
      alert("Por favor! escolha sua animação");
    }
  });

// Roda a checagem ao carregar a página para definir estado inicial do botão
checarInput();
