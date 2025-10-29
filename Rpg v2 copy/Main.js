const jogador = {
  nome: prompt("Digite o nome do seu personagem:"),
  nivel: 1,
  experiencia: 0,
  atributos: {
    vitalidade: 10,
    forca: 1,
    agilidade: 1,
    inteligencia: 1,
  },
};
const dificuldade = 2; // Medium Level 



// Elementos de status
const statusVitalidade = document.getElementById("vitalidade");
const statusNivel = document.getElementById("nivel");
const statusXP = document.getElementById("experiencia");
const statusForca = document.getElementById("forca");
const statusAgilidade = document.getElementById("agilidade");
const statusInteligencia = document.getElementById("inteligencia");
const Nome = document.getElementById("Nome");


function atualizarStatus() {
  Nome.textContent = `Nome: ${jogador.nome}`;
  statusVitalidade.textContent = `Vitalidade: ${jogador.atributos.vitalidade}`;
  statusNivel.textContent = `Nível: ${jogador.nivel}`;
  statusXP.textContent = `XP: ${jogador.experiencia}`;
  statusForca.textContent = `Força: ${jogador.atributos.forca}`;
  statusAgilidade.textContent = `Agilidade: ${jogador.atributos.agilidade}`;
  statusInteligencia.textContent = `Inteligência: ${jogador.atributos.inteligencia}`;

  
  // Atualiza barra de HP
  const hpBar = document.getElementById("hpBar");
  hpBar.textContent = `${jogador.atributos.vitalidade} / ${jogador.atributos.vitalidade}`;
  hpBar.style.width = "100%"; // barra sempre cheia, verde
}

const expBtn = document.getElementById("exp"); // botão para ganhar xp
const levelUpDiv = document.getElementById("levelUp");

expBtn.addEventListener("click", function () {
  jogador.experiencia += 10;
  alert(`Você ganhou 10 pontos! Total: ${jogador.experiencia}`);
  switch (true) {
    case jogador.experiencia >= (jogador.nivel * 50) * dificuldade:
        jogador.experiencia -= (jogador.nivel * 50) * dificuldade;
        jogador.nivel += 1;
        alert(`Parabéns! Você atingiu o nível ${jogador.nivel}!`);
        levelUpDiv.style.display = "block";
        atualizarStatus();
        break;
  }
  atualizarStatus();
  console.log(jogador.experiencia); // Debug funcionando corretamente

  // Verificando com switch

});

document.querySelectorAll(".atributo").forEach((btn) => {
  btn.addEventListener("click", function () {
    const attr = btn.getAttribute("data-attr");
    jogador.atributos[attr] += 1;
    jogador.atributos.vitalidade += 9; // Aumenta vitalidade a cada ponto de atributo
    alert(`Seu atributo ${attr} agora é ${jogador.atributos[attr]}`);
    levelUpDiv.style.display = "none"; //esconde a aba de evolução
    console.log(jogador.atributos); //Debug
  });
});

// ============= ATENÇÃO O SISTEMA ABAIXO FOI 100% I.A MAS COM CONCEITO FEITO POR MIM ========================

/* === Save/Load UI via localStorage (sem arquivos) ===
   Cole no final do Main.js ou rode no Console da página.
*/

