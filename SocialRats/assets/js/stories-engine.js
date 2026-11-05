/**
 * ═══════════════════════════════════════════════════════════════
 * SOCIALRATS UNIFIED STORIES ENGINE (DESIGN_SYSTEM.MD COMPLIANT)
 * ═══════════════════════════════════════════════════════════════
 * Centraliza e padroniza os Stories em todo o SocialRats:
 * - CRIAÇÃO E PUBLICAÇÃO COMPLETA DE STORIES:
 *     * Câmera real do dispositivo (getUserMedia) com fotos e gravação de vídeos (MediaRecorder).
 *     * Seleção de fotos e vídeos da galeria com validação de tipo e tamanho.
 *     * Editor integrado com texto sobreposto (Aa), posicionamento, legenda e prévia.
 *     * Publicação vinculada à conta autenticada com Rat Points (+10) e avanço do foguinho.
 * - VISUALIZAÇÃO E NAVEGAÇÃO CONTEXTUAL (INSTAGRAM-LIKE):
 *     * Suporte nativo a imagens e vídeos no visualizador.
 *     * CONTEXTO DIRECT: Exclusivo do contato (sem avançar para terceiros).
 *     * CONTEXTO PERFIL: Exclusivo do perfil do autor.
 *     * CONTEXTO FEED: Fila automática inteligente de stories NÃO visualizados.
 * - PERSISTÊNCIA E DESIGN SYSTEM:
 *     * Expiração automática de 24 horas por story.
 *     * Anel gradiente vibrante (--sr-story-gradient) para novidades e anel cinza (#4b4958) para vistos.
 *     * Sem stories ativos = sem anel em volta do avatar.
 */

