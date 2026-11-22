(function () {
  'use strict';

  // Determina automaticamente o endpoint da API:
  // - Se window.API_BASE estiver configurado, usa ele;
  // - Se estiver acessando direto na porta 8000 (servidor unificado Flask), usa a mesma origem;
  // - Se estiver em localhost/127.0.0.1 (ex: porta 3000 do live-server), conecta em :8000;
  // - Em produção sob proxy reverso (Nginx), usa caminho relativo '' (ex: /api).
  const API_BASE = window.API_BASE || (
    window.location.port === '8000'
      ? window.location.origin
      : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? `${window.location.protocol}//${window.location.hostname}:8000`
          : '')
  );

  let tabelaCorpo = null;
  let formResgate = null;
  let inputIdEdicao = null;
  let btnSubmit = null;
  let btnCancelarEdicao = null;
  let listaRegistrosCache = [];

  async function verificarStatusServidor() {
    const elStatus = document.getElementById('status-servidor-info');
    if (!elStatus) return;

    try {
      const resp = await fetch(`${API_BASE}/api`, { method: 'GET' });
      if (resp.ok) {
        elStatus.innerHTML = `
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#28a745; margin-right:6px;"></span>
          <strong style="color:#005645;">Online</strong>
        `;
        elStatus.style.background = '#e8f5e9';
        elStatus.style.borderColor = '#c8e6c9';
      } else {
        throw new Error('Servidor retornou status ' + resp.status);
      }
    } catch (err) {
      elStatus.innerHTML = `
        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#dc3545; margin-right:6px;"></span>
        <strong style="color:#c62828;">Offline</strong>
      `;
      elStatus.style.background = '#ffebee';
      elStatus.style.borderColor = '#ffcdd2';
    }
  }

  async function carregarAnimais() {
    tabelaCorpo = document.getElementById('tabela-animais-corpo') || document.querySelector('.tabela-controle-animais tbody');
    if (!tabelaCorpo) return;

    try {
      let response = await fetch(`${API_BASE}/animais`, { credentials: 'omit' });
      if (!response.ok) {
        response = await fetch(`${API_BASE}/resgates`, { credentials: 'omit' });
      }

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const dados = await response.json();
      listaRegistrosCache = Array.isArray(dados) ? dados : [];
      renderizarTabela(listaRegistrosCache);
      atualizarContadoresHero(listaRegistrosCache);
    } catch (erro) {
      console.warn('Aviso de conexao:', erro);
      tabelaCorpo.innerHTML = `
        <tr class="linha-vazia">
          <td colspan="9" style="text-align: center; padding: 30px 15px; color: #c62828; background: #fff8f8;">
            <p style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">
              Não foi possível conectar ao servidor.
            </p>
            <p style="color: #555; font-size: 13px; margin-bottom: 12px;">
              Certifique-se de executar no terminal ou rodar o arquivo <code>iniciar_sistema.bat</code>:
            </p>
            <code style="background: #eee; padding: 6px 12px; border-radius: 4px; font-weight: 600;">python backend/server.py</code>
            <div style="margin-top: 15px;">
              <button type="button" onclick="window.PatasRegistro.carregar()" style="padding: 6px 14px; background:#005645; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">
                Recarregar Dados
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  function renderizarTabela(registros) {
    if (!tabelaCorpo) return;

    if (!registros || registros.length === 0) {
      tabelaCorpo.innerHTML = `
        <tr class="linha-vazia">
          <td colspan="9" style="text-align: center; padding: 30px; color: #6f7975;">
            Nenhum animal cadastrado no banco de dados SQLite.
          </td>
        </tr>
      `;
      return;
    }

    let linhasHtml = '';

    registros.forEach((item) => {
      const cod = item.cod_animal || item.id;
      const idFormatado = `#ANM-${String(cod).padStart(3, '0')}`;
      const nome = item.nome_provisorio_animal || item.nome_provisorio || 'Sem nome';
      const especie = (item.especie_animal || item.especie || '').toLowerCase();
      const especieFormatada = especie === 'felino' ? 'Felino (Gato)' : (especie === 'canino' ? 'Canino (Cão)' : 'Outra');
      const sexo = (item.sexo_animal || item.sexo || '').toLowerCase();
      const sexoFormatado = sexo === 'macho' ? 'Macho' : (sexo === 'femea' ? 'Fêmea' : 'Indeterminado');
      const idade = item.idade_animal || item.idade_estimada || 'Não informada';
      const idadeFormatada = idade.charAt(0).toUpperCase() + idade.slice(1);
      const porte = item.peso_animal || item.porte_peso || 'Não informado';
      const pelagem = item.cor_pelagem_animal || item.pelagem || 'Não informada';
      const microchip = item.microchip_animal || item.microchip || '';

      const chipBadge = microchip
        ? `<span style="font-family: monospace; font-size: 11px; background: #e0f2ed; color: #005645; padding: 3px 6px; border-radius: 4px; font-weight: 600;">${microchip}</span>`
        : `<span style="color: #999; font-size: 12px;">Não possui</span>`;

      linhasHtml += `
        <tr data-id="${cod}">
          <th scope="row" style="white-space: nowrap; font-family: monospace; font-size: 13px; color: #005645;">
            ${idFormatado}
          </th>
          <td>
            <strong>${nome}</strong>
          </td>
          <td>${especieFormatada}</td>
          <td>${sexoFormatado}</td>
          <td>${idadeFormatada}</td>
          <td>${porte}</td>
          <td>${pelagem}</td>
          <td>${chipBadge}</td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <button type="button"
                      class="btn-acao-editar"
                      onclick="window.PatasRegistro.editar(${cod})"
                      title="Editar"
                      style="background:#0288d1; color:#fff; border:none; padding:4px 9px; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer;">
                Editar
              </button>
              <button type="button"
                      class="btn-acao-excluir"
                      onclick="window.PatasRegistro.excluir(${cod}, '${nome.replace(/'/g, "\\'")}')"
                      title="Excluir"
                      style="background:#d32f2f; color:#fff; border:none; padding:4px 9px; border-radius:5px; font-size:12px; font-weight:600; cursor:pointer;">
                Excluir
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tabelaCorpo.innerHTML = linhasHtml;
  }

  function atualizarContadoresHero(registros) {
    const totalEl = document.getElementById('contador-total-animais');
    const caninosEl = document.getElementById('contador-caninos');
    const felinosEl = document.getElementById('contador-felinos');
    const chipsEl = document.getElementById('contador-microchipados');

    const total = registros.length;
    let caninos = 0;
    let felinos = 0;
    let chips = 0;

    registros.forEach(r => {
      const esp = (r.especie_animal || r.especie || '').toLowerCase();
      if (esp.includes('canin')) caninos++;
      else if (esp.includes('felin')) felinos++;

      const ch = r.microchip_animal || r.microchip;
      if (ch && String(ch).trim() !== '') chips++;
    });

    if (totalEl) totalEl.textContent = total;
    if (caninosEl) caninosEl.textContent = caninos;
    if (felinosEl) felinosEl.textContent = felinos;
    if (chipsEl) chipsEl.textContent = chips;
  }

  async function salvarFormulario(e) {
    e.preventDefault();

    const idEdicao = inputIdEdicao ? inputIdEdicao.value.trim() : '';

    const nomeProvisorio = document.getElementById('resgate-nome-provisorio')?.value.trim();
    const especie = document.getElementById('resgate-especie')?.value;
    const sexo = document.getElementById('resgate-sexo')?.value;
    const idadeEstimada = document.getElementById('resgate-idade-estimada')?.value;
    const portePeso = document.getElementById('resgate-porte')?.value.trim();
    const pelagem = document.getElementById('resgate-pelagem')?.value.trim();
    const microchip = document.getElementById('resgate-microchip')?.value.trim();

    if (!nomeProvisorio || !especie || !portePeso || !pelagem) {
      alert('Por favor, preencha todos os campos obrigatórios da Identificação Básica.');
      return;
    }

    const payload = {
      nome_provisorio: nomeProvisorio,
      especie: especie,
      sexo: sexo,
      idade_estimada: idadeEstimada,
      porte_peso: portePeso,
      pelagem: pelagem,
      microchip: microchip
    };

    try {
      let url = `${API_BASE}/animais`;
      let metodo = 'POST';

      if (idEdicao) {
        url = `${API_BASE}/animais/${idEdicao}`;
        metodo = 'PUT';
      }

      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const erroJson = await response.json();
        throw new Error(erroJson.erro || 'Falha ao salvar no banco de dados');
      }

      if (idEdicao) {
        mostrarNotificacao(`Animal #${idEdicao} atualizado com sucesso!`, 'sucesso');
        cancelarEdicao();
      } else {
        mostrarNotificacao(`Animal ${nomeProvisorio} cadastrado com sucesso no banco SQLite!`, 'sucesso');
        formResgate.reset();
      }

      await carregarAnimais();

    } catch (err) {
      console.error(err);
      mostrarNotificacao(`Erro ao salvar: ${err.message}`, 'erro');
    }
  }

  async function excluirAnimal(id, nome) {
    const confirmar = confirm(`Deseja realmente excluir o cadastro de "${nome}" (#${id}) do banco SQLite?`);
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_BASE}/animais/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const erroJson = await response.json();
        throw new Error(erroJson.erro || 'Erro ao excluir do banco de dados');
      }

      mostrarNotificacao(`Animal ${nome} (#${id}) removido do banco com sucesso!`, 'sucesso');
      await carregarAnimais();
    } catch (err) {
      console.error(err);
      mostrarNotificacao(`Erro ao excluir: ${err.message}`, 'erro');
    }
  }

  async function editarAnimal(id) {
    try {
      const response = await fetch(`${API_BASE}/animais/${id}`);
      if (!response.ok) throw new Error('Não foi possível carregar os dados do animal.');

      const item = await response.json();
      const cod = item.cod_animal || item.id;

      if (inputIdEdicao) inputIdEdicao.value = cod;
      document.getElementById('resgate-nome-provisorio').value = item.nome_provisorio_animal || item.nome_provisorio || '';
      document.getElementById('resgate-especie').value = item.especie_animal || item.especie || 'canino';
      document.getElementById('resgate-sexo').value = item.sexo_animal || item.sexo || 'macho';
      document.getElementById('resgate-idade-estimada').value = item.idade_animal || item.idade_estimada || 'adulto';
      document.getElementById('resgate-porte').value = item.peso_animal || item.porte_peso || '';
      document.getElementById('resgate-pelagem').value = item.cor_pelagem_animal || item.pelagem || '';
      document.getElementById('resgate-microchip').value = item.microchip_animal || item.microchip || '';

      if (btnSubmit) {
        btnSubmit.textContent = `Salvar Alterações (#${cod})`;
        btnSubmit.style.background = '#0288d1';
      }
      if (btnCancelarEdicao) {
        btnCancelarEdicao.style.display = 'inline-block';
      }

      const tituloForm = document.getElementById('titulo-formulario');
      if (tituloForm) {
        tituloForm.textContent = `Editando Registro #${cod} (${item.nome_provisorio_animal || item.nome_provisorio})`;
      }

      formResgate.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('resgate-nome-provisorio').focus();

    } catch (err) {
      mostrarNotificacao(`Erro: ${err.message}`, 'erro');
    }
  }

  function cancelarEdicao() {
    if (inputIdEdicao) inputIdEdicao.value = '';
    if (formResgate) formResgate.reset();

    if (btnSubmit) {
      btnSubmit.textContent = 'Cadastrar Animal no Banco';
      btnSubmit.style.background = '';
    }
    if (btnCancelarEdicao) {
      btnCancelarEdicao.style.display = 'none';
    }
    const tituloForm = document.getElementById('titulo-formulario');
    if (tituloForm) {
      tituloForm.textContent = 'Formulário de Cadastro: Identificação Básica do Animal Resgatado';
    }
  }

  function initFiltrosTabela() {
    const inputBusca = document.getElementById('busca-rapida-tabela');
    const selectEspecie = document.getElementById('filtro-especie-registro');
    const selectSexo = document.getElementById('filtro-sexo-registro');
    const btnFiltrar = document.getElementById('btn-aplicar-filtros');

    function aplicarFiltros() {
      const especieVal = selectEspecie ? selectEspecie.value.toLowerCase() : '';
      const sexoVal = selectSexo ? selectSexo.value.toLowerCase() : '';
      const termoBusca = inputBusca ? inputBusca.value.trim().toLowerCase() : '';

      const filtrados = listaRegistrosCache.filter(item => {
        const nome = (item.nome_provisorio_animal || item.nome_provisorio || '').toLowerCase();
        const pelagem = (item.cor_pelagem_animal || item.pelagem || '').toLowerCase();
        const chip = (item.microchip_animal || item.microchip || '').toLowerCase();
        const peso = (item.peso_animal || item.porte_peso || '').toLowerCase();
        const esp = (item.especie_animal || item.especie || '').toLowerCase();
        const sx = (item.sexo_animal || item.sexo || '').toLowerCase();

        if (termoBusca) {
          const matchBusca = nome.includes(termoBusca) || pelagem.includes(termoBusca) || chip.includes(termoBusca) || peso.includes(termoBusca);
          if (!matchBusca) return false;
        }

        if (especieVal && !esp.includes(especieVal)) return false;
        if (sexoVal && !sx.includes(sexoVal)) return false;

        return true;
      });

      renderizarTabela(filtrados);
    }

    if (inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
    if (selectEspecie) selectEspecie.addEventListener('change', aplicarFiltros);
    if (selectSexo) selectSexo.addEventListener('change', aplicarFiltros);
    if (btnFiltrar) btnFiltrar.addEventListener('click', aplicarFiltros);
  }

  function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    let toast = document.getElementById('patas-toast-flutuante');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'patas-toast-flutuante';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        padding: 14px 20px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;
      document.body.appendChild(toast);
    }

    if (tipo === 'sucesso') {
      toast.style.background = '#005645';
      toast.style.color = '#ffffff';
    } else {
      toast.style.background = '#d32f2f';
      toast.style.color = '#ffffff';
    }

    toast.textContent = mensagem;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 4000);
  }

  window.PatasRegistro = {
    carregar: carregarAnimais,
    excluir: excluirAnimal,
    editar: editarAnimal,
    cancelarEdicao: cancelarEdicao
  };

  document.addEventListener('DOMContentLoaded', () => {
    tabelaCorpo = document.getElementById('tabela-animais-corpo') || document.querySelector('.tabela-controle-animais tbody');
    formResgate = document.getElementById('form-resgate') || document.querySelector('.formulario-admissao-resgate form');
    inputIdEdicao = document.getElementById('resgate-id-edicao');
    btnSubmit = document.getElementById('btn-submit-resgate') || (formResgate ? formResgate.querySelector('button[type="submit"]') : null);
    btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

    if (btnCancelarEdicao) {
      btnCancelarEdicao.addEventListener('click', cancelarEdicao);
    }

    if (formResgate) {
      formResgate.addEventListener('submit', salvarFormulario);
    }

    verificarStatusServidor();
    carregarAnimais();
    initFiltrosTabela();
  });
})();