(function addLocalSaveUI(){
  const KEY = 'meu_save_jogador'; // chave usada no localStorage
  if (document.getElementById('__local_save_ui__')) return; // evita duplicar

  // cria UI simples
  const wrapper = document.createElement('div');
  wrapper.id = '__local_save_ui__';
  wrapper.style.margin = '12px 0';
  wrapper.style.display = 'flex';
  wrapper.style.gap = '8px';
  wrapper.style.alignItems = 'center';

  const btnSave = document.createElement('button'); btnSave.textContent = '💾 Salvar';
  const btnLoad = document.createElement('button'); btnLoad.textContent = '📂 Carregar';
  const btnDel  = document.createElement('button'); btnDel.textContent = '🗑️ Apagar save';
  const autoLabel = document.createElement('label');
  const autoCheckbox = document.createElement('input'); autoCheckbox.type = 'checkbox';
  autoCheckbox.id = '__autosave_toggle__';
  autoLabel.appendChild(autoCheckbox);
  autoLabel.append('Auto-save');

  wrapper.appendChild(btnSave);
  wrapper.appendChild(btnLoad);
  wrapper.appendChild(btnDel);
  wrapper.appendChild(autoLabel);

  // insere no topo da página (ou muda para onde preferir)
  document.body.insertBefore(wrapper, document.body.firstChild);

  // helpers: tenta obter estado do jogo (prioriza window.jogador)
  function readStateFromRuntime() {
    // 1) se existe window.jogador (ideal)
    if (window.jogador && typeof window.jogador === 'object') {
      // clona leve para evitar referências estranhas
      return JSON.parse(JSON.stringify(window.jogador));
    }
    // 2) tenta ler do DOM (IDs usados: Nome, nivel, experiencia, forca, agilidade, inteligencia)
    try {
      const nameEl = document.getElementById('Nome');
      const nivelEl = document.getElementById('nivel');
      const xpEl = document.getElementById('experiencia');
      const forcaEl = document.getElementById('forca');
      const agiEl = document.getElementById('agilidade');
      const intEl = document.getElementById('inteligencia');

      const candidate = {
        nome: nameEl ? nameEl.textContent.replace(/^Nome:\s*/, '') : 'Jogador',
        nivel: nivelEl ? Number((nivelEl.textContent.match(/\d+/)||[1])[0]) : 1,
        experiencia: xpEl ? Number((xpEl.textContent.match(/\d+/)||[0])[0]) : 0,
        atributos: {
          forca: forcaEl ? Number((forcaEl.textContent.match(/\d+/)||[1])[0]) : 1,
          agilidade: agiEl ? Number((agiEl.textContent.match(/\d+/)||[1])[0]) : 1,
          inteligencia: intEl ? Number((intEl.textContent.match(/\d+/)||[1])[0]) : 1
        }
      };
      return candidate;
    } catch (e) {
      console.warn('readStateFromRuntime fallback falhou', e);
      return null;
    }
  }

  // aplica o estado no runtime: tenta Object.assign(window.jogador, data)
  function applyStateToRuntime(data) {
    if (!data) return false;
    // Validação mínima
    if (typeof data.nivel !== 'number' || typeof data.experiencia !== 'number' || !data.atributos) {
      console.warn('Formato de save inválido', data);
      return false;
    }

    // 1) Se existe window.jogador e é objeto, atualiza suas propriedades sem reatribuir a variável
    if (window.jogador && typeof window.jogador === 'object') {
      try {
        // mescla recursivamente atributos
        Object.assign(window.jogador, data);
        window.jogador.atributos = Object.assign({}, window.jogador.atributos || {}, data.atributos || {});
        if (typeof atualizarStatus === 'function') atualizarStatus();
        else console.log('Save aplicado, mas função atualizarStatus() não encontrada; verifique UI.');
        return true;
      } catch (e) {
        console.warn('Erro ao aplicar data em window.jogador', e);
      }
    }

    // 2) se não existe window.jogador, define e tenta atualizar UI
    try {
      window.jogador = data;
      if (typeof atualizarStatus === 'function') atualizarStatus();
      return true;
    } catch (e) {
      console.warn('Não foi possível definir window.jogador', e);
    }

    // 3) fallback: atualiza DOM manualmente (IDs do teu HTML)
    try {
      const nameEl = document.getElementById('Nome');
      const nivelEl = document.getElementById('nivel');
      const xpEl = document.getElementById('experiencia');
      const forcaEl = document.getElementById('forca');
      const agiEl = document.getElementById('agilidade');
      const intEl = document.getElementById('inteligencia');
      if (nameEl) nameEl.textContent = `Nome: ${data.nome || 'Jogador'}`;
      if (nivelEl) nivelEl.textContent = `Nível: ${data.nivel}`;
      if (xpEl) xpEl.textContent = `XP: ${data.experiencia}`;
      if (forcaEl) forcaEl.textContent = `Força: ${data.atributos.forca}`;
      if (agiEl) agiEl.textContent = `Agilidade: ${data.atributos.agilidade}`;
      if (intEl) intEl.textContent = `Inteligência: ${data.atributos.inteligencia}`;
      return true;
    } catch (e) {
      console.warn('Fallback DOM apply falhou', e);
    }
    return false;
  }

  // valida que o objeto tem o formato mínimo
  function isValidSave(obj) {
    return obj && typeof obj === 'object'
      && typeof obj.nivel === 'number'
      && typeof obj.experiencia === 'number'
      && obj.atributos && typeof obj.atributos === 'object';
  }

  // ação: salvar
  btnSave.addEventListener('click', () => {
    const state = readStateFromRuntime();
    if (!state) return alert('Não foi possível obter o estado atual para salvar.');
    const payload = { v: 1, data: state, savedAt: Date.now() };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
      alert('Progresso salvo no navegador ✅');
      console.log('Save gravado em localStorage:', payload);
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
      alert('Erro ao salvar (ver console).');
    }
  });

  // ação: carregar
  btnLoad.addEventListener('click', () => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return alert('Nenhum save encontrado no localStorage.');
    let parsed;
    try { parsed = JSON.parse(raw); } 
    catch (e) { console.error(e); return alert('Save corrompido (JSON inválido).'); }

    // backup do estado atual
    try {
      const backupKey = KEY + '_backup_' + Date.now();
      const current = readStateFromRuntime();
      if (current) localStorage.setItem(backupKey, JSON.stringify({v:1,data:current}));
    } catch (e) { console.warn('Não foi possível criar backup', e); }

    // aceita formatos com wrapper {v,data} ou raw data
    const candidate = (parsed && parsed.data) ? parsed.data : parsed;

    if (!isValidSave(candidate)) {
      console.warn('Save inválido:', candidate);
      return alert('Save inválido (formato inesperado). Veja console.');
    }

    const ok = applyStateToRuntime(candidate);
    if (ok) {
      alert('Save carregado com sucesso! 🎉');
      console.log('Save aplicado:', candidate);
    } else {
      alert('Save carregado mas não foi possível aplicar ao runtime (veja console).');
    }
  });

  // ação: apagar
  btnDel.addEventListener('click', () => {
    if (!confirm('Deseja apagar o save salvo no navegador?')) return;
    localStorage.removeItem(KEY);
    alert('Save apagado.');
  });

  // auto-save: salva quando o botão de treinar (#exp) for clicado
  let expBtn = document.getElementById('exp');
  if (!expBtn) {
    // tenta encontrar botão por texto
    expBtn = Array.from(document.querySelectorAll('button')).find(b => /treinar/i.test(b.textContent));
  }
  if (expBtn) {
    autoCheckbox.addEventListener('change', () => {
      if (autoCheckbox.checked) {
        // listener que salva após cada clique
        expBtn.addEventListener('click', autoSaveHandler);
        alert('Auto-save ativado: o jogo será salvo após cada treino.');
      } else {
        expBtn.removeEventListener('click', autoSaveHandler);
        alert('Auto-save desativado.');
      }
    });
  } else {
    autoCheckbox.disabled = true;
    autoLabel.title = 'Botão "Treinar" não encontrado — auto-save indisponível';
  }

  function autoSaveHandler() {
    // espera 120ms para ações do jogo atualizarem estado (se necessário)
    setTimeout(() => {
      const state = readStateFromRuntime();
      if (!state) return;
      try {
        localStorage.setItem(KEY, JSON.stringify({v:1,data:state,savedAt:Date.now()}));
        console.log('Auto-save gravado.');
      } catch (e) {
        console.warn('Auto-save falhou', e);
      }
    }, 120);
  }

  console.log('UI de Save/Load criada — use os botões no topo da página.');
})();