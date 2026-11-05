/**
 * ═══════════════════════════════════════════════════════════════
 * SOCIALRATS UNIFIED STORIES ENGINE (DESIGN_SYSTEM.MD COMPLIANT)
 * ═══════════════════════════════════════════════════════════════
 * Centraliza e padroniza os Stories em todo o SocialRats:
 * - Navegação contextual inteligente inspirada no Instagram:
 *     * CONTEXTO DIRECT: Exclusivo do contato selecionado (não avança para outros contatos).
 *     * CONTEXTO PERFIL: Exclusivo do perfil selecionado (não avança para outros usuários).
 *     * CONTEXTO FEED: Navegação sequencial entre contas com Stories NÃO visualizados (exclui já vistos da fila automática).
 * - Barra superior segmentada por conta:
 *     * Ex: Se Lucas postou 2 stories -> 2 barras.
 *     * Se rijalxp postou 1 story -> 1 barra.
 * - Stories visualizados continuam disponíveis por 24h:
 *     * Indicador visual novo: anel gradiente vibrante (--sr-story-gradient).
 *     * Indicador visual visto: anel cinza discreto (#4b4958).
 *     * Sem stories: sem anel em volta do avatar.
 * - Navegação completa: swipe lateral touch, toques esquerda/direita e setas.
 * - Curtidas com persistência e animação de batimento.
 * - Respostas vinculadas diretamente à conversa no Direct.
 * - Compartilhamento contextual com contatos e grupos.
 */

