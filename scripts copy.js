/* 
VÁRIAVEIS - Um pedacinho de memória do computador
que eu posso guardar o que eu quiser.

FUNCOES
É um pedacinho de código QUE, só executa 
Quando é chamado.

documet = HTML
querySelector = buscar alguém no HTML

fetch - ferramenta para se comunicar com algo fora do codigo

[x] Descobrir quando o botão foi clicado
[x] Pegar o que foi escrito no Input
[x] Enviar para o N8N
[x] Receber o que o N8N Respondeu
[x] Colocar na Tela o que ele respondeu    

*/
let webhook =
  "https://n8n.chagassilva.com/webhook-test/c038cf57-e2c5-4fe6-b8ba-7427083f6ef7";
//let webhook = "https://n8n.rodolfomori.com.br/webhook/gerador-animacoes";

// funcao assincrona
async function cliqueiNoBotao() {
  let textoInput = document.querySelector(".input-animacao").value;
  let codigo = document.querySelector(".area-codigo");
  let areaResultado = document.querySelector(".area-resultado");
  let loader = document.querySelector(".loader");
  let botao = document.querySelector(".botao-magica");

  
  botao.disabled = false;
  botao.textContent = "Criando...";
  botao.style.background = "#888888";

  // Mostrar o loader
  loader.style.display = "block";
  areaResultado.innerHTML = ""; // limpa resultado anterior

  

  // fetch - 1) O endereco 2) configuracoes 3) os dados
  // JSON - O formato de dados que usamos na internet
  try {
    let resposta = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digitado: textoInput }),
    });


    if (!resposta.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    console.log(resposta);

    let resultado = await resposta.json();

    let info = JSON.parse(resultado.resposta);

    codigo.innerHTML = info.code;

    areaResultado.innerHTML = info.preview;

    document.head.insertAdjacentHTML(
      "beforeend",
      "<style>" + info.style + "</style>"
    );
  

  //botao.disabled = false;
  botao.textContent = "Criar Mágica ✨";
  botao.style.background = "#37E359";
  loader.style.display = "none";

  } catch (error) {
    console.error("Erro na resposta do servidor", error)
  }

}

let input = document.querySelector(".input-animacao");
let botao = document.querySelector(".botao-magica");

// Função que checa se o input está vazio e desabilita/habilita o botão
function checarInput() {
  if (input.value.trim() === "") {
    botao.disabled = true;
    botao.style.background = "#888888"; // cor desabilitado
  } else {
    botao.disabled = false;
    botao.style.background = "#37E359"; // cor habilitado
  }
}

// Chama a função quando o usuário digita algo
input.addEventListener("input", checarInput);
//input.addEventListener("clear", checarInput);

// Executa uma vez ao carregar a página
checarInput();

function timeoutPromise(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido. O servidor demorou para responder.")), ms)
  );
}
