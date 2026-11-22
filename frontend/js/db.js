(function () {
  'use strict';

  const STORAGE_KEY_PETS = 'patasevidas_animais_v3';
  const STORAGE_KEY_ADOCAO = 'patasevidas_solicitacoes_adocao';
  const STORAGE_KEY_FAVORITOS = 'patasevidas_favoritos';

  function resolverCaminhoAsset(caminho) {
    if (!caminho) return '';
    if (caminho.startsWith('http://') || caminho.startsWith('https://') || caminho.startsWith('data:')) {
      return caminho;
    }
    const limpo = caminho.replace(/^\.?\/?(assets\/img\/)?/, 'assets/img/');
    const isSubdir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/portifolios/');
    return isSubdir ? '../' + limpo : limpo;
  }

  const ANIMAIS_PADRAO = [
    {
      id: '#A-2024-089',
      nome: 'Pipoca',
      especie: 'cachorro',
      categoria: 'canino',
      porte: 'pequeno',
      faixaEtaria: 'filhote',
      idadeTexto: '6 meses',
      idadeEstimada: '6 meses (Jovem)',
      sexo: 'macho',
      raca: 'Beagle / Vira-lata (SRD)',
      pelagem: 'Curta • Caramelo e Dourado com manchas brancas',
      foto: resolverCaminhoAsset('pipoca.jpg'),
      fotoDetalhe: resolverCaminhoAsset('pipoca-detalhe.jpg'),
      fotoVacina: resolverCaminhoAsset('pipoca-vacina.jpg'),
      descricao: 'Filhote alegre, dócil, super ativo e curioso. Perfeito para famílias com tempo para brincar e passear.',
      status: 'Apto para Adoção',
      condicaoEspecial: false,
      microchip: '982.000.364.819.124',
      dataResgate: '14/03/2024',
      cidadeOrigem: 'Santana de Parnaíba - SP',
      localResgate: 'Estrada Municipal, Santana de Parnaíba - SP',
      localAcolhimento: 'Abrigo Central - Baia 04',
      castrado: true,
      vacinado: true,
      tags: ['Castrado', 'V10 Completa', '#SuperAtivo', '#Dócil', '#Brincalhão'],
      comportamento: {
        outrosCaes: 'Excelente, sociável e brincalhão',
        gatos: 'Curioso, adaptação monitorada recomendada',
        criancas: 'Extremamente dócil e tolerante',
        energia: 'Alta'
      },
      historicoSaude: 'Resgatado após escoriações leves na pata dianteira em via pública. Reabilitação plena, sorologias negativas e protocolo sanitário completo.',
      vacinas: [
        { nome: 'Polivalente V10 (1ª Dose)', data: '12/04/2024', lote: 'LT-V10-234', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Polivalente V10 (Reforço)', data: '03/05/2024', lote: 'LT-V10-235', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Antirrábica Defensor', data: '01/06/2024', lote: 'LT-AR-2025-14', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Vermífugo Drontal Plus', data: '01/06/2024', lote: 'LT-VF-2024-88', lab: 'Bayer', status: 'Em Dia' }
      ]
    },
    {
      id: '#A-2024-102',
      nome: 'Thor',
      especie: 'cachorro',
      categoria: 'canino',
      porte: 'medio',
      faixaEtaria: 'adulto',
      idadeTexto: '2 anos',
      idadeEstimada: '2 anos',
      sexo: 'macho',
      raca: 'SRD / Pitbull Mix',
      pelagem: 'Curta • Rajado escuro e peito branco',
      foto: resolverCaminhoAsset('thor.jpg'),
      fotoDetalhe: resolverCaminhoAsset('thor.jpg'),
      fotoVacina: resolverCaminhoAsset('thor.jpg'),
      descricao: 'Dócil, brincalhão e sociável com crianças e outros cães. Pronto para um lar carinhoso com quintal.',
      status: 'Apto para Adoção',
      condicaoEspecial: false,
      microchip: '982.000.364.819.205',
      dataResgate: '03/02/2026',
      cidadeOrigem: 'Presidente Prudente - SP',
      localResgate: 'Rodovia Raposo Tavares km 560, Presidente Prudente - SP',
      localAcolhimento: 'Abrigo Central - Baia 02',
      castrado: true,
      vacinado: true,
      tags: ['Castrado', 'V10 Completa', '#EnergiaMédia', '#Dócil', '#Companheiro'],
      comportamento: {
        outrosCaes: 'Sociável e pacífico',
        gatos: 'Requer apresentação calma',
        criancas: 'Muito afetuoso e protetor',
        energia: 'Média'
      },
      historicoSaude: 'Resgatado com fratura distal cicatrizada no Hospital Universitário. 100% reabilitado sem sequelas ortopédicas.',
      vacinas: [
        { nome: 'Polivalente V10', data: '15/02/2026', lote: 'LT-V10-2025-09', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Antirrábica', data: '15/02/2026', lote: 'LT-AR-2025-14', lab: 'Zoetis', status: 'Em Dia' }
      ]
    },
    {
      id: '#A-2024-094',
      nome: 'Luna',
      especie: 'gato',
      categoria: 'felino',
      porte: 'pequeno',
      faixaEtaria: 'adulto',
      idadeTexto: '1 ano',
      idadeEstimada: '1 ano e 2 meses',
      sexo: 'femea',
      raca: 'Siamês Mix',
      pelagem: 'Curta • Pontas castanhas e corpo creme',
      foto: resolverCaminhoAsset('luna.jpg'),
      fotoDetalhe: resolverCaminhoAsset('luna.jpg'),
      fotoVacina: resolverCaminhoAsset('luna.jpg'),
      descricao: 'Extremamente calma, ronronenta e carinhosa, ideal para famílias em apartamento com rede de proteção.',
      status: 'Apto para Adoção',
      condicaoEspecial: false,
      microchip: '982.000.364.819.330',
      dataResgate: '18/01/2026',
      cidadeOrigem: 'Presidente Prudente - SP',
      localResgate: 'Vila Marcondes, Presidente Prudente - SP',
      localAcolhimento: 'Recanto dos Felinos - Box 02',
      castrado: true,
      vacinado: true,
      tags: ['Castrada', 'FIV/FeLV Negativo', '#Apartamento', '#Silenciosa'],
      comportamento: {
        outrosCaes: 'Indiferente / Prefere tranquilidade',
        gatos: 'Muito amigável com outros felinos',
        criancas: 'Carinhosa e paciente',
        energia: 'Baixa/Calma'
      },
      historicoSaude: 'Resgatada de ninho vulnerável. Quarentena rigorosa de 21 dias cumprida, testes virais FeLV/FIV negativos.',
      vacinas: [
        { nome: 'Quádrupla Felina V4', data: '22/01/2026', lote: 'LT-V4-2025-03', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Antirrábica Felina', data: '18/02/2026', lote: 'LT-AR-2025-14', lab: 'Zoetis', status: 'Em Dia' }
      ]
    },
    {
      id: '#A-2024-115',
      nome: 'Mel',
      especie: 'cachorro',
      categoria: 'canino',
      porte: 'medio',
      faixaEtaria: 'adulto',
      idadeTexto: '3 anos',
      idadeEstimada: '3 anos',
      sexo: 'femea',
      raca: 'Labrador / Golden Retriever Mix',
      pelagem: 'Média • Dourada clara',
      foto: resolverCaminhoAsset('mel.jpg'),
      fotoDetalhe: resolverCaminhoAsset('mel.jpg'),
      fotoVacina: resolverCaminhoAsset('mel.jpg'),
      descricao: 'Resgatada em situação de enchente. Totalmente recuperada, super companheira e amorosa com todos.',
      status: 'Apto para Adoção',
      condicaoEspecial: false,
      microchip: '982.000.364.819.412',
      dataResgate: '20/02/2026',
      cidadeOrigem: 'Presidente Prudente - SP',
      localResgate: 'Bairro Brasil Novo, Presidente Prudente - SP',
      localAcolhimento: 'Lar Temporário Planalto',
      castrado: true,
      vacinado: true,
      tags: ['Castrada', 'Vacinada', '#Companheira', '#AmorPuro', '#DócilComCrianças'],
      comportamento: {
        outrosCaes: 'Adora brincar e correr',
        gatos: 'Convive em harmonia',
        criancas: 'Excelente babá, afeto infinito',
        energia: 'Média'
      },
      historicoSaude: 'Passou por tratamento dermatológico e suporte nutricional intensivo após enchente. Pelagem sedosa e saúde impecável.',
      vacinas: [
        { nome: 'Polivalente V10', data: '05/03/2026', lote: 'LT-V10-2025-09', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Antirrábica', data: '05/03/2026', lote: 'LT-AR-2025-14', lab: 'Zoetis', status: 'Em Dia' }
      ]
    },
    {
      id: '#A-2024-077',
      nome: 'Barão',
      especie: 'cachorro',
      categoria: 'canino',
      porte: 'grande',
      faixaEtaria: 'idoso',
      idadeTexto: '5 anos',
      idadeEstimada: '5 anos (Adulto maduro)',
      sexo: 'macho',
      raca: 'Pastor Alemão Mix',
      pelagem: 'Densa • Capa preta e dourado',
      foto: resolverCaminhoAsset('barao.jpg'),
      fotoDetalhe: resolverCaminhoAsset('barao.jpg'),
      fotoVacina: resolverCaminhoAsset('barao.jpg'),
      descricao: 'Abandonado em rodovia com fratura curada. Companheiro leal, tranquilo, obediente e protetor.',
      status: 'Apto para Adoção',
      condicaoEspecial: false,
      microchip: '982.000.364.819.554',
      dataResgate: '10/12/2025',
      cidadeOrigem: 'Presidente Prudente - SP',
      localResgate: 'Rodovia Júlio Budiski km 12, Presidente Prudente - SP',
      localAcolhimento: 'Abrigo Central - Ala Cães Idosos',
      castrado: true,
      vacinado: true,
      tags: ['Castrado', 'V10 Completa', '#Leal', '#Protetor', '#Tranquilo'],
      comportamento: {
        outrosCaes: 'Sereno, convive bem com fêmeas',
        gatos: 'Indiferente',
        criancas: 'Carinhoso e paciente',
        energia: 'Baixa/Moderada'
      },
      historicoSaude: 'Ortopedia restabelecida, exames cardíacos e renais normais. Ótimo perfil para casa com quintal.',
      vacinas: [
        { nome: 'Polivalente V10', data: '12/01/2026', lote: 'LT-V10-2025-09', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Antirrábica', data: '12/01/2026', lote: 'LT-AR-2025-14', lab: 'Zoetis', status: 'Em Dia' }
      ]
    },
    {
      id: '#A-2024-119',
      nome: 'Chica',
      especie: 'gato',
      categoria: 'felino',
      porte: 'pequeno',
      faixaEtaria: 'filhote',
      idadeTexto: '8 meses',
      idadeEstimada: '8 meses',
      sexo: 'femea',
      raca: 'Frajola (Preto e Branco)',
      pelagem: 'Curta • Bicolor preto e branco',
      foto: resolverCaminhoAsset('chica.jpg'),
      fotoDetalhe: resolverCaminhoAsset('chica.jpg'),
      fotoVacina: resolverCaminhoAsset('chica.jpg'),
      descricao: 'Resgatada de telhado com pneumonia, totalmente curada. Super curiosa, brincalhona e apegada.',
      status: 'Apto para Adoção',
      condicaoEspecial: false,
      microchip: '982.000.364.819.680',
      dataResgate: '15/02/2026',
      cidadeOrigem: 'Presidente Prudente - SP',
      localResgate: 'Jardim Bongiovani, Presidente Prudente - SP',
      localAcolhimento: 'Recanto dos Felinos - Box 04',
      castrado: true,
      vacinado: true,
      tags: ['Castrada', 'FIV/FeLV Negativo', '#FilhoteCuriosa', '#Brincalhona'],
      comportamento: {
        outrosCaes: 'Adaptação com cães tranquilos',
        gatos: 'Muito amigável com outros gatos',
        criancas: 'Adora brincadeiras com bolinhas',
        energia: 'Alta'
      },
      historicoSaude: 'Totalmente curada do quadro respiratório. Ganho de peso normal, sem sequelas pulmonares.',
      vacinas: [
        { nome: 'Quádrupla Felina V4', data: '01/03/2026', lote: 'LT-V4-2025-03', lab: 'Zoetis', status: 'Em Dia' },
        { nome: 'Antirrábica Felina', data: '01/03/2026', lote: 'LT-AR-2025-14', lab: 'Zoetis', status: 'Em Dia' }
      ]
    }
  ];

  const DB = {

    init: function () {
      localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(ANIMAIS_PADRAO));
      if (!localStorage.getItem(STORAGE_KEY_FAVORITOS)) {
        localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEY_ADOCAO)) {
        localStorage.setItem(STORAGE_KEY_ADOCAO, JSON.stringify([]));
      }
    },

    resolverCaminhoAsset: resolverCaminhoAsset,

    getAnimais: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_PETS);
        return raw ? JSON.parse(raw) : ANIMAIS_PADRAO;
      } catch (e) {
        return ANIMAIS_PADRAO;
      }
    },

    getAnimalPorTermo: function (termo) {
      if (!termo) return null;
      const termoLimpo = termo.trim().toLowerCase();
      const animais = this.getAnimais();
      return animais.find(a =>
        a.id.toLowerCase() === termoLimpo ||
        a.nome.toLowerCase() === termoLimpo ||
        termoLimpo.includes(a.nome.toLowerCase()) ||
        (a.microchip && a.microchip.includes(termoLimpo))
      ) || null;
    },

    salvarIntencaoAdocao: function (dados) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_ADOCAO);
        const lista = raw ? JSON.parse(raw) : [];
        const protocolo = `PV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        const registro = {
          protocolo: protocolo,
          dataRegistro: new Date().toISOString(),
          dataFormatada: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'Em Análise Humanizada',
          ...dados
        };

        lista.unshift(registro);
        localStorage.setItem(STORAGE_KEY_ADOCAO, JSON.stringify(lista));
        return registro;
      } catch (e) {
        console.error('Erro ao salvar intenção de adoção:', e);
        return null;
      }
    },

    getFavoritos: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_FAVORITOS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    isFavorito: function (id) {
      const favs = this.getFavoritos();
      return favs.includes(id);
    },

    toggleFavorito: function (id) {
      let favs = this.getFavoritos();
      const index = favs.indexOf(id);
      let adicionado = false;
      if (index === -1) {
        favs.push(id);
        adicionado = true;
      } else {
        favs.splice(index, 1);
        adicionado = false;
      }
      localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favs));
      return adicionado;
    }
  };

  DB.init();

  window.PatasDB = DB;
})();