(function (window) {
  'use strict';

  const VIEWED_STORAGE_KEY = 'socialrats_viewed_stories_v2';
  const LIKES_STORAGE_KEY = 'socialrats_story_likes_v2';
  const USER_STORIES_STORAGE_KEY = 'socialrats_user_stories_v2';
  const PROFILE_STORAGE_KEY = 'socialrats_profile_data';
  const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Obtém os dados centralizados do usuário autenticado no SocialRats
   */
  function getLoggedUserProfile() {
    if (window.SocialRatsUser && typeof window.SocialRatsUser.getProfile === 'function') {
      const p = window.SocialRatsUser.getProfile();
      if (p && p.avatar) {
        return {
          name: p.name || 'Gabriel Silva',
          handle: p.handle || '@gabriel',
          handleClean: p.handleClean || 'gabriel',
          avatar: p.avatar
        };
      }
    }
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.avatar) {
          return {
            name: parsed.name || 'Gabriel Silva',
            handle: parsed.handle || '@gabriel',
            handleClean: (parsed.handle || 'gabriel').replace(/^@/, ''),
            avatar: parsed.avatar
          };
        }
      }
    } catch (e) {}
    return {
      name: 'Gabriel Silva',
      handle: '@gabriel',
      handleClean: 'gabriel',
      avatar: '../../../assets/images/avatar-your-story.png'
    };
  }

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
          mediaType: 'image',
          caption: 'Treino de costas e bíceps na arena! Foco na evolução constante 🚀🔥',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          time: '2h atrás'
        },
        {
          id: 'story-lucas-2',
          media: '../../../assets/images/challenges.jpg',
          mediaType: 'image',
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
          mediaType: 'image',
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
          mediaType: 'image',
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
          mediaType: 'image',
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
          mediaType: 'image',
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
          mediaType: 'image',
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
          mediaType: 'image',
          caption: 'Progresso diário > Perfeição momentânea.',
          createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
          time: '14h atrás'
        },
        {
          id: 'story-broyin-2',
          media: '../../../assets/images/post-sunset.png',
          mediaType: 'image',
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
          mediaType: 'image',
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
          mediaType: 'image',
          caption: 'Treino de alta intensidade concluído! ⚡',
          createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
          time: '18h atrás'
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

  // Armazenamento de stories reais criados pelo usuário logado
  function getUserStories() {
    try {
      const arr = JSON.parse(localStorage.getItem(USER_STORIES_STORAGE_KEY) || '[]');
      const now = Date.now();
      const logged = getLoggedUserProfile();

      const valid = arr.filter((item) => now - new Date(item.createdAt).getTime() < EXPIRATION_MS);

      // Garante que stories existentes reflitam a foto e nome mais recentes da conta logada
      let updated = false;
      valid.forEach((s) => {
        if (s.avatar !== logged.avatar || s.author !== logged.name) {
          s.avatar = logged.avatar;
          s.author = logged.name;
          updated = true;
        }
      });
      if (updated || valid.length !== arr.length) {
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
    getLoggedUserProfile() {
      return getLoggedUserProfile();
    },

    getActiveAccounts() {
      const now = Date.now();
      const accounts = [];
      const loggedProfile = getLoggedUserProfile();

      // 1. Stories reais do usuário logado
      const userStories = getUserStories();
      if (userStories.length > 0) {
        accounts.push({
          key: 'your-story',
          userKey: 'your-story',
          author: loggedProfile.name || 'Você',
          avatar: loggedProfile.avatar,
          isYourStory: true,
          stories: userStories.map((s, idx) => ({
            id: s.id || `story-me-${idx}`,
            media: s.media,
            mediaType: s.mediaType || (s.media && s.media.startsWith('data:video') ? 'video' : 'image'),
            caption: s.caption || '',
            textOverlay: s.textOverlay || null,
            createdAt: s.createdAt,
            time: s.time || 'Recente',
            author: loggedProfile.name || 'Você',
            avatar: loggedProfile.avatar,
            userKey: 'your-story',
            isYourStory: true
          }))
        });
      }

      // 2. Contas base
      const loggedHandle = (loggedProfile.handleClean || '').toLowerCase();
      BASE_ACCOUNTS.forEach((acc) => {
        if (acc.key === loggedHandle || (loggedHandle === 'gabriel' && acc.key === 'gabriel')) {
          return;
        }
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

    findAccount(keyOrId) {
      if (!keyOrId) return null;
      const clean = String(keyOrId).toLowerCase().replace(/^@/, '');
      const loggedProfile = getLoggedUserProfile();
      const loggedHandle = (loggedProfile.handleClean || '').toLowerCase();
      const loggedName = (loggedProfile.name || '').toLowerCase();
      const accounts = engine.getActiveAccounts();

      return (
        accounts.find((acc) => {
          if (acc.key.toLowerCase() === clean) return true;
          if (acc.author.toLowerCase() === clean) return true;
          if ((clean === 'me' || clean === 'your story' || clean === 'your-story') && acc.isYourStory) return true;
          if (loggedHandle && clean === loggedHandle && acc.isYourStory) return true;
          if (loggedName && clean === loggedName && acc.isYourStory) return true;
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
      const logged = getLoggedUserProfile();
      if (clean === 'your-story' || clean === 'me' || clean === 'your story' || clean === logged.handleClean) {
        return getUserStories().length > 0;
      }
      return Boolean(engine.findAccount(clean));
    },

    isStoryViewed(storyId) {
      if (!storyId) return false;
      const map = getViewedMap();
      const viewedAt = map[storyId];
      if (!viewedAt) return false;
      return Date.now() - viewedAt < EXPIRATION_MS;
    },

    isAccountFullyViewed(keyOrId) {
      const acc = engine.findAccount(keyOrId);
      if (!acc || !acc.stories.length) return false;
      return acc.stories.every((s) => engine.isStoryViewed(s.id));
    },

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

    /**
     * Publica um Story real criado pelo usuário autenticado
     */
    publishUserStory(mediaUrl, caption = '', textOverlay = null, mediaType = 'image') {
      const logged = getLoggedUserProfile();
      const stories = getUserStories();

      const newStory = {
        id: 'story-user-' + Date.now().toString(36),
        media: mediaUrl,
        mediaType: mediaType || 'image',
        caption: String(caption || '').trim(),
        textOverlay: textOverlay || null,
        createdAt: new Date().toISOString(),
        time: 'Agora',
        author: logged.name || 'Você',
        avatar: logged.avatar,
        userKey: 'your-story',
        isYourStory: true
      };

      stories.unshift(newStory);
      saveUserStories(stories);

      // Limpa marcação de visto para este novo story
      const map = getViewedMap();
      delete map[newStory.id];
      delete map['your-story'];
      saveViewedMap(map);

      // Registra métrica com Rat Points (+10) e avanço do foguinho
      let pointsBonusText = '';
      if (window.SocialRatsMetrics) {
        const res = window.SocialRatsMetrics.recordActivity('STORY_PUBLISHED', {
          targetId: newStory.id,
          label: 'Story publicado no SocialRats'
        });
        if (res && res.awarded) {
          pointsBonusText = ` (+${res.pointsAdded} Rat Points · ${res.multiplierLabel})`;
        }
      }

      engine.syncAllStoryElements();
      window.dispatchEvent(new CustomEvent('sr:stories-updated'));
      return { story: newStory, pointsBonusText };
    },

    publishMyStory(mediaUrl, caption, textOverlay, mediaType) {
      return engine.publishUserStory(mediaUrl, caption, textOverlay, mediaType);
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
              ${
                story.mediaType === 'video'
                  ? `<video src="${story.media}" style="width:100%; height:130px; object-fit:cover; border-radius:10px; margin-bottom:6px; display:block;" muted autoplay loop></video>`
                  : `<img src="${story.media}" style="width:100%; height:130px; object-fit:cover; border-radius:10px; margin-bottom:6px; display:block;">`
              }
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
      const loggedProfile = getLoggedUserProfile();

      // 1. Carrossel de Stories do Feed (.story-item[data-story-id])
      document.querySelectorAll('.story-item[data-story-id]').forEach((el) => {
        const id = el.getAttribute('data-story-id');
        const isMe = id === 'your-story';
        const has = engine.hasStory(id);
        const fullyViewed = has && engine.isAccountFullyViewed(id);
        el.classList.toggle('story-viewed', fullyViewed);

        const wrap = el.querySelector('.story-avatar-wrap');
        if (wrap) {
          wrap.classList.toggle('has-story', has);
          wrap.classList.toggle('story-viewed', fullyViewed);
        }

        if (isMe) {
          const img = el.querySelector('.story-avatar-img');
          if (img && loggedProfile.avatar) {
            img.src = loggedProfile.avatar;
            img.alt = loggedProfile.name || 'Seu Story';
          }
        }
      });

      // 2. Carrossel de Conexões do Direct (.connection-item)
      document.querySelectorAll('.connection-item').forEach((item) => {
        const userKey =
          item.getAttribute('data-story-user') ||
          (item.classList.contains('your-story') ? 'your-story' : '');
        if (!userKey) return;
        const isMe = userKey === 'your-story';
        const has = engine.hasStory(userKey);
        const fullyViewed = has && engine.isAccountFullyViewed(userKey);

        const wrap = item.querySelector('.connection-avatar-wrap');
        if (wrap) {
          wrap.classList.toggle('has-story', has);
          wrap.classList.toggle('story-viewed', fullyViewed);
        }
        item.classList.toggle('story-viewed', fullyViewed);

        if (isMe) {
          const img = item.querySelector('.connection-avatar-img');
          if (img && loggedProfile.avatar) {
            img.src = loggedProfile.avatar;
            img.alt = loggedProfile.name || 'Seu Story';
          }
        }
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
        const profUser = urlParams.get('user') || 'your-story';
        const has = engine.hasStory(profUser) || engine.hasStory('your-story');
        const targetKey = engine.hasStory(profUser) ? profUser : 'your-story';
        const fullyViewed = has && engine.isAccountFullyViewed(targetKey);
        profileWrap.classList.toggle('has-story', has);
        profileWrap.classList.toggle('story-viewed', fullyViewed);
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * ESTILOS GERAIS DO ENGINE (VIEWER + CRIADOR + EDITOR)
   * ═══════════════════════════════════════════════════════════════ */
  function injectAllStyles() {
    if (document.getElementById('sr-stories-combined-styles')) return;
    const style = document.createElement('style');
    style.id = 'sr-stories-combined-styles';
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

      /* Overlays Fullscreen */
      .sr-story-overlay,
      .sr-creator-overlay {
        position: fixed;
        inset: 0;
        background: rgba(5, 4, 9, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.22s ease;
      }

      .sr-story-overlay.active,
      .sr-creator-overlay.active {
        display: flex;
        opacity: 1;
      }

      /* Cartões Centrais Proporcionais (9:16 mobile friendly) */
      .sr-story-card,
      .sr-creator-card {
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
        .sr-story-card,
        .sr-creator-card {
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
          border: none;
        }
      }

      /* Barras de Progresso no Topo do Viewer */
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

      /* Top Header do Viewer */
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

      /* Mídia Central do Viewer */
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

      .sr-story-img,
      .sr-story-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        pointer-events: none;
      }

      /* Zonas de Toque Laterais */
      .sr-story-tap-zone {
        position: absolute;
        top: 0;
        bottom: 80px;
        width: 40%;
        z-index: 20;
        cursor: pointer;
        background: transparent;
      }

      .sr-story-tap-zone.prev { left: 0; }
      .sr-story-tap-zone.next { right: 0; }

      /* Legenda e Texto Sobreposto no Viewer */
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

      .sr-story-text-badge {
        position: absolute;
        max-width: 85%;
        padding: 10px 18px;
        background: rgba(14, 11, 23, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        color: #ffffff;
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
        z-index: 26;
        word-break: break-word;
        pointer-events: none;
      }

      .sr-story-text-badge.pos-top { top: 22%; left: 50%; transform: translateX(-50%); }
      .sr-story-text-badge.pos-center { top: 48%; left: 50%; transform: translate(-50%, -50%); }
      .sr-story-text-badge.pos-bottom { bottom: 22%; left: 50%; transform: translateX(-50%); }

      /* Barra Inferior do Viewer */
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
      }

      .sr-story-share-sheet.open { display: flex; }

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
      }

      .sr-share-dest-btn {
        background: transparent;
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        color: #b7b0c5;
        font-size: 11px;
        min-width: 58px;
      }

      .sr-share-dest-btn img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid #30263e;
      }

      .sr-copy-link-btn {
        width: 100%;
        height: 40px;
        border-radius: 12px;
        background: #1c1728;
        border: 1px solid #30263e;
        color: #ffffff;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
      }

      /* ═══════════════════════════════════════════════════════════════
       * ESTILOS DO CRIADOR & EDITOR DE STORIES
       * ═══════════════════════════════════════════════════════════════ */
      .sr-creator-screen {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        background: #090710;
      }

      .sr-creator-topbar {
        position: absolute;
        top: 18px;
        left: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 60;
      }

      .sr-creator-icon-btn {
        background: rgba(14, 11, 23, 0.7);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #ffffff;
        font-size: 18px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease, background 0.15s ease;
      }

      .sr-creator-icon-btn:hover {
        background: rgba(255, 50, 184, 0.35);
        transform: scale(1.06);
      }

      .sr-creator-top-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .sr-creator-tool-btn {
        background: rgba(14, 11, 23, 0.75);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #ffffff;
        font-family: var(--font-body, 'Inter', sans-serif);
        font-size: 12.5px;
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
      }

      .sr-creator-tool-btn:hover {
        background: rgba(255, 50, 184, 0.25);
        border-color: #ff32b8;
      }

      /* Viewport da Câmera */
      .sr-camera-viewport,
      .sr-editor-viewport {
        flex: 1;
        width: 100%;
        height: 100%;
        position: relative;
        background: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      #sr-camera-stream {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .sr-editor-media-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .sr-screen-flash {
        position: absolute;
        inset: 0;
        background: #ffffff;
        opacity: 0;
        pointer-events: none;
        z-index: 55;
        transition: opacity 0.12s ease;
      }

      .sr-screen-flash.active {
        opacity: 0.9;
      }

      /* Timer de Gravação de Vídeo */
      .sr-recording-badge {
        position: absolute;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(230, 20, 50, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 9999px;
        padding: 6px 14px;
        color: #ffffff;
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 58;
        box-shadow: 0 4px 16px rgba(230, 20, 50, 0.6);
      }

      .sr-rec-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #ffffff;
        animation: recPulse 0.9s infinite alternate ease-in-out;
      }

      @keyframes recPulse {
        from { transform: scale(0.8); opacity: 0.5; }
        to { transform: scale(1.2); opacity: 1; }
      }

      /* Fallback de Câmera */
      .sr-camera-fallback {
        position: absolute;
        inset: 20px;
        background: #14111e;
        border: 1px solid #30263e;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 24px;
        text-align: center;
        z-index: 50;
      }

      .sr-fallback-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(255, 50, 184, 0.15);
        color: #ff32b8;
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        border: 1px solid rgba(255, 50, 184, 0.4);
      }

      .sr-camera-fallback h3 {
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 8px;
      }

      .sr-camera-fallback p {
        font-size: 13px;
        color: #b7b0c5;
        line-height: 1.45;
        margin-bottom: 22px;
      }

      .sr-creator-cta-btn {
        background: var(--gradient-brand, #ff32b8);
        border: none;
        color: #ffffff;
        font-family: var(--font-body, 'Inter', sans-serif);
        font-size: 14px;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(255, 50, 184, 0.35);
      }

      /* Barra Inferior da Câmera (Shutter & Galeria) */
      .sr-creator-bottombar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px 24px 28px;
        background: linear-gradient(to top, rgba(7, 5, 12, 0.95) 0%, rgba(7, 5, 12, 0.6) 60%, transparent 100%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 60;
      }

      .sr-gallery-picker-btn {
        background: rgba(28, 23, 40, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 14px;
        color: #ffffff;
        width: 60px;
        height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        font-size: 10px;
        font-weight: 600;
        backdrop-filter: blur(8px);
        transition: transform 0.15s ease, border-color 0.15s ease;
      }

      .sr-gallery-picker-btn i {
        font-size: 20px;
      }

      .sr-gallery-picker-btn:hover {
        transform: scale(1.05);
        border-color: #ff32b8;
      }

      .sr-shutter-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }

      .sr-shutter-btn {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        background: transparent;
        border: 4px solid #ffffff;
        padding: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease, border-color 0.15s ease;
      }

      .sr-shutter-btn:hover {
        transform: scale(1.06);
        border-color: #ff32b8;
      }

      .sr-shutter-btn.recording {
        border-color: #ff2b4e;
        animation: shutterRecPulse 1s infinite alternate ease-in-out;
      }

      @keyframes shutterRecPulse {
        from { transform: scale(1); }
        to { transform: scale(1.12); }
      }

      .sr-shutter-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: var(--gradient-story);
        display: block;
        transition: border-radius 0.2s ease, background 0.2s ease;
      }

      .sr-shutter-btn.recording .sr-shutter-inner {
        background: #ff2b4e;
        border-radius: 10px;
        width: 65%;
        height: 65%;
      }

      .sr-shutter-hint {
        font-size: 10.5px;
        color: rgba(255, 255, 255, 0.7);
        text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      }

      /* Texto Sobreposto no Editor */
      .sr-editor-text-overlay {
        position: absolute;
        max-width: 85%;
        padding: 10px 18px;
        background: rgba(14, 11, 23, 0.9);
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        border-radius: 16px;
        color: #ffffff;
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 17px;
        font-weight: 700;
        text-align: center;
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8);
        z-index: 55;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .sr-editor-text-overlay.pos-top { top: 22%; left: 50%; transform: translateX(-50%); }
      .sr-editor-text-overlay.pos-center { top: 48%; left: 50%; transform: translate(-50%, -50%); }
      .sr-editor-text-overlay.pos-bottom { bottom: 22%; left: 50%; transform: translateX(-50%); }

      .sr-overlay-text-remove {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #fff;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        cursor: pointer;
      }

      /* Dialog Modal para Editar Texto */
      .sr-text-input-dialog {
        position: absolute;
        inset: 0;
        background: rgba(7, 5, 12, 0.85);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 70;
      }

      .sr-text-dialog-card {
        width: 100%;
        max-width: 340px;
        background: #14111e;
        border: 1px solid #30263e;
        border-radius: 18px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.9);
      }

      .sr-text-dialog-card h4 {
        color: #ffffff;
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 15px;
        margin: 0;
      }

      .sr-text-dialog-card input {
        width: 100%;
        height: 44px;
        border-radius: 12px;
        background: #1c1728;
        border: 1px solid #30263e;
        color: #ffffff;
        padding: 0 14px;
        font-size: 14px;
        outline: none;
      }

      .sr-text-dialog-card input:focus {
        border-color: #ff32b8;
      }

      .sr-text-dialog-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
      }

      .sr-dialog-btn {
        padding: 8px 16px;
        border-radius: 10px;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        border: none;
      }

      .sr-dialog-btn.secondary {
        background: #1c1728;
        color: #b7b0c5;
        border: 1px solid #30263e;
      }

      .sr-dialog-btn.primary {
        background: var(--gradient-brand, #ff32b8);
        color: #ffffff;
      }

      /* Barra Inferior do Editor */
      .sr-editor-bottombar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 18px 22px;
        background: linear-gradient(to top, rgba(7, 5, 12, 0.98) 0%, rgba(7, 5, 12, 0.7) 65%, transparent 100%);
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 60;
      }

      .sr-editor-caption-wrap input {
        width: 100%;
        height: 42px;
        border-radius: 9999px;
        background: rgba(28, 23, 40, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        padding: 0 16px;
        font-size: 13.5px;
        outline: none;
      }

      .sr-editor-caption-wrap input:focus {
        border-color: #ff32b8;
      }

      .sr-editor-action-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .sr-btn-discard-draft {
        background: rgba(28, 23, 40, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #b7b0c5;
        border-radius: 9999px;
        padding: 10px 18px;
        font-size: 13px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      }

      .sr-btn-discard-draft:hover {
        color: #ffffff;
        background: rgba(28, 23, 40, 0.95);
      }

      .sr-btn-publish-story {
        flex: 1;
        background: var(--gradient-brand, #ff32b8);
        border: none;
        color: #ffffff;
        border-radius: 9999px;
        padding: 11px 20px;
        font-family: var(--font-heading, 'Outfit', sans-serif);
        font-size: 14px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(255, 50, 184, 0.4);
        transition: transform 0.15s ease;
      }

      .sr-btn-publish-story:hover {
        transform: scale(1.02);
      }

      .sr-btn-publish-story img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #ffffff;
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════════════
   * COMPONENTE CENTRALIZADO DO VISUALIZADOR DE STORIES (VIEWER)
   * ═══════════════════════════════════════════════════════════════ */
  let modalEl = null;
  let activeContext = 'feed'; // 'feed' | 'profile' | 'direct'
  let activeAccounts = [];
  let currentAccountIndex = 0;
  let currentStoryIndex = 0;
  let timerInterval = null;
  let progressPercent = 0;
  let isPaused = false;

  function ensureViewerModal() {
    injectAllStyles();
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
          <a class="sr-story-user-info" id="sr-story-user-info" href="profile.html">
            <div class="sr-story-author-avatar-wrap" id="sr-story-author-avatar-wrap">
              <img src="" alt="" class="sr-story-author-avatar" id="sr-story-author-avatar">
            </div>
            <div class="sr-story-author-col">
              <span class="sr-story-author-name" id="sr-story-author-name">Autor</span>
              <span class="sr-story-author-time" id="sr-story-author-time">Agora</span>
            </div>
          </a>
          <button type="button" class="sr-btn-close-story" id="sr-btn-close-story" aria-label="Fechar história">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Mídia Central (Imagem ou Vídeo) -->
        <div class="sr-story-body">
          <div class="sr-story-tap-zone prev" id="sr-tap-prev" aria-label="Story anterior"></div>
          <img src="" alt="Story" class="sr-story-img" id="sr-story-media-img">
          <video class="sr-story-video" id="sr-story-media-video" playsinline muted style="display:none;"></video>
          <div class="sr-story-tap-zone next" id="sr-tap-next" aria-label="Próximo story"></div>

          <!-- Texto Sobreposto e Legenda -->
          <div class="sr-story-text-badge pos-center" id="sr-story-text-overlay" style="display:none;"></div>
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
    const mediaVideo = document.getElementById('sr-story-media-video');
    if (mediaVideo && !mediaVideo.paused) {
      mediaVideo.pause();
    }
  }

  function resumeTimer() {
    const shareSheet = document.getElementById('sr-story-share-sheet');
    const replyInput = document.getElementById('sr-story-reply-input');
    if ((shareSheet && shareSheet.classList.contains('open')) || document.activeElement === replyInput) {
      return;
    }
    isPaused = false;
    const mediaVideo = document.getElementById('sr-story-media-video');
    if (mediaVideo && mediaVideo.paused && mediaVideo.style.display !== 'none') {
      mediaVideo.play().catch(() => {});
    }
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
      if (activeContext === 'direct' || activeContext === 'profile') {
        engine.close();
        return;
      }

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

    // Dados da conta e do autor
    const loggedProfile = getLoggedUserProfile();
    const currentAvatar = acc.isYourStory ? loggedProfile.avatar : (story.avatar || acc.avatar);
    const currentAuthor = acc.isYourStory ? (loggedProfile.name || 'Você') : acc.author;

    const authorAvatar = document.getElementById('sr-story-author-avatar');
    const authorWrap = document.getElementById('sr-story-author-avatar-wrap');
    const authorName = document.getElementById('sr-story-author-name');
    const authorTime = document.getElementById('sr-story-author-time');
    const userInfoEl = document.getElementById('sr-story-user-info');
    const mediaImg = document.getElementById('sr-story-media-img');
    const mediaVideo = document.getElementById('sr-story-media-video');
    const captionEl = document.getElementById('sr-story-caption');
    const textOverlayEl = document.getElementById('sr-story-text-overlay');
    const replyInput = document.getElementById('sr-story-reply-input');

    if (authorAvatar) {
      authorAvatar.src = currentAvatar;
      authorAvatar.alt = currentAuthor;
    }
    if (authorWrap) {
      authorWrap.classList.toggle('viewed', engine.isAccountFullyViewed(acc.key));
    }
    if (authorName) {
      authorName.textContent = currentAuthor;
    }
    if (authorTime) {
      authorTime.textContent = story.time || 'Recente';
    }
    if (userInfoEl) {
      userInfoEl.href = acc.isYourStory ? 'profile.html' : `profile.html?user=${encodeURIComponent(acc.key)}`;
    }

    // Suporte inteligente a Imagem vs. Vídeo
    const isVideo =
      story.mediaType === 'video' ||
      (story.media && (story.media.startsWith('data:video') || /\.(mp4|webm|mov)(\?.*)?$/i.test(story.media)));

    if (isVideo) {
      if (mediaImg) mediaImg.style.display = 'none';
      if (mediaVideo) {
        mediaVideo.style.display = 'block';
        mediaVideo.src = story.media;
        mediaVideo.currentTime = 0;
        mediaVideo.play().catch(() => {});
        mediaVideo.onended = () => engine.next();
      }
    } else {
      if (mediaVideo) {
        mediaVideo.pause();
        mediaVideo.style.display = 'none';
        mediaVideo.src = '';
      }
      if (mediaImg) {
        mediaImg.style.display = 'block';
        mediaImg.src = story.media;
      }
    }

    // Texto Sobreposto do Editor
    if (textOverlayEl) {
      if (story.textOverlay && story.textOverlay.text) {
        textOverlayEl.textContent = story.textOverlay.text;
        textOverlayEl.className = `sr-story-text-badge pos-${story.textOverlay.position || 'center'}`;
        textOverlayEl.style.display = 'block';
      } else {
        textOverlayEl.style.display = 'none';
      }
    }

    // Legenda
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

    // Atualiza barras de progresso
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

  engine.open = function (startKeyOrId, context) {
    ensureViewerModal();

    activeContext = context || detectContext();
    const allAccounts = engine.getActiveAccounts();
    if (!allAccounts.length) return;

    let targetAccIdx = -1;
    let targetStoryIdx = 0;

    const clean = String(startKeyOrId || '').toLowerCase().replace(/^@/, '');
    const logged = getLoggedUserProfile();
    const loggedHandle = (logged.handleClean || '').toLowerCase();
    const loggedName = (logged.name || '').toLowerCase();

    if (clean) {
      targetAccIdx = allAccounts.findIndex((acc) => {
        if (acc.key.toLowerCase() === clean) return true;
        if (acc.author.toLowerCase() === clean) return true;
        if ((clean === 'me' || clean === 'your story' || clean === 'your-story') && acc.isYourStory) return true;
        if (loggedHandle && clean === loggedHandle && acc.isYourStory) return true;
        if (loggedName && clean === loggedName && acc.isYourStory) return true;
        return acc.stories.some((s) => s.id.toLowerCase() === clean);
      });
    }

    if (targetAccIdx === -1) {
      targetAccIdx = 0;
    }

    const startAccount = allAccounts[targetAccIdx];

    const matchedStoryIdx = startAccount.stories.findIndex((s) => s.id.toLowerCase() === clean);
    if (matchedStoryIdx !== -1) {
      targetStoryIdx = matchedStoryIdx;
    } else {
      const firstUnviewed = startAccount.stories.findIndex((s) => !engine.isStoryViewed(s.id));
      targetStoryIdx = firstUnviewed !== -1 ? firstUnviewed : 0;
    }

    if (activeContext === 'direct' || activeContext === 'profile') {
      activeAccounts = [startAccount];
      currentAccountIndex = 0;
      currentStoryIndex = targetStoryIdx;
    } else {
      const feedQueue = [startAccount];
      for (let i = targetAccIdx + 1; i < allAccounts.length; i++) {
        const candidate = allAccounts[i];
        if (engine.hasUnviewedStories(candidate.key)) {
          feedQueue.push(candidate);
        }
      }
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

    if (currentStoryIndex < acc.stories.length - 1) {
      currentStoryIndex++;
      renderCurrentStory(false);
    } else {
      if (activeContext === 'direct' || activeContext === 'profile') {
        engine.close();
      } else {
        if (currentAccountIndex < activeAccounts.length - 1) {
          currentAccountIndex++;
          currentStoryIndex = 0;
          buildProgressSegmentsForCurrentAccount();
          renderCurrentStory(false);
        } else {
          engine.close();
        }
      }
    }
  };

  engine.prev = function () {
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      renderCurrentStory(false);
    } else {
      if (activeContext === 'direct' || activeContext === 'profile') {
        renderCurrentStory(false);
      } else {
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
    const mediaVideo = document.getElementById('sr-story-media-video');
    if (mediaVideo) {
      mediaVideo.pause();
      mediaVideo.src = '';
    }
    if (modalEl) {
      modalEl.classList.remove('active');
      document.getElementById('sr-story-share-sheet')?.classList.remove('open');
    }
    engine.syncAllStoryElements();
  };

  /* ═══════════════════════════════════════════════════════════════
   * MÓDULO DE CRIAÇÃO E PUBLICAÇÃO DE STORIES (CÂMERA, ARQUIVO E EDITOR)
   * ═══════════════════════════════════════════════════════════════ */
  let creatorModalEl = null;
  let cameraStream = null;
  let currentFacingMode = 'user'; // 'user' (frontal) | 'environment' (traseira)
  let mediaRecorder = null;
  let recordedChunks = [];
  let recordingInterval = null;
  let recordingSeconds = 0;
  let isRecording = false;

  // Estado do rascunho em edição
  let draftMedia = null;
  let draftMediaType = 'image'; // 'image' | 'video'
  let draftTextOverlay = null; // { text: '...', position: 'center' }
  const textPositions = ['center', 'top', 'bottom'];
  let currentPosIndex = 0;

  function ensureCreatorModal() {
    injectAllStyles();
    if (document.getElementById('sr-story-creator-modal')) return;

    creatorModalEl = document.createElement('div');
    creatorModalEl.className = 'sr-creator-overlay';
    creatorModalEl.id = 'sr-story-creator-modal';
    creatorModalEl.setAttribute('role', 'dialog');
    creatorModalEl.setAttribute('aria-modal', 'true');
    creatorModalEl.setAttribute('aria-label', 'Criador de Stories SocialRats');

    creatorModalEl.innerHTML = `
      <div class="sr-creator-card" id="sr-creator-card">

        <!-- 1. TELA DE CAPTURA / CÂMERA / GALERIA -->
        <div class="sr-creator-screen" id="sr-capture-screen">
          <div class="sr-creator-topbar">
            <button type="button" class="sr-creator-icon-btn" id="sr-creator-close-btn" title="Fechar">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="sr-creator-top-actions">
              <button type="button" class="sr-creator-icon-btn" id="sr-creator-flash-btn" title="Flash da tela">
                <i class="fa-solid fa-bolt"></i>
              </button>
              <button type="button" class="sr-creator-icon-btn" id="sr-creator-flip-cam-btn" title="Alternar câmera">
                <i class="fa-solid fa-camera-rotate"></i>
              </button>
            </div>
          </div>

          <div class="sr-camera-viewport" id="sr-camera-viewport">
            <video id="sr-camera-stream" autoplay playsinline muted></video>
            <canvas id="sr-camera-canvas" style="display:none;"></canvas>
            <div id="sr-screen-flash" class="sr-screen-flash"></div>

            <!-- Timer de Gravação -->
            <div class="sr-recording-badge" id="sr-recording-badge" style="display:none;">
              <span class="sr-rec-dot"></span>
              <span id="sr-rec-timer">00:00</span> / 00:15
            </div>

            <!-- Fallback de Câmera -->
            <div class="sr-camera-fallback" id="sr-camera-fallback" style="display:none;">
              <div class="sr-fallback-icon">
                <i class="fa-solid fa-camera"></i>
              </div>
              <h3>Câmera Não Disponível</h3>
              <p id="sr-fallback-msg">Permita o acesso à câmera no navegador ou selecione uma foto/vídeo da galeria.</p>
              <button type="button" class="sr-creator-cta-btn" id="sr-btn-fallback-gallery">
                <i class="fa-regular fa-image"></i> Escolher da Galeria
              </button>
            </div>
          </div>

          <div class="sr-creator-bottombar">
            <input type="file" id="sr-creator-file-input" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" style="display:none;">
            <button type="button" class="sr-gallery-picker-btn" id="sr-btn-open-gallery" title="Escolher da Galeria">
              <i class="fa-regular fa-image"></i>
              <span>Galeria</span>
            </button>

            <div class="sr-shutter-container">
              <button type="button" class="sr-shutter-btn" id="sr-shutter-btn" title="Toque para foto, segure para vídeo">
                <span class="sr-shutter-inner" id="sr-shutter-inner"></span>
              </button>
              <div class="sr-shutter-hint" id="sr-shutter-hint">Toque p/ foto · Segure p/ vídeo</div>
            </div>

            <button type="button" class="sr-gallery-picker-btn" id="sr-btn-flip-bottom" title="Inverter câmera">
              <i class="fa-solid fa-rotate"></i>
              <span>Virar</span>
            </button>
          </div>
        </div>

        <!-- 2. TELA DO EDITOR DE STORIES -->
        <div class="sr-creator-screen" id="sr-editor-screen" style="display:none;">
          <div class="sr-creator-topbar">
            <button type="button" class="sr-creator-icon-btn" id="sr-editor-back-btn" title="Descartar e voltar">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div class="sr-creator-top-actions">
              <button type="button" class="sr-creator-tool-btn" id="sr-editor-text-btn" title="Adicionar texto">
                <i class="fa-solid fa-font"></i> <span>Texto</span>
              </button>
              <button type="button" class="sr-creator-tool-btn" id="sr-editor-pos-btn" title="Posição do texto">
                <i class="fa-solid fa-arrows-up-down"></i> <span>Posição</span>
              </button>
            </div>
          </div>

          <div class="sr-editor-viewport" id="sr-editor-viewport">
            <img id="sr-editor-img-preview" class="sr-editor-media-preview" alt="Prévia" style="display:none;">
            <video id="sr-editor-video-preview" class="sr-editor-media-preview" autoplay loop playsinline muted controls style="display:none;"></video>

            <!-- Texto sobreposto (Posicionável e Editável) -->
            <div class="sr-editor-text-overlay pos-center" id="sr-editor-text-overlay" style="display:none;">
              <span id="sr-overlay-text-content">Seu texto aqui</span>
              <button type="button" class="sr-overlay-text-remove" id="sr-remove-overlay-text" title="Remover texto">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Input dialog para editar texto -->
            <div class="sr-text-input-dialog" id="sr-text-input-dialog" style="display:none;">
              <div class="sr-text-dialog-card">
                <h4>Adicionar Texto ao Story</h4>
                <input type="text" id="sr-text-dialog-input" placeholder="Digite algo marcante..." maxlength="120" autocomplete="off">
                <div class="sr-text-dialog-actions">
                  <button type="button" class="sr-dialog-btn secondary" id="sr-btn-cancel-text">Cancelar</button>
                  <button type="button" class="sr-dialog-btn primary" id="sr-btn-confirm-text">Adicionar</button>
                </div>
              </div>
            </div>
          </div>

          <div class="sr-editor-bottombar">
            <div class="sr-editor-caption-wrap">
              <input type="text" id="sr-editor-caption-input" placeholder="Adicionar legenda ao Story..." maxlength="160" autocomplete="off">
            </div>
            <div class="sr-editor-action-row">
              <button type="button" class="sr-btn-discard-draft" id="sr-btn-discard">
                <i class="fa-regular fa-trash-can"></i> Descartar
              </button>
              <button type="button" class="sr-btn-publish-story" id="sr-btn-publish">
                <img id="sr-publish-user-avatar" src="" alt="Você">
                <span>Publicar Story</span>
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(creatorModalEl);
    setupCreatorEventListeners();
  }

  function setupCreatorEventListeners() {
    // 1. Fechar Criador
    const closeBtn = document.getElementById('sr-creator-close-btn');
    if (closeBtn) closeBtn.onclick = () => engine.closeCreator();

    // 2. Alternar Câmera
    const flipBtn = document.getElementById('sr-creator-flip-cam-btn');
    const flipBottom = document.getElementById('sr-btn-flip-bottom');
    const toggleCam = () => {
      currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
      startCamera(currentFacingMode);
    };
    if (flipBtn) flipBtn.onclick = toggleCam;
    if (flipBottom) flipBottom.onclick = toggleCam;

    // 3. Flash da tela
    const flashBtn = document.getElementById('sr-creator-flash-btn');
    const flashEl = document.getElementById('sr-screen-flash');
    if (flashBtn && flashEl) {
      flashBtn.onclick = () => {
        flashEl.classList.toggle('active');
        showStoryToast(flashEl.classList.contains('active') ? 'Flash da tela ativado ⚡' : 'Flash desativado');
      };
    }

    // 4. Galeria de Arquivos
    const galleryBtn = document.getElementById('sr-btn-open-gallery');
    const fallbackGalleryBtn = document.getElementById('sr-btn-fallback-gallery');
    const fileInput = document.getElementById('sr-creator-file-input');

    const triggerFileInput = () => {
      if (fileInput) fileInput.click();
    };
    if (galleryBtn) galleryBtn.onclick = triggerFileInput;
    if (fallbackGalleryBtn) fallbackGalleryBtn.onclick = triggerFileInput;

    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // Validação de Tamanho (Máx 35MB)
        if (file.size > 35 * 1024 * 1024) {
          showStoryToast('Arquivo muito grande! Escolha uma mídia de até 35MB.');
          return;
        }

        const isVid = file.type.startsWith('video/');
        const isImg = file.type.startsWith('image/');
        if (!isVid && !isImg) {
          showStoryToast('Formato não suportado. Escolha uma foto ou vídeo.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          stopCamera();
          openEditorWithMedia(reader.result, isVid ? 'video' : 'image');
        };
        reader.onerror = () => {
          showStoryToast('Erro ao ler o arquivo selecionado.');
        };
        reader.readAsDataURL(file);
      };
    }

    // 5. Botão Obturador / Shutter (Toque = Foto, Segurar = Gravação)
    const shutterBtn = document.getElementById('sr-shutter-btn');
    let pressTimer = null;
    let didHold = false;

    const startRecordingAction = () => {
      if (isRecording) return;
      isRecording = true;
      recordedChunks = [];
      recordingSeconds = 0;

      const video = document.getElementById('sr-camera-stream');
      const recBadge = document.getElementById('sr-recording-badge');
      const recTimer = document.getElementById('sr-rec-timer');
      if (recBadge) recBadge.style.display = 'flex';
      if (shutterBtn) shutterBtn.classList.add('recording');

      recordingInterval = setInterval(() => {
        recordingSeconds++;
        const s = String(recordingSeconds % 60).padStart(2, '0');
        const m = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
        if (recTimer) recTimer.textContent = `${m}:${s}`;
        if (recordingSeconds >= 15) {
          stopRecordingAction();
        }
      }, 1000);

      // Inicia MediaRecorder real da câmera se suportado
      if (window.MediaRecorder && cameraStream) {
        try {
          let mime = 'video/webm';
          if (MediaRecorder.isTypeSupported('video/mp4')) mime = 'video/mp4';
          mediaRecorder = new MediaRecorder(cameraStream, { mimeType: mime });
          mediaRecorder.ondataavailable = (evt) => {
            if (evt.data && evt.data.size > 0) recordedChunks.push(evt.data);
          };
          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mime });
            const reader = new FileReader();
            reader.onload = () => {
              stopCamera();
              openEditorWithMedia(reader.result, 'video');
            };
            reader.readAsDataURL(blob);
          };
          mediaRecorder.start();
        } catch (err) {
          console.warn('MediaRecorder fallback:', err);
        }
      }
    };

    const stopRecordingAction = () => {
      if (!isRecording) return;
      isRecording = false;
      if (recordingInterval) clearInterval(recordingInterval);
      const recBadge = document.getElementById('sr-recording-badge');
      if (recBadge) recBadge.style.display = 'none';
      if (shutterBtn) shutterBtn.classList.remove('recording');

      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      } else {
        // Fallback: se o dispositivo não gerou stream de vídeo, captura foto instantânea
        takeSnapshotPhoto();
      }
    };

    const takeSnapshotPhoto = () => {
      const video = document.getElementById('sr-camera-stream');
      const canvas = document.getElementById('sr-camera-canvas');
      if (!video || !canvas) return;

      const w = video.videoWidth || 720;
      const h = video.videoHeight || 1280;
      canvas.width = Math.min(w, 1080);
      canvas.height = Math.min(h, 1920);

      const ctx = canvas.getContext('2d');
      if (currentFacingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      openEditorWithMedia(dataUrl, 'image');
    };

    if (shutterBtn) {
      shutterBtn.addEventListener('mousedown', () => {
        didHold = false;
        pressTimer = setTimeout(() => {
          didHold = true;
          startRecordingAction();
        }, 400);
      });

      shutterBtn.addEventListener('mouseup', () => {
        if (pressTimer) clearTimeout(pressTimer);
        if (didHold) {
          stopRecordingAction();
        } else {
          takeSnapshotPhoto();
        }
      });

      shutterBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        didHold = false;
        pressTimer = setTimeout(() => {
          didHold = true;
          startRecordingAction();
        }, 400);
      });

      shutterBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (pressTimer) clearTimeout(pressTimer);
        if (didHold) {
          stopRecordingAction();
        } else {
          takeSnapshotPhoto();
        }
      });
    }

    // 6. Voltar do Editor para a Câmera
    const backBtn = document.getElementById('sr-editor-back-btn');
    const discardBtn = document.getElementById('sr-btn-discard');
    const returnToCapture = () => {
      document.getElementById('sr-editor-screen').style.display = 'none';
      document.getElementById('sr-capture-screen').style.display = 'flex';
      draftMedia = null;
      draftTextOverlay = null;
      const overlayEl = document.getElementById('sr-editor-text-overlay');
      if (overlayEl) overlayEl.style.display = 'none';
      const cap = document.getElementById('sr-editor-caption-input');
      if (cap) cap.value = '';
      startCamera(currentFacingMode);
    };
    if (backBtn) backBtn.onclick = returnToReturnOrClose;
    if (discardBtn) discardBtn.onclick = returnToReturnOrClose;

    function returnToReturnOrClose() {
      returnToCapture();
    }

    // 7. Ferramenta de Texto (Aa) e Posicionamento
    const textToolBtn = document.getElementById('sr-editor-text-btn');
    const textDialog = document.getElementById('sr-text-input-dialog');
    const textInput = document.getElementById('sr-text-dialog-input');
    const cancelTextBtn = document.getElementById('sr-btn-cancel-text');
    const confirmTextBtn = document.getElementById('sr-btn-confirm-text');
    const textOverlayEl = document.getElementById('sr-editor-text-overlay');
    const overlayContent = document.getElementById('sr-overlay-text-content');
    const removeTextBtn = document.getElementById('sr-remove-overlay-text');
    const posBtn = document.getElementById('sr-editor-pos-btn');

    if (textToolBtn && textDialog && textInput) {
      textToolBtn.onclick = () => {
        textDialog.style.display = 'flex';
        textInput.value = draftTextOverlay ? draftTextOverlay.text : '';
        textInput.focus();
      };
    }
    if (cancelTextBtn && textDialog) {
      cancelTextBtn.onclick = () => {
        textDialog.style.display = 'none';
      };
    }
    if (confirmTextBtn && textDialog && textInput && textOverlayEl && overlayContent) {
      confirmTextBtn.onclick = () => {
        const val = textInput.value.trim();
        if (val) {
          draftTextOverlay = {
            text: val,
            position: textPositions[currentPosIndex]
          };
          overlayContent.textContent = val;
          textOverlayEl.className = `sr-editor-text-overlay pos-${draftTextOverlay.position}`;
          textOverlayEl.style.display = 'flex';
        } else {
          draftTextOverlay = null;
          textOverlayEl.style.display = 'none';
        }
        textDialog.style.display = 'none';
      };
    }
    if (removeTextBtn && textOverlayEl) {
      removeTextBtn.onclick = (e) => {
        e.stopPropagation();
        draftTextOverlay = null;
        textOverlayEl.style.display = 'none';
      };
    }
    if (textOverlayEl) {
      textOverlayEl.onclick = () => {
        if (textDialog && textInput) {
          textDialog.style.display = 'flex';
          textInput.value = draftTextOverlay ? draftTextOverlay.text : '';
          textInput.focus();
        }
      };
    }
    if (posBtn && textOverlayEl) {
      posBtn.onclick = () => {
        currentPosIndex = (currentPosIndex + 1) % textPositions.length;
        const newPos = textPositions[currentPosIndex];
        if (draftTextOverlay) {
          draftTextOverlay.position = newPos;
        }
        textOverlayEl.className = `sr-editor-text-overlay pos-${newPos}`;
        showStoryToast(`Posição: ${newPos === 'top' ? 'Topo' : newPos === 'center' ? 'Centro' : 'Base'}`);
      };
    }

    // 8. Publicar Story
    const publishBtn = document.getElementById('sr-btn-publish');
    if (publishBtn) {
      publishBtn.onclick = () => {
        if (!draftMedia) {
          showStoryToast('Nenhuma mídia para publicar!');
          return;
        }

        const captionInput = document.getElementById('sr-editor-caption-input');
        const caption = captionInput ? captionInput.value.trim() : '';

        // Executa a publicação real
        const result = engine.publishUserStory(draftMedia, caption, draftTextOverlay, draftMediaType);

        // Encerra criador
        engine.closeCreator();

        // Feedback de Sucesso
        showStoryToast(`Story publicado com sucesso!${result.pointsBonusText || ' (+10 pts) 🔥'}`);

        // Abre o Story recém-criado no visualizador
        setTimeout(() => {
          engine.open('your-story');
        }, 300);
      };
    }
  }

  function startCamera(facing = 'user') {
    const video = document.getElementById('sr-camera-stream');
    const fallback = document.getElementById('sr-camera-fallback');
    const fallbackMsg = document.getElementById('sr-fallback-msg');

    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (fallback) fallback.style.display = 'flex';
      if (fallbackMsg) fallbackMsg.textContent = 'Este navegador não suporta acesso direto à câmera. Escolha uma foto ou vídeo da galeria.';
      return;
    }

    const constraints = {
      video: {
        facingMode: facing,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        cameraStream = stream;
        if (video) {
          video.srcObject = stream;
          video.play().catch(() => {});
        }
        if (fallback) fallback.style.display = 'none';
      })
      .catch((err) => {
        console.warn('Acesso à câmera bloqueado ou indisponível:', err);
        if (fallback) fallback.style.display = 'flex';
        if (fallbackMsg) {
          fallbackMsg.textContent =
            err.name === 'NotAllowedError'
              ? 'Permissão de câmera negada. Habilite a permissão nas configurações do navegador ou selecione um arquivo da galeria.'
              : 'Não foi possível iniciar a câmera. Você pode escolher uma foto ou vídeo da galeria.';
        }
      });
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }
    const video = document.getElementById('sr-camera-stream');
    if (video) {
      video.srcObject = null;
    }
  }

  function openEditorWithMedia(mediaDataUrl, mediaType = 'image') {
    draftMedia = mediaDataUrl;
    draftMediaType = mediaType;
    draftTextOverlay = null;

    document.getElementById('sr-capture-screen').style.display = 'none';
    document.getElementById('sr-editor-screen').style.display = 'flex';

    const imgPreview = document.getElementById('sr-editor-img-preview');
    const vidPreview = document.getElementById('sr-editor-video-preview');
    const textOverlayEl = document.getElementById('sr-editor-text-overlay');
    const pubAvatar = document.getElementById('sr-publish-user-avatar');

    const logged = getLoggedUserProfile();
    if (pubAvatar) pubAvatar.src = logged.avatar;

    if (textOverlayEl) textOverlayEl.style.display = 'none';

    if (mediaType === 'video') {
      if (imgPreview) imgPreview.style.display = 'none';
      if (vidPreview) {
        vidPreview.style.display = 'block';
        vidPreview.src = mediaDataUrl;
        vidPreview.play().catch(() => {});
      }
    } else {
      if (vidPreview) {
        vidPreview.pause();
        vidPreview.style.display = 'none';
        vidPreview.src = '';
      }
      if (imgPreview) {
        imgPreview.style.display = 'block';
        imgPreview.src = mediaDataUrl;
      }
    }
  }

  /**
   * Abre a interface completa de Criação de Stories (Câmera + Galeria)
   */
  engine.openCreator = function () {
    ensureCreatorModal();

    // Fecha o visualizador se estiver aberto
    if (modalEl && modalEl.classList.contains('active')) {
      engine.close();
    }

    // Prepara tela de captura
    document.getElementById('sr-editor-screen').style.display = 'none';
    document.getElementById('sr-capture-screen').style.display = 'flex';
    document.getElementById('sr-camera-fallback').style.display = 'none';

    creatorModalEl.classList.add('active');

    // Inicia a câmera
    startCamera(currentFacingMode);
  };

  /**
   * Encerra o Criador e para todos os recursos da câmera
   */
  engine.closeCreator = function () {
    stopCamera();
    if (isRecording) {
      isRecording = false;
      if (recordingInterval) clearInterval(recordingInterval);
    }
    if (creatorModalEl) {
      creatorModalEl.classList.remove('active');
      const vidPreview = document.getElementById('sr-editor-video-preview');
      if (vidPreview) {
        vidPreview.pause();
        vidPreview.src = '';
      }
    }
    draftMedia = null;
    draftTextOverlay = null;
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
    ensureCreatorModal();
    engine.syncAllStoryElements();
  });

  window.addEventListener('pageshow', () => {
    engine.syncAllStoryElements();
  });

  window.addEventListener('sr:stories-updated', () => {
    engine.syncAllStoryElements();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === PROFILE_STORAGE_KEY || e.key === USER_STORIES_STORAGE_KEY) {
      engine.syncAllStoryElements();
    }
  });

  window.SocialRatsStories = engine;
})(window);