(function (window) {
  'use strict';

  const VIEWED_STORAGE_KEY = 'socialrats_viewed_stories_v2';
  const LIKES_STORAGE_KEY = 'socialrats_story_likes_v2';
  const USER_STORIES_STORAGE_KEY = 'socialrats_user_stories_v2';
  const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 horas

  // Contas base do SocialRats com stories realistas dentro do período de 24 horas
  const BASE_ACCOUNTS = [
    {
      key: 'lucas',
      author: 'Lucas Mendes',
      avatar: '../../../assets/images/avatar-lucas.png',
      stories: [
        {
          id: 'story-lucas-1',
          media: '../../../assets/images/post-blue-orange.png',
          caption: 'Treino de costas e bíceps na arena! Foco na evolução constante 🚀🔥',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          time: '2h atrás'
        },
        {
          id: 'story-lucas-2',
          media: '../../../assets/images/challenges.jpg',
          caption: 'Pós-treino reforçado. Quem treinou hoje também? 💪',
          createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
          time: '1h atrás'
        }
      ]
    },
    {
      key: 'ana',
      author: 'Ana Costa',
      avatar: '../../../assets/images/avatar-ana.png',
      stories: [
        {
          id: 'story-ana-1',
          media: '../../../assets/images/post-sunset.png',
          caption: 'Corrida de 8km no pôr do sol concluída. Constância vence! ✨💪',
          createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          time: '4h atrás'
        }
      ]
    },
    {
      key: 'rafael',
      author: 'Rafael Souza',
      avatar: '../../../assets/images/avatar-rafael.png',
      stories: [
        {
          id: 'story-rafael-1',
          media: '../../../assets/images/challenges.jpg',
          caption: 'Desafio 30 dias de disciplina diária. Bora bater a meta! 🔥',
          createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          time: '6h atrás'
        }
      ]
    },
    {
      key: 'carol',
      author: 'Carol Lima',
      avatar: '../../../assets/images/avatar-carol.png',
      stories: [
        {
          id: 'story-carol-1',
          media: '../../../assets/images/post-sunset-crop.png',
          caption: 'Leg day com o coach. Ninguém aguenta subir a escada depois kkkk 😂🏋️‍♀️',
          createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
          time: '8h atrás'
        }
      ]
    },
    {
      key: 'matheus',
      author: 'Matheus Oliveira',
      avatar: '../../../assets/images/avatar-matheus.png',
      stories: [
        {
          id: 'story-matheus-1',
          media: '../../../assets/images/scoring.jpg',
          caption: 'Top 3 no ranking da semana! Tamo junto demais comunidade 👊🏆',
          createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
          time: '10h atrás'
        }
      ]
    },
    {
      key: 'rijalxp',
      author: 'rijalxp',
      avatar: '../../../assets/images/avatar-rijalxp.png',
      stories: [
        {
          id: 'story-rijalxp-1',
          media: '../../../assets/images/post-blue-orange.png',
          caption: 'Balanço da semana: 6 treinos concluídos com sucesso!',
          createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
          time: '12h atrás'
        }
      ]
    },
    {
      key: 'broyin',
      author: 'broyin',
      avatar: '../../../assets/images/avatar-broyin.png',
      stories: [
        {
          id: 'story-broyin-1',
          media: '../../../assets/images/post-sunset-crop.png',
          caption: 'Progresso diário > Perfeição momentânea.',
          createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
          time: '14h atrás'
        },
        {
          id: 'story-broyin-2',
          media: '../../../assets/images/post-sunset.png',
          caption: 'Foco total nas metas da temporada! 🚀',
          createdAt: new Date(Date.now() - 13 * 3600 * 1000).toISOString(),
          time: '13h atrás'
        }
      ]
    },
    {
      key: 'den.a',
      author: 'den.a',
      avatar: '../../../assets/images/avatar-dena.png',
      stories: [
        {
          id: 'story-dena-1',
          media: '../../../assets/images/scoring.jpg',
          caption: 'Fechando a semana de treinos com chave de ouro.',
          createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
          time: '16h atrás'
        }
      ]
    },
    {
      key: 'chrex',
      author: 'chrex',
      avatar: '../../../assets/images/avatar-chrex.png',
      stories: [
        {
          id: 'story-chrex-1',
          media: '../../../assets/images/post-blue-orange.png',
          caption: 'Treino de alta intensidade concluído! ⚡',
          createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
          time: '18h atrás'
        }
      ]
    },
    {
      key: 'gabriel',
      author: 'Gabriel Ricca',
      avatar: '../../../assets/images/avatar-your-story.png',
      stories: [
        {
          id: 'story-gabriel-1',
          media: '../../../assets/images/post-sunset-crop.png',
          caption: 'Treino concluído na Arena SocialRats! Foco nos 100 pontos 🎯💪',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          time: '3h atrás'
        },
        {
          id: 'story-gabriel-2',
          media: '../../../assets/images/challenges.jpg',
          caption: 'Disciplina é o que constrói o resultado diário.',
          createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
          time: '1h atrás'
        }
      ]
    }
  ];

  // Armazenamento persistente de visualizações
  function getViewedMap() {
    try {
      return JSON.parse(localStorage.getItem(VIEWED_STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveViewedMap(map) {
    try {
      localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  // Armazenamento persistente de curtidas
  function getLikesSet() {
    try {
      const arr = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '[]');
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveLikesSet(set) {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {}
  }

  // Armazenamento de stories criados pelo próprio usuário logado
  function getUserStories() {
    try {
      const arr = JSON.parse(localStorage.getItem(USER_STORIES_STORAGE_KEY) || '[]');
      const now = Date.now();
      // Remove somente expirados (> 24h)
      const valid = arr.filter((item) => now - new Date(item.createdAt).getTime() < EXPIRATION_MS);
      if (valid.length !== arr.length) {
        saveUserStories(valid);
      }
      return valid;
    } catch (e) {
      return [];
    }
  }

  function saveUserStories(list) {
    try {
      localStorage.setItem(USER_STORIES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function detectContext() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('chat.html') || path.includes('direct.html')) {
      return 'direct';
    }
    if (path.includes('profile.html')) {
      return 'profile';
    }
    return 'feed';
  }

  // Objeto público da engine de Stories
  const engine = {
    /**
     * Retorna todas as contas com stories ativos (< 24h)
     */
    getActiveAccounts() {
      const now = Date.now();
      const accounts = [];

      // 1. Stories do próprio usuário (se houver)
      const userStories = getUserStories();
      if (userStories.length > 0) {
        accounts.push({
          key: 'your-story',
          userKey: 'your-story',
          author: 'Seu Story',
          avatar:
            (window.SocialRatsUser && window.SocialRatsUser.DEFAULT_AVATAR) ||
            '../../../assets/images/avatar-your-story.png',
          isYourStory: true,
          stories: userStories.map((s, idx) => ({
            id: s.id || `story-me-${idx}`,
            media: s.media,
            caption: s.caption || '',
            createdAt: s.createdAt,
            time: 'Recente',
            author: 'Seu Story',
            avatar:
              (window.SocialRatsUser && window.SocialRatsUser.DEFAULT_AVATAR) ||
              '../../../assets/images/avatar-your-story.png',
            userKey: 'your-story',
            isYourStory: true
          }))
        });
      }

      // 2. Contas base
      BASE_ACCOUNTS.forEach((acc) => {
        const validStories = acc.stories.filter(
          (s) => now - new Date(s.createdAt).getTime() < EXPIRATION_MS
        );
        if (validStories.length > 0) {
          accounts.push({
            key: acc.key,
            userKey: acc.key,
            author: acc.author,
            avatar: acc.avatar,
            isYourStory: false,
            stories: validStories.map((s) => ({
              ...s,
              author: acc.author,
              avatar: acc.avatar,
              userKey: acc.key
            }))
          });
        }
      });

      return accounts;
    },

    /**
     * Busca uma conta pelo userKey, author ou id de story
     */
    findAccount(keyOrId) {
      if (!keyOrId) return null;
      const clean = String(keyOrId).toLowerCase().replace(/^@/, '');
      const accounts = engine.getActiveAccounts();

      return (
        accounts.find((acc) => {
          if (acc.key.toLowerCase() === clean) return true;
          if (acc.author.toLowerCase() === clean) return true;
          if ((clean === 'me' || clean === 'your story') && acc.key === 'your-story') return true;
          if (clean === 'gabriel silva' && (acc.key === 'gabriel' || acc.key === 'your-story')) return true;
          return acc.stories.some((s) => s.id.toLowerCase() === clean);
        }) || null
      );
    },

    getAllStories() {
      const accounts = engine.getActiveAccounts();
      const list = [];
      accounts.forEach((acc) => {
        acc.stories.forEach((s) => list.push(s));
      });
      return list;
    },

    getStory(keyOrId) {
      const acc = engine.findAccount(keyOrId);
      if (!acc) return null;
      const clean = String(keyOrId).toLowerCase().replace(/^@/, '');
      return acc.stories.find((s) => s.id.toLowerCase() === clean) || acc.stories[0] || null;
    },

    hasStory(keyOrId) {
      if (!keyOrId) return false;
      const clean = String(keyOrId).toLowerCase().replace(/^@/, '');
      if (clean === 'your-story' || clean === 'me') {
        return getUserStories().length > 0;
      }
      return Boolean(engine.findAccount(clean));
    },

    /**
     * Verifica se um story individual já foi visualizado
     */
    isStoryViewed(storyId) {
      if (!storyId) return false;
      const map = getViewedMap();
      const viewedAt = map[storyId];
      if (!viewedAt) return false;
      return Date.now() - viewedAt < EXPIRATION_MS;
    },

    /**
     * Verifica se TODOS os stories ativos da conta já foram visualizados
     */
    isAccountFullyViewed(keyOrId) {
      const acc = engine.findAccount(keyOrId);
      if (!acc || !acc.stories.length) return false;
      return acc.stories.every((s) => engine.isStoryViewed(s.id));
    },

    /**
     * Verifica se a conta possui ao menos 1 story NÃO visualizado
     */
    hasUnviewedStories(keyOrId) {
      const acc = engine.findAccount(keyOrId);
      if (!acc || !acc.stories.length) return false;
      return acc.stories.some((s) => !engine.isStoryViewed(s.id));
    },

    isViewed(keyOrId) {
      const acc = engine.findAccount(keyOrId);
      if (acc) {
        return engine.isAccountFullyViewed(acc.key);
      }
      return engine.isStoryViewed(keyOrId);
    },

    markAsViewed(storyId) {
      if (!storyId) return;
      const map = getViewedMap();
      map[storyId] = Date.now();
      saveViewedMap(map);
      engine.syncAllStoryElements();
      window.dispatchEvent(new CustomEvent('sr:stories-updated', { detail: { id: storyId } }));
    },

    markStoryAsViewed(storyId) {
      engine.markAsViewed(storyId);
    },

    isLiked(storyId) {
      return getLikesSet().has(storyId);
    },

    toggleLike(storyId) {
      const set = getLikesSet();
      const isNowLiked = !set.has(storyId);
      if (isNowLiked) set.add(storyId);
      else set.delete(storyId);
      saveLikesSet(set);

      const story = engine.getStory(storyId);
      if (isNowLiked && story && window.SocialRatsMetrics) {
        window.SocialRatsMetrics.recordActivity('LIKE', {
          targetAuthor: story.author,
          targetId: 'story_' + story.id,
          label: `Curtida no story de ${story.author}`
        });
      }
      return isNowLiked;
    },

    publishUserStory(mediaUrl, caption) {
      const stories = getUserStories();
      const newStory = {
        id: 'story-user-' + Date.now().toString(36),
        media: mediaUrl || '../../../assets/images/post-sunset-crop.png',
        caption: caption || '',
        createdAt: new Date().toISOString()
      };
      stories.unshift(newStory);
      saveUserStories(stories);

      // Limpa marcação de visto para o novo story
      const map = getViewedMap();
      delete map[newStory.id];
      saveViewedMap(map);

      if (window.SocialRatsMetrics) {
        window.SocialRatsMetrics.recordActivity('STORY_PUBLISHED', {
          label: 'Story publicado no SocialRats'
        });
      }
      engine.syncAllStoryElements();
      window.dispatchEvent(new CustomEvent('sr:stories-updated'));
      return newStory;
    },

    publishMyStory(mediaUrl, caption) {
      return engine.publishUserStory(mediaUrl, caption);
    },

    replyToStory(story, messageText) {
      const text = String(messageText || '').trim();
      if (!text || !story) return false;

      const dm = window.SocialRatsUser && window.SocialRatsUser.dm;
      if (dm && dm.updateSettings) {
        const stream = document.getElementById('chat-stream');
        const contactNameEl = document.getElementById('chat-contact-name');
        const isCurrentChat =
          contactNameEl &&
          contactNameEl.textContent.trim().toLowerCase() === story.author.toLowerCase();

        if (stream && isCurrentChat) {
          const sentGroup = document.createElement('div');
          sentGroup.className = 'message-bubble-group sent';
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          sentGroup.innerHTML = `
            <div class="message-bubble" style="border-top-left-radius:18px;">
              <div style="font-size:11px; opacity:0.8; margin-bottom:4px; display:flex; align-items:center; gap:5px;">
                <i class="fa-solid fa-camera"></i> Resposta ao Story
              </div>
              ${escapeHtml(text)}
              <div class="message-meta-row">
                <span>${now}</span>
                <i class="fa-solid fa-check"></i>
              </div>
            </div>
          `;
          const typing = document.getElementById('typing-indicator');
          if (typing) stream.insertBefore(sentGroup, typing);
          else stream.appendChild(sentGroup);
          stream.scrollTop = stream.scrollHeight;
        }
      }

      if (window.SocialRatsMetrics) {
        window.SocialRatsMetrics.recordActivity('COMMENT', {
          text,
          targetAuthor: story.author,
          label: `Resposta ao story de ${story.author}`
        });
      }
      return true;
    },

    shareStory(story, targetKey, targetName) {
      if (!story) return false;
      const dm = window.SocialRatsUser && window.SocialRatsUser.dm;
      if (dm) {
        const stream = document.getElementById('chat-stream');
        const contactNameEl = document.getElementById('chat-contact-name');
        const isCurrentChat =
          contactNameEl &&
          contactNameEl.textContent.trim().toLowerCase() === String(targetName || '').toLowerCase();

        if (stream && isCurrentChat) {
          const sentGroup = document.createElement('div');
          sentGroup.className = 'message-bubble-group sent';
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          sentGroup.innerHTML = `
            <div class="message-bubble" style="border-top-left-radius:18px; max-width:240px; padding:8px;">
              <div style="font-size:11.5px; opacity:0.9; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                <img src="${story.avatar}" style="width:18px; height:18px; border-radius:50%; object-fit:cover;">
                <strong>${escapeHtml(story.author)}</strong>
              </div>
              <img src="${story.media}" style="width:100%; height:130px; object-fit:cover; border-radius:10px; margin-bottom:6px; display:block;">
              <span style="font-size:12px; opacity:0.85;">Story compartilhado</span>
              <div class="message-meta-row">
                <span>${now}</span>
                <i class="fa-solid fa-check"></i>
              </div>
            </div>
          `;
          const typing = document.getElementById('typing-indicator');
          if (typing) stream.insertBefore(sentGroup, typing);
          else stream.appendChild(sentGroup);
          stream.scrollTop = stream.scrollHeight;
        }
      }
      return true;
    },

    syncAllStoryElements() {
      // 1. Carrossel de Stories do Feed (.story-item[data-story-id])
      document.querySelectorAll('.story-item[data-story-id]').forEach((el) => {
        const id = el.getAttribute('data-story-id');
        const has = engine.hasStory(id);
        const fullyViewed = has && engine.isAccountFullyViewed(id);
        el.classList.toggle('story-viewed', fullyViewed);
        const wrap = el.querySelector('.story-avatar-wrap');
        if (wrap) {
          wrap.classList.toggle('has-story', has);
          wrap.classList.toggle('story-viewed', fullyViewed);
        }
      });

      // 2. Carrossel de Conexões do Direct (.connection-item)
      document.querySelectorAll('.connection-item').forEach((item) => {
        const userKey =
          item.getAttribute('data-story-user') ||
          (item.classList.contains('your-story') ? 'your-story' : '');
        if (!userKey) return;
        const has = engine.hasStory(userKey);
        const fullyViewed = has && engine.isAccountFullyViewed(userKey);
        const wrap = item.querySelector('.connection-avatar-wrap');
        if (wrap) {
          wrap.classList.toggle('has-story', has);
          wrap.classList.toggle('story-viewed', fullyViewed);
        }
        item.classList.toggle('story-viewed', fullyViewed);
      });

      // 3. Linhas de conversa do Direct (.conversation-row[href*="contact="])
      document.querySelectorAll('a.conversation-row[href*="contact="]').forEach((row) => {
        const key = new URL(row.getAttribute('href'), location.href).searchParams.get('contact');
        const wrap = row.querySelector('.conv-avatar-wrap');
        if (wrap && key) {
          const has = engine.hasStory(key);
          const fullyViewed = has && engine.isAccountFullyViewed(key);
          wrap.classList.toggle('has-story', has);
          wrap.classList.toggle('story-viewed', fullyViewed);
        }
      });

      // 4. Cabeçalho do Chat (#chat-avatar-wrap), Barra Lateral (#sidebar-avatar-wrap) e Info Hero (#dm-hero-avatar-wrap)
      const urlParams = new URLSearchParams(window.location.search);
      const contactKey = (urlParams.get('contact') || '').toLowerCase();
      const isGroup = !!urlParams.get('group');

      if (contactKey && !isGroup) {
        const has = engine.hasStory(contactKey);
        const fullyViewed = has && engine.isAccountFullyViewed(contactKey);

        const headWrap = document.getElementById('chat-avatar-wrap');
        if (headWrap) {
          headWrap.classList.toggle('has-story', has);
          headWrap.classList.toggle('story-viewed', fullyViewed);
          headWrap.title = has
            ? fullyViewed
              ? 'Story já visualizado (toque para rever)'
              : 'Ver story'
            : '';
        }

        const sideWrap = document.getElementById('sidebar-avatar-wrap');
        if (sideWrap) {
          sideWrap.classList.toggle('has-story', has);
          sideWrap.classList.toggle('story-viewed', fullyViewed);
        }

        const heroWrap = document.getElementById('dm-hero-avatar-wrap');
        if (heroWrap) {
          heroWrap.classList.toggle('has-story', has);
          heroWrap.classList.toggle('story-viewed', fullyViewed);
        }
      } else {
        const headWrap = document.getElementById('chat-avatar-wrap');
        if (headWrap) headWrap.classList.remove('has-story', 'story-viewed');
        const heroWrap = document.getElementById('dm-hero-avatar-wrap');
        if (heroWrap) heroWrap.classList.remove('has-story', 'story-viewed');
      }

      // 5. Perfil de usuário (.profile-avatar-wrap)
      const profileWrap = document.querySelector('.profile-avatar-wrap');
      if (profileWrap) {
        const profUser = urlParams.get('user') || 'gabriel';
        const has = engine.hasStory(profUser) || engine.hasStory('your-story');
        const targetKey = engine.hasStory(profUser) ? profUser : 'your-story';
        const fullyViewed = has && engine.isAccountFullyViewed(targetKey);
        profileWrap.classList.toggle('has-story', has);
        profileWrap.classList.toggle('story-viewed', fullyViewed);
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * ESTILOS E COMPONENTE CENTRALIZADO DO VISUALIZADOR DE STORIES
   * ═══════════════════════════════════════════════════════════════ */
  let modalEl = null;
  let activeContext = 'feed'; // 'feed' | 'profile' | 'direct'
  let activeAccounts = [];
  let currentAccountIndex = 0;
  let currentStoryIndex = 0;
  let timerInterval = null;
  let progressPercent = 0;
  let isPaused = false;

  function injectViewerStyles() {
    if (document.getElementById('sr-stories-viewer-styles')) return;
    const style = document.createElement('style');
    style.id = 'sr-stories-viewer-styles';
    style.textContent = `
      :root {
        --sr-story-gradient: linear-gradient(135deg, #ff32b8 0%, #ff5e62 50%, #ff9900 100%);
        --sr-story-viewed: #4b4958;
      }

      /* Anel de Stories Unificado */
      .story-avatar-wrap.has-story,
      .connection-avatar-wrap.has-story,
      .conv-avatar-wrap.has-story,
      .chat-avatar-wrap.has-story,
      .dm-hero-avatar-wrap.has-story,
      .profile-avatar-wrap.has-story {
        background: var(--sr-story-gradient) !important;
        border: none !important;
        padding: 2.5px !important;
        border-radius: 50% !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: transform 0.2s ease, filter 0.2s ease;
        cursor: pointer;
      }

      /* Story já visualizado: anel cinza discreto #4b4958 */
      .story-avatar-wrap.has-story.story-viewed,
      .connection-avatar-wrap.has-story.story-viewed,
      .conv-avatar-wrap.has-story.story-viewed,
      .chat-avatar-wrap.has-story.story-viewed,
      .dm-hero-avatar-wrap.has-story.story-viewed,
      .profile-avatar-wrap.has-story.story-viewed,
      .story-item.story-viewed .story-avatar-wrap,
      .connection-item.story-viewed .connection-avatar-wrap {
        background: var(--sr-story-viewed) !important;
        filter: grayscale(0.2);
      }

      /* Modal Overlay Fullscreen */
      .sr-story-overlay {
        position: fixed;
        inset: 0;
        background: rgba(5, 4, 9, 0.94);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.22s ease;
      }

      .sr-story-overlay.active {
        display: flex;
        opacity: 1;
      }

      /* Cartão Central Proporcional aos Stories Mobile/Feed */
      .sr-story-card {
        width: 100%;
        max-width: 420px;
        height: 100%;
        max-height: 840px;
        position: relative;
        background: #0a0812;
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.1);
        touch-action: pan-y;
      }

      @media (max-width: 600px) {
        .sr-story-card {
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
          border: none;
        }
      }

      /* Barras de Progresso no Topo (Segmentadas por conta) */
      .sr-story-progress-bar {
        position: absolute;
        top: 12px;
        left: 12px;
        right: 12px;
        display: flex;
        gap: 5px;
        z-index: 50;
      }

      .sr-story-progress-segment {
        flex: 1;
        height: 3px;
        background: rgba(255, 255, 255, 0.35);
        border-radius: 9999px;
        overflow: hidden;
        backdrop-filter: blur(4px);
      }

      .sr-story-progress-fill {
        height: 100%;
        width: 0%;
        background: #ffffff;
        border-radius: 9999px;
        transition: width 0.1s linear;
      }

      /* Top Header: Autor, Context Badge & Botão Fechar */
      .sr-story-header {
        position: absolute;
        top: 24px;
        left: 14px;
        right: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 40;
      }

      .sr-story-user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: #fff;
      }

      .sr-story-author-avatar-wrap {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        padding: 2px;
        background: var(--sr-story-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sr-story-author-avatar-wrap.viewed {
        background: var(--sr-story-viewed);
      }

      .sr-story-author-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background: #000;
      }

      .sr-story-author-col {
        display: flex;
        flex-direction: column;
        line-height: 1.25;
      }

      .sr-story-author-name {
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 1px 4px rgba(0,0,0,0.85);
      }

      .sr-story-author-time {
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.75);
        text-shadow: 0 1px 4px rgba(0,0,0,0.85);
      }

      .sr-btn-close-story {
        background: rgba(15, 12, 24, 0.65);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        font-size: 18px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.15s ease;
      }

      .sr-btn-close-story:hover {
        background: rgba(255, 50, 184, 0.4);
        transform: scale(1.08);
      }

      /* Mídia Central */
      .sr-story-body {
        flex: 1;
        width: 100%;
        height: 100%;
        background: #050409;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        user-select: none;
      }

      .sr-story-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        pointer-events: none;
      }

      /* Zonas de Toque Laterais Invisíveis */
      .sr-story-tap-zone {
        position: absolute;
        top: 0;
        bottom: 80px;
        width: 40%;
        z-index: 20;
        cursor: pointer;
        background: transparent;
      }

      .sr-story-tap-zone.prev {
        left: 0;
      }

      .sr-story-tap-zone.next {
        right: 0;
      }

      /* Legenda sobreposta */
      .sr-story-caption-badge {
        position: absolute;
        bottom: 86px;
        left: 14px;
        right: 14px;
        padding: 10px 14px;
        background: rgba(14, 11, 23, 0.85);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 14px;
        color: #ffffff;
        font-size: 13px;
        line-height: 1.4;
        z-index: 25;
        text-shadow: 0 1px 3px rgba(0,0,0,0.6);
      }

      /* Barra Inferior de Ações */
      .sr-story-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 14px 18px;
        background: linear-gradient(to top, rgba(11, 9, 19, 0.95) 0%, rgba(11, 9, 19, 0.6) 65%, transparent 100%);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 35;
      }

      .sr-story-reply-form {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }

      .sr-story-reply-input {
        width: 100%;
        height: 44px;
        border-radius: 9999px;
        background: rgba(28, 23, 40, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.22);
        padding: 0 42px 0 16px;
        color: #ffffff;
        font-family: var(--font-body, 'Inter', sans-serif);
        font-size: 13.5px;
        outline: none;
        backdrop-filter: blur(10px);
        transition: border-color 0.18s ease, background 0.18s ease;
      }

      .sr-story-reply-input::placeholder {
        color: rgba(255, 255, 255, 0.65);
      }

      .sr-story-reply-input:focus {
        border-color: var(--color-accent-pink, #ff32b8);
        background: rgba(20, 17, 30, 0.96);
      }

      .sr-story-reply-send-btn {
        position: absolute;
        right: 6px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: var(--gradient-brand, #ff32b8);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }

      .sr-story-reply-input:not(:placeholder-shown) + .sr-story-reply-send-btn {
        opacity: 1;
        pointer-events: auto;
      }

      .sr-story-action-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(28, 23, 40, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #ffffff;
        font-size: 19px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        backdrop-filter: blur(8px);
        transition: transform 0.15s ease, color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
      }

      .sr-story-action-btn:hover {
        background: rgba(28, 23, 40, 0.95);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .sr-story-action-btn:active {
        transform: scale(0.9);
      }

      .sr-story-action-btn.liked {
        color: #ff32b8;
        border-color: rgba(255, 50, 184, 0.6);
        background: rgba(255, 50, 184, 0.2);
        animation: heartBeat 0.25s ease-in-out;
      }

      @keyframes heartBeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.22); }
        100% { transform: scale(1); }
      }

      /* Sheet de Compartilhamento */
      .sr-story-share-sheet {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 74px;
        background: #14111e;
        border: 1px solid var(--color-border-subtle, #30263e);
        border-radius: 20px;
        padding: 16px;
        z-index: 50;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.9);
        display: none;
        flex-direction: column;
        gap: 12px;
        animation: srSlideUp 0.18s ease-out;
      }

      .sr-story-share-sheet.open {
        display: flex;
      }

      @keyframes srSlideUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .sr-story-share-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13.5px;
        font-weight: 700;
        color: #ffffff;
      }

      .sr-story-share-list {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        padding: 4px 0 8px;
        scrollbar-width: none;
      }

      .sr-story-share-list::-webkit-scrollbar {
        display: none;
      }

      .sr-share-dest-btn {
        background: transparent;
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        color: var(--color-text-secondary, #b7b0c5);
        font-family: inherit;
        font-size: 11px;
        font-weight: 500;
        min-width: 58px;
        transition: transform 0.15s ease, color 0.15s ease;
      }

      .sr-share-dest-btn:hover {
        color: #ffffff;
        transform: translateY(-2px);
      }

      .sr-share-dest-btn img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid var(--color-border-subtle, #30263e);
        transition: border-color 0.15s ease;
      }

      .sr-share-dest-btn:hover img {
        border-color: var(--color-accent-pink, #ff32b8);
      }

      .sr-copy-link-btn {
        width: 100%;
        height: 40px;
        border-radius: 12px;
        background: var(--color-surface-elevated, #1c1728);
        border: 1px solid var(--color-border-subtle, #30263e);
        color: #ffffff;
        font-family: inherit;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .sr-copy-link-btn:hover {
        background: #251f38;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureViewerModal() {
    injectViewerStyles();
    if (document.getElementById('sr-unified-story-modal')) return;

    modalEl = document.createElement('div');
    modalEl.className = 'sr-story-overlay';
    modalEl.id = 'sr-unified-story-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-label', 'Visualizador de Stories SocialRats');

    modalEl.innerHTML = `
      <div class="sr-story-card" id="sr-story-card">
        <!-- Progress Segments da Conta Ativa -->
        <div class="sr-story-progress-bar" id="sr-story-progress-bar"></div>

        <!-- Top Header: Autor & Fechar -->
        <div class="sr-story-header">
          <div class="sr-story-user-info" id="sr-story-user-info">
            <div class="sr-story-author-avatar-wrap" id="sr-story-author-avatar-wrap">
              <img src="" alt="" class="sr-story-author-avatar" id="sr-story-author-avatar">
            </div>
            <div class="sr-story-author-col">
              <span class="sr-story-author-name" id="sr-story-author-name">Autor</span>
              <span class="sr-story-author-time" id="sr-story-author-time">Agora</span>
            </div>
          </div>
          <button type="button" class="sr-btn-close-story" id="sr-btn-close-story" aria-label="Fechar história">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Mídia Central -->
        <div class="sr-story-body">
          <div class="sr-story-tap-zone prev" id="sr-tap-prev" aria-label="Story anterior"></div>
          <img src="" alt="Story" class="sr-story-img" id="sr-story-media-img">
          <div class="sr-story-tap-zone next" id="sr-tap-next" aria-label="Próximo story"></div>

          <!-- Legenda -->
          <div class="sr-story-caption-badge" id="sr-story-caption" style="display:none;"></div>

          <!-- Share Sheet Popover -->
          <div class="sr-story-share-sheet" id="sr-story-share-sheet">
            <div class="sr-story-share-header">
              <span>Compartilhar story no Direct</span>
              <button type="button" id="sr-btn-close-share" style="background:none;border:none;color:#b7b0c5;cursor:pointer;font-size:15px;">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="sr-story-share-list" id="sr-story-share-list"></div>
            <button type="button" class="sr-copy-link-btn" id="sr-btn-copy-link">
              <i class="fa-solid fa-link"></i>
              <span>Copiar link do story</span>
            </button>
          </div>
        </div>

        <!-- Footer: Resposta, Curtir & Compartilhar -->
        <div class="sr-story-footer">
          <form class="sr-story-reply-form" id="sr-story-reply-form">
            <input
              type="text"
              class="sr-story-reply-input"
              id="sr-story-reply-input"
              placeholder="Enviar mensagem..."
              autocomplete="off"
            >
            <button type="submit" class="sr-story-reply-send-btn" aria-label="Enviar resposta">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>

          <button type="button" class="sr-story-action-btn" id="sr-story-like-btn" title="Curtir story" aria-label="Curtir story">
            <i class="fa-regular fa-heart"></i>
          </button>

          <button type="button" class="sr-story-action-btn" id="sr-story-share-btn" title="Compartilhar no Direct" aria-label="Compartilhar">
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);
    setupViewerEventListeners();
  }

  function setupViewerEventListeners() {
    const closeBtn = document.getElementById('sr-btn-close-story');
    if (closeBtn) closeBtn.onclick = () => engine.close();

    modalEl.onclick = (e) => {
      if (e.target === modalEl) engine.close();
    };

    const tapPrev = document.getElementById('sr-tap-prev');
    if (tapPrev) tapPrev.onclick = () => engine.prev();

    const tapNext = document.getElementById('sr-tap-next');
    if (tapNext) tapNext.onclick = () => engine.next();

    // Gestos de Swipe lateral e Long-press para pausar
    const card = document.getElementById('sr-story-card');
    let touchStartX = 0;
    let touchStartY = 0;
    let longPressTimer = null;

    card.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        longPressTimer = setTimeout(() => {
          pauseTimer();
        }, 220);
      },
      { passive: true }
    );

    card.addEventListener(
      'touchend',
      (e) => {
        if (longPressTimer) clearTimeout(longPressTimer);
        resumeTimer();
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        // Deslizar para a esquerda: avançar | Deslizar para a direita: voltar
        if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            engine.next();
          } else {
            engine.prev();
          }
        }
      },
      { passive: true }
    );

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (!modalEl || !modalEl.classList.contains('active')) return;
      if (document.activeElement === document.getElementById('sr-story-reply-input')) {
        if (e.key === 'Escape') document.getElementById('sr-story-reply-input').blur();
        return;
      }
      if (e.key === 'ArrowRight') engine.next();
      else if (e.key === 'ArrowLeft') engine.prev();
      else if (e.key === 'Escape') engine.close();
      else if (e.key === ' ') {
        e.preventDefault();
        if (isPaused) resumeTimer();
        else pauseTimer();
      }
    });

    // Curtir
    const likeBtn = document.getElementById('sr-story-like-btn');
    if (likeBtn) {
      likeBtn.onclick = (e) => {
        e.stopPropagation();
        const currentStory = getCurrentStory();
        if (!currentStory) return;
        const liked = engine.toggleLike(currentStory.id);
        syncLikeUI(liked);
        showStoryToast(liked ? `Você curtiu o story de ${currentStory.author}! ❤️` : 'Curtida removida.');
      };
    }

    // Compartilhar
    const shareBtn = document.getElementById('sr-story-share-btn');
    const shareSheet = document.getElementById('sr-story-share-sheet');
    const closeShareBtn = document.getElementById('sr-btn-close-share');

    if (shareBtn && shareSheet) {
      shareBtn.onclick = (e) => {
        e.stopPropagation();
        const isOpen = shareSheet.classList.toggle('open');
        isPaused = isOpen;
        if (isOpen) renderShareDestinations();
      };
    }
    if (closeShareBtn && shareSheet) {
      closeShareBtn.onclick = (e) => {
        e.stopPropagation();
        shareSheet.classList.remove('open');
        isPaused = false;
      };
    }

    const copyBtn = document.getElementById('sr-btn-copy-link');
    if (copyBtn) {
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.origin + window.location.pathname).catch(() => {});
        }
        if (shareSheet) shareSheet.classList.remove('open');
        isPaused = false;
        showStoryToast('Link do story copiado! 🔗');
      };
    }

    // Resposta
    const replyForm = document.getElementById('sr-story-reply-form');
    const replyInput = document.getElementById('sr-story-reply-input');

    if (replyInput) {
      replyInput.onfocus = () => pauseTimer();
      replyInput.onblur = () => resumeTimer();
    }

    if (replyForm && replyInput) {
      replyForm.onsubmit = (e) => {
        e.preventDefault();
        const text = replyInput.value.trim();
        if (!text) return;
        const currentStory = getCurrentStory();
        if (!currentStory) return;
        replyInput.value = '';
        replyInput.blur();
        resumeTimer();

        engine.replyToStory(currentStory, text);
        showStoryToast(`Resposta enviada para ${currentStory.author} no Direct! 🚀`);
      };
    }
  }

  function pauseTimer() {
    isPaused = true;
  }

  function resumeTimer() {
    const shareSheet = document.getElementById('sr-story-share-sheet');
    const replyInput = document.getElementById('sr-story-reply-input');
    if ((shareSheet && shareSheet.classList.contains('open')) || document.activeElement === replyInput) {
      return;
    }
    isPaused = false;
  }

  function renderShareDestinations() {
    const list = document.getElementById('sr-story-share-list');
    if (!list) return;
    list.innerHTML = '';

    const destinations = [
      { key: 'lucas', name: 'Lucas', avatar: '../../../assets/images/avatar-lucas.png' },
      { key: 'ana', name: 'Ana', avatar: '../../../assets/images/avatar-ana.png' },
      { key: 'rafael', name: 'Rafael', avatar: '../../../assets/images/avatar-rafael.png' },
      { key: 'carol', name: 'Carol', avatar: '../../../assets/images/avatar-carol.png' },
      { key: 'matheus', name: 'Matheus', avatar: '../../../assets/images/avatar-matheus.png' }
    ];

    if (window.SocialRatsUser && window.SocialRatsUser.dm && window.SocialRatsUser.dm.getGroups) {
      const groups = window.SocialRatsUser.dm.getGroups();
      groups.forEach((g) => {
        destinations.push({
          key: g.id,
          name: g.name,
          avatar: g.photo || window.SocialRatsUser.DEFAULT_AVATAR
        });
      });
    }

    destinations.forEach((dest) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sr-share-dest-btn';
      btn.innerHTML = `<img src="${dest.avatar}" alt="${dest.name}"><span>${dest.name}</span>`;
      btn.onclick = (e) => {
        e.stopPropagation();
        const currentStory = getCurrentStory();
        engine.shareStory(currentStory, dest.key, dest.name);
        document.getElementById('sr-story-share-sheet')?.classList.remove('open');
        isPaused = false;
        showStoryToast(`Story compartilhado com ${dest.name} no Direct!`);
      };
      list.appendChild(btn);
    });
  }

  function syncLikeUI(isLiked) {
    const likeBtn = document.getElementById('sr-story-like-btn');
    if (!likeBtn) return;
    likeBtn.classList.toggle('liked', isLiked);
    const icon = likeBtn.querySelector('i');
    if (icon) {
      icon.className = isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
  }

  function showStoryToast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    let toast = document.getElementById('sr-story-toast-pill');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sr-story-toast-pill';
      toast.style.cssText =
        'position:fixed;top:28px;left:50%;transform:translateX(-50%);background:#1f1a2e;border:1px solid rgba(255,50,184,0.4);color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:600;z-index:999999;box-shadow:0 10px 30px rgba(0,0,0,0.8);display:flex;align-items:center;gap:8px;opacity:0;transition:opacity 0.2s ease;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2800);
  }

  function getCurrentAccount() {
    return activeAccounts[currentAccountIndex] || null;
  }

  function getCurrentStory() {
    const acc = getCurrentAccount();
    if (!acc || !acc.stories || !acc.stories.length) return null;
    return acc.stories[currentStoryIndex] || acc.stories[0];
  }

  /**
   * Constrói as barras de progresso especificamente para a CONTA ATUAL
   * Ex: Se Lucas postou 2 stories -> 2 barras
   *     Se rijalxp postou 1 story -> 1 barra
   */
  function buildProgressSegmentsForCurrentAccount() {
    const bar = document.getElementById('sr-story-progress-bar');
    if (!bar) return;
    const acc = getCurrentAccount();
    if (!acc || !acc.stories) {
      bar.innerHTML = '';
      return;
    }

    bar.innerHTML = acc.stories
      .map(
        (_, idx) => `
        <div class="sr-story-progress-segment">
          <div class="sr-story-progress-fill" id="sr-story-seg-${idx}"></div>
        </div>
      `
      )
      .join('');
  }

  function renderCurrentStory(shouldRebuildSegments = false) {
    const acc = getCurrentAccount();
    if (!acc) {
      engine.close();
      return;
    }

    if (currentStoryIndex < 0) currentStoryIndex = 0;
    if (currentStoryIndex >= acc.stories.length) {
      // Direct e Perfil: terminam na própria conta
      if (activeContext === 'direct' || activeContext === 'profile') {
        engine.close();
        return;
      }

      // Contexto Feed: passa para a próxima conta com stories não visualizados
      if (currentAccountIndex < activeAccounts.length - 1) {
        currentAccountIndex++;
        currentStoryIndex = 0;
        buildProgressSegmentsForCurrentAccount();
        renderCurrentStory(false);
      } else {
        engine.close();
      }
      return;
    }

    if (shouldRebuildSegments) {
      buildProgressSegmentsForCurrentAccount();
    }

    const story = acc.stories[currentStoryIndex];
    progressPercent = 0;
    isPaused = false;

    // Registra visualização individual deste Story
    engine.markAsViewed(story.id);

    // Atualiza cabeçalho com informações do autor do story
    const authorAvatar = document.getElementById('sr-story-author-avatar');
    const authorWrap = document.getElementById('sr-story-author-avatar-wrap');
    const authorName = document.getElementById('sr-story-author-name');
    const authorTime = document.getElementById('sr-story-author-time');
    const mediaImg = document.getElementById('sr-story-media-img');
    const captionEl = document.getElementById('sr-story-caption');
    const replyInput = document.getElementById('sr-story-reply-input');

    if (authorAvatar) authorAvatar.src = acc.avatar;
    if (authorWrap) authorWrap.classList.toggle('viewed', engine.isAccountFullyViewed(acc.key));
    if (authorName) authorName.textContent = acc.author;
    if (authorTime) authorTime.textContent = story.time || 'Recente';
    if (mediaImg) mediaImg.src = story.media;

    if (captionEl) {
      if (story.caption) {
        captionEl.textContent = story.caption;
        captionEl.style.display = 'block';
      } else {
        captionEl.style.display = 'none';
      }
    }

    if (replyInput) {
      replyInput.value = '';
      replyInput.placeholder = acc.isYourStory ? 'Adicionar nota ao seu story...' : `Responder a ${acc.author}...`;
    }

    syncLikeUI(engine.isLiked(story.id));

    // Atualiza preenchimento das barras de progresso da conta atual
    acc.stories.forEach((_, idx) => {
      const fill = document.getElementById(`sr-story-seg-${idx}`);
      if (!fill) return;
      if (idx < currentStoryIndex) {
        fill.style.width = '100%';
      } else {
        fill.style.width = '0%';
      }
    });

    startStoryTimer();
  }

  function startStoryTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const activeFill = document.getElementById(`sr-story-seg-${currentStoryIndex}`);

    timerInterval = setInterval(() => {
      if (isPaused) return;
      progressPercent += 2;
      if (activeFill) activeFill.style.width = progressPercent + '%';
      if (progressPercent >= 100) {
        clearInterval(timerInterval);
        engine.next();
      }
    }, 100); // 5 segundos por story
  }

  /**
   * Abre o visualizador com navegação inteligente baseada em CONTEXTO:
   * - context = 'direct': Exclusivo do contato (não avança para outros contatos)
   * - context = 'profile': Exclusivo do perfil (não avança para outros usuários)
   * - context = 'feed': Sequência entre contas com stories não visualizados
   */
  engine.open = function (startKeyOrId, context) {
    ensureViewerModal();

    activeContext = context || detectContext();
    const allAccounts = engine.getActiveAccounts();
    if (!allAccounts.length) return;

    let targetAccIdx = -1;
    let targetStoryIdx = 0;

    const clean = String(startKeyOrId || '').toLowerCase().replace(/^@/, '');
    if (clean) {
      targetAccIdx = allAccounts.findIndex((acc) => {
        if (acc.key.toLowerCase() === clean) return true;
        if (acc.author.toLowerCase() === clean) return true;
        if ((clean === 'me' || clean === 'your story') && acc.key === 'your-story') return true;
        if (clean === 'gabriel silva' && (acc.key === 'gabriel' || acc.key === 'your-story')) return true;
        return acc.stories.some((s) => s.id.toLowerCase() === clean);
      });
    }

    if (targetAccIdx === -1) {
      targetAccIdx = 0;
    }

    const startAccount = allAccounts[targetAccIdx];

    // Identifica story inicial dentro da conta
    const matchedStoryIdx = startAccount.stories.findIndex((s) => s.id.toLowerCase() === clean);
    if (matchedStoryIdx !== -1) {
      targetStoryIdx = matchedStoryIdx;
    } else {
      // Inicia no primeiro story ainda não visualizado, ou no 0 caso todos já tenham sido vistos
      const firstUnviewed = startAccount.stories.findIndex((s) => !engine.isStoryViewed(s.id));
      targetStoryIdx = firstUnviewed !== -1 ? firstUnviewed : 0;
    }

    if (activeContext === 'direct' || activeContext === 'profile') {
      // ══════════════════════════════════════════════════════════════
      // CONTEXTO DIRECT & PERFIL:
      // Exibe EXCLUSIVAMENTE os stories desta conta.
      // NÃO avança automaticamente para stories de outros contatos!
      // ══════════════════════════════════════════════════════════════
      activeAccounts = [startAccount];
      currentAccountIndex = 0;
      currentStoryIndex = targetStoryIdx;
    } else {
      // ══════════════════════════════════════════════════════════════
      // CONTEXTO FEED:
      // Inicia na conta selecionada (mesmo que já vista pelo toque manual).
      // Para as contas seguintes da sequência do Feed:
      // INCLUI APENAS contas que possuem stories NÃO visualizados!
      // (Contas já visualizadas NÃO são incluídas na sequência automática)
      // ══════════════════════════════════════════════════════════════
      const feedQueue = [startAccount];

      // Contas seguintes na lista
      for (let i = targetAccIdx + 1; i < allAccounts.length; i++) {
        const candidate = allAccounts[i];
        if (engine.hasUnviewedStories(candidate.key)) {
          feedQueue.push(candidate);
        }
      }

      // Contas anteriores na lista que ainda não foram vistas
      for (let i = 0; i < targetAccIdx; i++) {
        const candidate = allAccounts[i];
        if (engine.hasUnviewedStories(candidate.key)) {
          feedQueue.push(candidate);
        }
      }

      activeAccounts = feedQueue;
      currentAccountIndex = 0;
      currentStoryIndex = targetStoryIdx;
    }

    buildProgressSegmentsForCurrentAccount();
    modalEl.classList.add('active');
    renderCurrentStory(false);
  };

  engine.next = function () {
    const acc = getCurrentAccount();
    if (!acc) {
      engine.close();
      return;
    }

    // Se a conta atual ainda tem mais stories
    if (currentStoryIndex < acc.stories.length - 1) {
      currentStoryIndex++;
      renderCurrentStory(false);
    } else {
      // Chegou ao fim dos stories da conta atual
      if (activeContext === 'direct' || activeContext === 'profile') {
        // Direct e Perfil: NÃO avançam para outros contatos/perfis. Encerram aqui.
        engine.close();
      } else {
        // Contexto Feed: passa para o próximo usuário com stories não visualizados
        if (currentAccountIndex < activeAccounts.length - 1) {
          currentAccountIndex++;
          currentStoryIndex = 0;
          buildProgressSegmentsForCurrentAccount();
          renderCurrentStory(false);
        } else {
          // Finalizou a fila do Feed
          engine.close();
        }
      }
    }
  };

  engine.prev = function () {
    // Se não estiver no primeiro story da conta atual
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      renderCurrentStory(false);
    } else {
      if (activeContext === 'direct' || activeContext === 'profile') {
        // Direct e Perfil: não voltam para outros contatos. Reiniciam o story 0.
        renderCurrentStory(false);
      } else {
        // Contexto Feed: volta para o último story da conta anterior na fila
        if (currentAccountIndex > 0) {
          currentAccountIndex--;
          const prevAcc = activeAccounts[currentAccountIndex];
          currentStoryIndex = prevAcc.stories.length - 1;
          buildProgressSegmentsForCurrentAccount();
          renderCurrentStory(false);
        } else {
          renderCurrentStory(false);
        }
      }
    }
  };

  engine.close = function () {
    if (timerInterval) clearInterval(timerInterval);
    isPaused = false;
    if (modalEl) {
      modalEl.classList.remove('active');
      document.getElementById('sr-story-share-sheet')?.classList.remove('open');
    }
    engine.syncAllStoryElements();
  };

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }

  // Inicialização Automática e Sincronização em Todas as Páginas
  document.addEventListener('DOMContentLoaded', () => {
    ensureViewerModal();
    engine.syncAllStoryElements();
  });

  window.addEventListener('pageshow', () => {
    engine.syncAllStoryElements();
  });

  window.addEventListener('sr:stories-updated', () => {
    engine.syncAllStoryElements();
  });

  window.SocialRatsStories = engine;
})(window);
