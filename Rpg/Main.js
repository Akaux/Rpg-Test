const jogador = {
  nome: prompt("Digite o nome do seu personagem:"),
  nivel: 1,
  experiencia: 0,
  atributos: {
    forca: 1,
    agilidade: 1,
    inteligencia: 1,
  },
};
const dificuldade = 2; // Medium Level 

// Elementos de status
const statusNivel = document.getElementById("nivel");
const statusXP = document.getElementById("experiencia");
const statusForca = document.getElementById("forca");
const statusAgilidade = document.getElementById("agilidade");
const statusInteligencia = document.getElementById("inteligencia");
const Nome = document.getElementById("Nome");

// Função para atualizar status
function atualizarStatus() {
  Nome.textContent = `Nome: ${jogador.nome}`;
  statusNivel.textContent = `Nível: ${jogador.nivel}`;
  statusXP.textContent = `XP: ${jogador.experiencia}`;
  statusForca.textContent = `Força: ${jogador.atributos.forca}`;
  statusAgilidade.textContent = `Agilidade: ${jogador.atributos.agilidade}`;
  statusInteligencia.textContent = `Inteligência: ${jogador.atributos.inteligencia}`;
}

const expBtn = document.getElementById("exp"); // botão para ganhar xp
const levelUpDiv = document.getElementById("levelUp");

expBtn.addEventListener("click", function () {
  jogador.experiencia += 10;
  alert(`Você ganhou 10 pontos! Total: ${jogador.experiencia}`);
  atualizarStatus();
  console.log(jogador.experiencia); // Debug funcionando corretamente

  // Verificando com switch
  switch (true) {
    case jogador.experiencia >= (jogador.nivel * 50) * dificuldade:
        jogador.experiencia -= (jogador.nivel * 50) * dificuldade;
        jogador.nivel += 1;
        alert(`Parabéns! Você atingiu o nível ${jogador.nivel}!`);
        levelUpDiv.style.display = "block";
        atualizarStatus();
        break;
  }
});

document.querySelectorAll(".atributo").forEach((btn) => {
  btn.addEventListener("click", function () {
    const attr = btn.getAttribute("data-attr");
    jogador.atributos[attr] += 1;
    alert(`Seu atributo ${attr} agora é ${jogador.atributos[attr]}`);
    levelUpDiv.style.display = "none"; //esconde a aba de evolução
    console.log(jogador.atributos); //Debug
  });
});
