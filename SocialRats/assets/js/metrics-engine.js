/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SOCIALRATS — SISTEMA CENTRALIZADO DE MÉTRICAS (MVP)
 * Rat Points + Foguinho Diário (Streak) + Multiplicadores Progressivos
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'socialrats_mvp_metrics_v1';

  /**
   * 1. CONFIGURAÇÃO CENTRALIZADA DE PONTOS, MULTIPLICADORES E LIMITES DIÁRIOS
   * Fácil ajuste para balanceamento do MVP.
   */
  const RAT_POINTS_CONFIG = Object.freeze({
    points: {
      STORY_PUBLISHED: 10,          // Story publicado: +10 pontos
      FEED_POST: 20,                // Publicação no feed: +20 pontos
      FEED_POST_MEDIA_BONUS: 10,    // Publicação com imagem ou vídeo: +10 pontos adicionais
      LIKE: 1,                      // Curtida: +1 ponto
      COMMENT: 2,                   // Comentário: +2 pontos
      COMMUNITY_INTERACTION: 2,     // Interação válida em comunidade: +2 pontos
      CHALLENGE_PARTICIPATION: 5,   // Participação em desafio: +5 pontos
      DIRECT_INTERACTION: 0         // Direct mantém o foguinho, sem farming de pontos por mensagem
    },

    // Multiplicadores do foguinho (desbloqueia bonificação a partir do 3º dia consecutivo)
    multipliers: [
      { minDays: 30, value: 2.0,  label: '2x' },
      { minDays: 10, value: 1.5,  label: '1,5x' },
      { minDays: 3,  value: 1.25, label: '1,25x' },
      { minDays: 1,  value: 1.0,  label: '1x' },
      { minDays: 0,  value: 1.0,  label: '1x' }
    ],

    // Atividades válidas para manter/avançar o foguinho diário (1x por dia)
    streakValidActivities: new Set([
      'STORY_PUBLISHED',
      'FEED_POST',
      'DIRECT_INTERACTION',
      'COMMUNITY_INTERACTION',
      'LIKE'
    ]),

    // Limites diários de ações pontuáveis para evitar farming de pontos / spam
    dailyCaps: {
      STORY_PUBLISHED: 5,
      FEED_POST: 5,
      LIKE: 30,
      COMMENT: 15,
      COMMUNITY_INTERACTION: 10,
      CHALLENGE_PARTICIPATION: 3,
      DIRECT_INTERACTION: 1
    },

    // Estado inicial padrão do usuário logado (MVP)
    initialDefaults: {
      ratPoints: 340,
      currentStreak: 5,
      bestStreak: 14,
      totalStories: 12,
      communitiesCount: 5,
      totalFeedPosts: 18,
      followersCount: 1240,
      followingCount: 318,
      totalLikesGiven: 42,
      totalComments: 19,
      totalChallenges: 4
    }
  });

  /**
   * Utilitários de data (fuso local YYYY-MM-DD)
   */
  function getDateKey(dateObj) {
    const d = dateObj || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function diffDaysBetweenKeys(dateKeyA, dateKeyB) {
    if (!dateKeyA || !dateKeyB) return null;
    const [y1, m1, d1] = dateKeyA.split('-').map(Number);
    const [y2, m2, d2] = dateKeyB.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  function getYesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateKey(d);
  }

  /**
   * 2. CÁLCULO DE MULTIPLICADOR DO FOGUINHO
   * - 1º e 2º dia: 1x
   * - 3º ao 9º dia: 1,25x
   * - 10º ao 29º dia: 1,5x
   * - 30º dia ou mais: 2x
   */
  function getMultiplierInfo(streakDays) {
    const days = Math.max(0, Number(streakDays) || 0);
    for (const tier of RAT_POINTS_CONFIG.multipliers) {
      if (days >= tier.minDays) {
        return tier;
      }
    }
    return { minDays: 0, value: 1.0, label: '1x' };
  }

  function getNextMultiplierMilestone(streakDays) {
    const days = Math.max(0, Number(streakDays) || 0);
    if (days < 3) {
      return { nextDays: 3, nextLabel: '1,25x', remaining: 3 - days };
    }
    if (days < 10) {
      return { nextDays: 10, nextLabel: '1,5x', remaining: 10 - days };
    }
    if (days < 30) {
      return { nextDays: 30, nextLabel: '2x', remaining: 30 - days };
    }
    return { nextDays: 30, nextLabel: '2x (Máximo)', remaining: 0 };
  }

  /**
   * 3. GERENCIAMENTO DE ESTADO NO LOCALSTORAGE
   */
  function createDefaultState() {
    const yesterday = getYesterdayKey();
    const def = RAT_POINTS_CONFIG.initialDefaults;

    return {
      ratPoints: def.ratPoints,
      currentStreak: def.currentStreak,
      bestStreak: def.bestStreak,
      lastStreakDate: yesterday, // Permite que a primeira atividade válida de hoje avance o foguinho 1x
      totalStories: def.totalStories,
      communitiesCount: def.communitiesCount,
      totalFeedPosts: def.totalFeedPosts,
      followersCount: def.followersCount,
      followingCount: def.followingCount,
      totalLikesGiven: def.totalLikesGiven,
      totalComments: def.totalComments,
      totalChallenges: def.totalChallenges,
      dailyTracker: {
        date: getDateKey(),
        counts: {},
        awardedKeys: [],
        recentTextHashes: []
      },
      activityLog: [
        {
          id: 'seed-1',
          type: 'FEED_POST',
          label: 'Publicação no feed com foto',
          basePoints: 30,
          multiplier: 1.25,
          finalPoints: 38,
          timestamp: 'Hoje · anteriormente'
        },
        {
          id: 'seed-2',
          type: 'STORY_PUBLISHED',
          label: 'Story publicado',
          basePoints: 10,
          multiplier: 1.25,
          finalPoints: 13,
          timestamp: 'Ontem'
        },
        {
          id: 'seed-3',
          type: 'CHALLENGE_PARTICIPATION',
          label: 'Participação em desafio da comunidade',
          basePoints: 5,
          multiplier: 1.25,
          finalPoints: 6,
          timestamp: 'Ontem'
        },
        {
          id: 'seed-4',
          type: 'COMMUNITY_INTERACTION',
          label: 'Interação em Programação Devs',
          basePoints: 2,
          multiplier: 1.25,
          finalPoints: 3,
          timestamp: 'Há 2 dias'
        }
      ]
    };
  }

  function loadState() {
    let state = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        state = JSON.parse(raw);
      }
    } catch (e) {
      state = null;
    }

    if (!state || typeof state.ratPoints !== 'number') {
      state = createDefaultState();
    }

    // Garantir estrutura diária atualizada
    const today = getDateKey();
    if (!state.dailyTracker || state.dailyTracker.date !== today) {
      state.dailyTracker = {
        date: today,
        counts: {},
        awardedKeys: [],
        recentTextHashes: []
      };
    }

    // Verificar expiração de foguinho caso tenha perdido 1 dia completo sem atividade válida
    // Apenas abrir o app NÃO avança o foguinho, mas se já passou mais de 1 dia desde a última atividade, zera a sequência
    if (state.lastStreakDate) {
      const diff = diffDaysBetweenKeys(state.lastStreakDate, today);
      if (diff !== null && diff > 1) {
        state.currentStreak = 0;
      }
    }

    if (state.currentStreak > state.bestStreak) {
      state.bestStreak = state.currentStreak;
    }

    saveState(state);
    return state;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  /**
   * 4. VALIDAÇÃO ANTI-SPAM, CURTIDA PRÓPRIA E DUPLICIDADE
   */
  function isOwnContent(authorOrOwner) {
    if (!authorOrOwner) return false;
    const normalized = String(authorOrOwner).toLowerCase().replace(/^@/, '').trim();
    if (!normalized) return false;

    let loggedHandle = 'gabriel';
    try {
      const savedUser = localStorage.getItem('socialrats_user');
      if (savedUser) {
        loggedHandle = savedUser.split('@')[0].trim().toLowerCase().replace(/\s+/g, '');
      }
      const savedProfileRaw = localStorage.getItem('socialrats_profile_data');
      if (savedProfileRaw) {
        const p = JSON.parse(savedProfileRaw);
        if (p && p.handle) {
          loggedHandle = p.handle.replace(/^@/, '').toLowerCase().trim();
        }
      }
    } catch (e) {}

    return (
      normalized === loggedHandle ||
      normalized === 'gabriel' ||
      normalized === 'gabrielsilva' ||
      normalized === 'gabrielricca' ||
      normalized === 'seu story' ||
      normalized === 'your story' ||
      normalized === 'your-story'
    );
  }

  function isSpamOrRepetitiveText(text, state) {
    if (typeof text !== 'string') return false;
    const clean = text.trim().toLowerCase();
    // Muito curto ou apenas caracteres repetidos (ex: "aaaa", "...")
    if (clean.length < 2) return true;
    if (/^(.)\1{4,}$/.test(clean)) return true;

    const recent = state.dailyTracker.recentTextHashes || [];
    if (recent.includes(clean)) {
      return true;
    }
    recent.push(clean);
    if (recent.length > 25) recent.shift();
    state.dailyTracker.recentTextHashes = recent;
    return false;
  }

  /**
   * 5. REGISTRO CENTRAL DE ATIVIDADE SOCIAL (recordActivity)
   * Calcula Rat Points + atualiza Foguinho (1x por dia) + aplica Multiplicador sem duplicar.
   *
   * @param {string} type - Tipo da atividade (STORY_PUBLISHED, FEED_POST, LIKE, COMMENT, COMMUNITY_INTERACTION, CHALLENGE_PARTICIPATION, DIRECT_INTERACTION)
   * @param {object} options - { hasMedia, targetId, targetAuthor, text, label }
   */
  function recordActivity(type, options = {}) {
    const state = loadState();
    const today = getDateKey();

    // 1. Impedir curtida no próprio post/story de pontuar ou contar foguinho
    if (type === 'LIKE' && (options.isOwn || isOwnContent(options.targetAuthor))) {
      return {
        awarded: false,
        reason: 'own_like',
        pointsAdded: 0,
        streakAdvanced: false,
        state: getSummary()
      };
    }

    // 2. Evitar pontuar ou multiplicar a mesma atividade/alvo mais de uma vez (idempotência por targetId)
    const uniqueKey = options.targetId ? `${type}:${options.targetId}` : null;
    if (uniqueKey && state.dailyTracker.awardedKeys.includes(uniqueKey)) {
      return {
        awarded: false,
        reason: 'already_awarded',
        pointsAdded: 0,
        streakAdvanced: false,
        state: getSummary()
      };
    }

    // 3. Anti-spam para mensagens no Direct, comentários ou posts repetitivos
    if ((type === 'COMMENT' || type === 'DIRECT_INTERACTION' || type === 'FEED_POST') && options.text) {
      if (isSpamOrRepetitiveText(options.text, state)) {
        saveState(state);
        return {
          awarded: false,
          reason: 'spam_or_repetitive',
          pointsAdded: 0,
          streakAdvanced: false,
          state: getSummary()
        };
      }
    }

    // 4. Atualizar Foguinho Diário (apenas se for atividade válida e ainda não avançou hoje)
    let streakAdvanced = false;
    if (RAT_POINTS_CONFIG.streakValidActivities.has(type)) {
      if (state.lastStreakDate !== today) {
        const diff = state.lastStreakDate ? diffDaysBetweenKeys(state.lastStreakDate, today) : null;
        if (diff === 1) {
          state.currentStreak += 1;
        } else {
          state.currentStreak = 1;
        }
        state.lastStreakDate = today;
        if (state.currentStreak > state.bestStreak) {
          state.bestStreak = state.currentStreak;
        }
        streakAdvanced = true;
      }
    }

    // 5. Atualizar contadores gerais de perfil (independente do cap de pontos)
    if (type === 'STORY_PUBLISHED') {
      state.totalStories = (state.totalStories || 0) + 1;
    } else if (type === 'FEED_POST') {
      state.totalFeedPosts = (state.totalFeedPosts || 0) + 1;
    } else if (type === 'LIKE') {
      state.totalLikesGiven = (state.totalLikesGiven || 0) + 1;
    } else if (type === 'COMMENT') {
      state.totalComments = (state.totalComments || 0) + 1;
    } else if (type === 'CHALLENGE_PARTICIPATION') {
      state.totalChallenges = (state.totalChallenges || 0) + 1;
    }

    // 6. Verificar limite diário de pontos para evitar farming
    const currentCount = state.dailyTracker.counts[type] || 0;
    const maxCap = RAT_POINTS_CONFIG.dailyCaps[type] ?? 10;
    if (currentCount >= maxCap) {
      if (uniqueKey) state.dailyTracker.awardedKeys.push(uniqueKey);
      saveState(state);
      syncAllDOMElements();
      return {
        awarded: false,
        reason: 'daily_cap_reached',
        pointsAdded: 0,
        streakAdvanced,
        state: getSummary()
      };
    }

    // 7. Calcular pontuação base + adicional de mídia (calculado uma única vez)
    let basePoints = RAT_POINTS_CONFIG.points[type] || 0;
    if (type === 'FEED_POST' && options.hasMedia) {
      basePoints += RAT_POINTS_CONFIG.points.FEED_POST_MEDIA_BONUS;
    }

    // 8. Aplicar multiplicador do foguinho atual uma única vez
    const multInfo = getMultiplierInfo(state.currentStreak);
    const finalPoints = basePoints > 0 ? Math.round(basePoints * multInfo.value) : 0;

    state.ratPoints = (state.ratPoints || 0) + finalPoints;
    state.dailyTracker.counts[type] = currentCount + 1;
    if (uniqueKey) {
      state.dailyTracker.awardedKeys.push(uniqueKey);
    }

    // 9. Registrar no histórico recente de atividades se gerou pontos ou avançou o foguinho
    if (finalPoints > 0 || streakAdvanced) {
      const defaultLabels = {
        STORY_PUBLISHED: 'Story publicado',
        FEED_POST: options.hasMedia ? 'Publicação no feed com mídia' : 'Publicação no feed',
        LIKE: 'Curtida em publicação',
        COMMENT: 'Comentário enviado',
        COMMUNITY_INTERACTION: 'Interação em comunidade',
        CHALLENGE_PARTICIPATION: 'Participação em desafio',
        DIRECT_INTERACTION: 'Interação no Direct (Foguinho mantido)'
      };

      const logEntry = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        type,
        label: options.label || defaultLabels[type] || 'Atividade social',
        basePoints,
        multiplier: multInfo.value,
        multiplierLabel: multInfo.label,
        finalPoints,
        streakAdvanced,
        timestamp: 'Agora mesmo'
      };

      state.activityLog = [logEntry, ...(state.activityLog || [])].slice(0, 20);
    }

    saveState(state);
    syncAllDOMElements();

    return {
      awarded: finalPoints > 0,
      pointsAdded: finalPoints,
      basePoints,
      multiplier: multInfo.value,
      multiplierLabel: multInfo.label,
      streakAdvanced,
      currentStreak: state.currentStreak,
      ratPoints: state.ratPoints,
      state: getSummary()
    };
  }

  /**
   * Atualiza quantidade de comunidades participantes quando o usuário entra/sai/cria uma comunidade
   */
  function updateCommunitiesCount(deltaOrAbsolute, isAbsolute = false) {
    const state = loadState();
    if (isAbsolute) {
      state.communitiesCount = Math.max(0, Number(deltaOrAbsolute) || 0);
    } else {
      state.communitiesCount = Math.max(0, (state.communitiesCount || 0) + (Number(deltaOrAbsolute) || 0));
    }
    saveState(state);
    syncAllDOMElements();
    return state.communitiesCount;
  }

  function formatCompactNumber(num) {
    const n = Number(num) || 0;
    if (n >= 1000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'k';
    }
    return n.toLocaleString('pt-BR');
  }

  /**
   * Atualiza quantidade de pessoas que o usuário segue (Seguindo)
   */
  function updateFollowingCount(deltaOrAbsolute, isAbsolute = false) {
    const state = loadState();
    const base = typeof state.followingCount === 'number'
      ? state.followingCount
      : RAT_POINTS_CONFIG.initialDefaults.followingCount;
    if (isAbsolute) {
      state.followingCount = Math.max(0, Number(deltaOrAbsolute) || 0);
    } else {
      state.followingCount = Math.max(0, base + (Number(deltaOrAbsolute) || 0));
    }
    saveState(state);
    syncAllDOMElements();
    return state.followingCount;
  }

  /**
   * Retorna resumo consolidado para qualquer tela do aplicativo
   */
  function getSummary() {
    const state = loadState();
    const today = getDateKey();
    const mult = getMultiplierInfo(state.currentStreak);
    const nextMilestone = getNextMultiplierMilestone(state.currentStreak);
    const isStreakActiveToday = state.lastStreakDate === today;
    const followersCount = typeof state.followersCount === 'number'
      ? state.followersCount
      : RAT_POINTS_CONFIG.initialDefaults.followersCount;
    const followingCount = typeof state.followingCount === 'number'
      ? state.followingCount
      : RAT_POINTS_CONFIG.initialDefaults.followingCount;
    const totalFeedPosts = typeof state.totalFeedPosts === 'number'
      ? state.totalFeedPosts
      : RAT_POINTS_CONFIG.initialDefaults.totalFeedPosts;

    return {
      ratPoints: state.ratPoints,
      ratPointsFormatted: state.ratPoints.toLocaleString('pt-BR'),
      currentStreak: state.currentStreak,
      bestStreak: state.bestStreak,
      totalStories: state.totalStories,
      communitiesCount: state.communitiesCount,
      totalFeedPosts,
      followersCount,
      followersFormatted: formatCompactNumber(followersCount),
      followingCount,
      followingFormatted: formatCompactNumber(followingCount),
      totalLikesGiven: state.totalLikesGiven || 0,
      totalComments: state.totalComments || 0,
      totalChallenges: state.totalChallenges || 0,
      multiplier: mult.value,
      multiplierLabel: mult.label,
      isStreakActiveToday,
      nextMilestone,
      dailyCounts: state.dailyTracker?.counts || {},
      dailyCaps: RAT_POINTS_CONFIG.dailyCaps,
      activityLog: state.activityLog || [],
      config: RAT_POINTS_CONFIG
    };
  }

  /**
   * Sincroniza automaticamente elementos de UI marcados com data-sr-metric
   */
  function syncAllDOMElements() {
    const summary = getSummary();

    document.querySelectorAll('[data-sr-metric]').forEach(el => {
      const key = el.getAttribute('data-sr-metric');
      if (key === 'ratPoints') {
        el.textContent = summary.ratPointsFormatted;
      } else if (key === 'currentStreak') {
        el.textContent = `🔥 ${summary.currentStreak}`;
      } else if (key === 'currentStreakDays') {
        el.textContent = `${summary.currentStreak} dias`;
      } else if (key === 'bestStreak') {
        el.textContent = `${summary.bestStreak} dias`;
      } else if (key === 'bestStreakFlame') {
        el.textContent = `🔥 ${summary.bestStreak}`;
      } else if (key === 'bestStreakShort') {
        el.textContent = `${summary.bestStreak}d`;
      } else if (key === 'totalStories') {
        el.textContent = summary.totalStories;
      } else if (key === 'totalFeedPosts') {
        el.textContent = summary.totalFeedPosts;
      } else if (key === 'followersCount') {
        el.textContent = summary.followersFormatted;
      } else if (key === 'followingCount') {
        el.textContent = summary.followingFormatted;
      } else if (key === 'communitiesCount') {
        el.textContent = summary.communitiesCount;
      } else if (key === 'multiplierLabel') {
        el.textContent = summary.multiplierLabel;
      } else if (key === 'badgeSummary') {
        el.textContent = `${summary.ratPointsFormatted} Rat Points · Multiplicador ${summary.multiplierLabel}`;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncAllDOMElements();
  });

  // Expor API global única
  window.SocialRatsMetrics = {
    CONFIG: RAT_POINTS_CONFIG,
    getSummary,
    recordActivity,
    updateCommunitiesCount,
    updateFollowingCount,
    getMultiplierInfo,
    syncAllDOMElements
  };
})(window);

