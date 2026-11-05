/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SOCIALRATS — FONTE CENTRALIZADA DE PERFIL, IDENTIDADE E PUBLICAÇÕES
 * Sincroniza nome, @handle, foto de perfil, banner, bio e publicações do
 * usuário autenticado automaticamente em todas as telas do aplicativo.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function (window) {
  'use strict';

  const PROFILE_STORAGE_KEY = 'socialrats_profile_data';
  const USER_HANDLE_KEY = 'socialrats_user';
  const USER_POSTS_STORAGE_KEY = 'socialrats_user_posts_v1';

  /**
   * Avatar padrão consistente com o DesignSystem.md (superfície #1c1728,
   * borda sutil e silhueta com gradiente oficial #ff713f -> #ff32b8 -> #923bff)
   * utilizado quando o usuário não possui foto cadastrada ou remove a foto.
   */
  const DESIGN_SYSTEM_DEFAULT_AVATAR_SVG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="srGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff713f"/>
            <stop offset="52%" stop-color="#ff32b8"/>
            <stop offset="100%" stop-color="#923bff"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="#1c1728"/>
        <circle cx="60" cy="45" r="20" fill="url(#srGrad)"/>
        <path d="M24 102c5-20 20-31 36-31s31 11 36 31" fill="url(#srGrad)"/>
      </svg>`
    );

  const DEFAULT_PROFILE = Object.freeze({
    name: 'Gabriel Silva',
    handle: '@gabriel',
    handleClean: 'gabriel',
    bio: 'Focado na evolução diária 💪 Treino pesado, consistência e disciplina. Quem falha paga a multa! 🐀🔥',
    location: 'São Paulo, Brasil',
    website: 'socialrats.com/@gabriel',
    avatar: '../../../assets/images/avatar-your-story.png',
    banner: '../../../assets/images/post-sunset.png',
    badge: '🏅 Rato Alfa · Nível 14',
    isPrivate: false
  });

  function sanitizeHandle(rawHandle) {
    if (!rawHandle || typeof rawHandle !== 'string') return DEFAULT_PROFILE.handleClean;
    const cleaned = rawHandle
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9_.]/g, '');
    return cleaned || DEFAULT_PROFILE.handleClean;
  }

  function resolveAvatar(avatarUrl) {
    if (!avatarUrl || typeof avatarUrl !== 'string' || !avatarUrl.trim() || avatarUrl === 'default') {
      return DESIGN_SYSTEM_DEFAULT_AVATAR_SVG;
    }
    return avatarUrl.trim();
  }

  /**
   * 1. LEITURA CENTRALIZADA DO PERFIL DO USUÁRIO AUTENTICADO
   */
  function getProfile() {
    let stored = null;
    let legacyUser = null;

    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        stored = JSON.parse(raw);
      }
      legacyUser = localStorage.getItem(USER_HANDLE_KEY);
    } catch (e) {}

    const base = Object.assign({}, DEFAULT_PROFILE);

    if (legacyUser && (!stored || !stored.handle)) {
      const cleanLegacy = sanitizeHandle(legacyUser.split('@')[0]);
      base.handleClean = cleanLegacy;
      base.handle = '@' + cleanLegacy;
    }

    if (stored && typeof stored === 'object') {
      if (typeof stored.name === 'string' && stored.name.trim()) {
        base.name = stored.name.trim();
      }
      if (typeof stored.handle === 'string' && stored.handle.trim()) {
        const clean = sanitizeHandle(stored.handle);
        base.handleClean = clean;
        base.handle = '@' + clean;
      }
      if (typeof stored.bio === 'string') {
        base.bio = stored.bio;
      }
      if (typeof stored.location === 'string') {
        base.location = stored.location;
      }
      if (typeof stored.website === 'string') {
        base.website = stored.website;
      }
      if (typeof stored.avatar === 'string') {
        base.avatar = resolveAvatar(stored.avatar);
      }
      if (typeof stored.banner === 'string' && stored.banner.trim()) {
        base.banner = stored.banner.trim();
      }
      if (typeof stored.badge === 'string' && stored.badge.trim()) {
        base.badge = stored.badge.trim();
      }
      if (typeof stored.isPrivate === 'boolean') {
        base.isPrivate = stored.isPrivate;
      }
    }

    base.avatar = resolveAvatar(base.avatar);
    return base;
  }

  /**
   * 2. SALVAMENTO CENTRALIZADO DO PERFIL E DISPARO DE SINCRONIZAÇÃO GLOBAL
   */
  function saveProfile(partialData = {}) {
    const current = getProfile();
    const nextName =
      typeof partialData.name === 'string' && partialData.name.trim()
        ? partialData.name.trim()
        : current.name;

    const rawHandle =
      typeof partialData.handle === 'string' && partialData.handle.trim()
        ? partialData.handle
        : current.handle;
    const cleanHandle = sanitizeHandle(rawHandle);

    const nextAvatar =
      partialData.avatar !== undefined
        ? resolveAvatar(partialData.avatar)
        : current.avatar;

    const updated = {
      name: nextName,
      handle: '@' + cleanHandle,
      handleClean: cleanHandle,
      bio: typeof partialData.bio === 'string' ? partialData.bio : current.bio,
      location: typeof partialData.location === 'string' ? partialData.location : current.location,
      website: typeof partialData.website === 'string' ? partialData.website : current.website,
      avatar: nextAvatar,
      banner:
        typeof partialData.banner === 'string' && partialData.banner.trim()
          ? partialData.banner.trim()
          : current.banner,
      badge:
        typeof partialData.badge === 'string' && partialData.badge.trim()
          ? partialData.badge.trim()
          : current.badge,
      isPrivate:
        typeof partialData.isPrivate === 'boolean' ? partialData.isPrivate : current.isPrivate
    };

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(USER_HANDLE_KEY, cleanHandle);
    } catch (e) {}

    syncAllDOMElements();

    try {
      window.dispatchEvent(new CustomEvent('sr:profile-updated', { detail: updated }));
    } catch (e) {}

    return updated;
  }

  /**
   * 3. GERENCIAMENTO DE PUBLICAÇÕES DO USUÁRIO (SINCRONIZADAS ENTRE FEED E PERFIL)
   * As publicações armazenam apenas o conteúdo/mídia/destino e utilizam sempre
   * o nome e a foto atuais do perfil no momento da renderização e atualização.
   */
  function getUserPosts() {
    try {
      const raw = localStorage.getItem(USER_POSTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  function addUserPost(postData = {}) {
    const posts = getUserPosts();
    const newPost = {
      id: postData.id || 'post-user-' + Date.now(),
      text: typeof postData.text === 'string' ? postData.text.trim() : '',
      media: postData.media || '',
      destType: postData.destType || 'account',
      destId: postData.destId || 'public',
      destShort: postData.destShort || 'Conta Geral (Público)',
      tag: postData.tag || 'Geral',
      collaborators: Array.isArray(postData.collaborators) ? postData.collaborators : [],
      isScheduled: Boolean(postData.isScheduled),
      timestampLabel: postData.timestampLabel || 'Agora mesmo',
      likes: Number(postData.likes) || 0,
      comments: Number(postData.comments) || 0,
      reposts: Number(postData.reposts) || 0,
      createdAt: Date.now()
    };

    const updatedPosts = [newPost, ...posts].slice(0, 30);
    try {
      localStorage.setItem(USER_POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (e) {}

    return newPost;
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[tag] || tag));
  }

  /**
   * Cria o elemento HTML de uma publicação do usuário autenticado vinculada
   * dinamicamente aos atributos data-sr-user="avatar" e data-sr-user="name".
   */
  function buildUserPostElement(post, context = 'feed') {
    const profile = getProfile();
    const article = document.createElement('article');
    article.className = 'post-card';
    article.id = post.id;
    article.setAttribute('data-own-post', 'true');
    article.setAttribute('data-user-post-id', post.id);

    const safeText = escapeHTML(post.text);
    const safeDestShort = escapeHTML(post.destShort || 'Conta Geral');

    let destBadgeHtml = '';
    if (post.destType === 'community') {
      destBadgeHtml = `<span style="font-size:11px; font-weight:700; color:var(--color-accent-pink, #ff32b8); background:rgba(255,50,184,0.12); border:1px solid rgba(255,50,184,0.3); padding:2px 8px; border-radius:999px; margin-left:6px;">${safeDestShort}</span>`;
    } else if (post.destShort) {
      destBadgeHtml = `<span style="font-size:11px; font-weight:600; color:var(--color-text-secondary, #9c99ab); background:var(--color-surface-elevated, #1c1728); border:1px solid var(--color-border-subtle, #282238); padding:2px 8px; border-radius:999px; margin-left:6px;">${safeDestShort}</span>`;
    }

    const tagBadge =
      post.tag && post.tag !== 'Geral'
        ? `<span style="font-size:11px; font-weight:700; color:var(--color-accent-orange, #ff713f); background:rgba(255,113,63,0.12); padding:2px 8px; border-radius:999px; margin-left:4px;">#${escapeHTML(post.tag)}</span>`
        : '';

    const collabHtml =
      Array.isArray(post.collaborators) && post.collaborators.length > 0
        ? `<div style="font-size:11.5px; color:var(--color-text-secondary, #9c99ab); margin-bottom:8px;"><i class="fa-solid fa-user-group" style="color:var(--color-accent-purple, #923bff); margin-right:4px;"></i>Em colaboração com <strong>${escapeHTML(post.collaborators.join(', '))}</strong></div>`
        : '';

    const mediaHtml = post.media
      ? `<div class="post-media-container" ondblclick="if(typeof triggerDoubleTapLike==='function'){triggerDoubleTapLike('like-btn-${post.id}', '${post.id}')}">
          <img src="${post.media}" alt="Mídia da publicação" class="post-media-img" loading="eager">
        </div>`
      : '';

    if (context === 'profile') {
      article.innerHTML = `
        <div class="post-header">
          <div class="post-author-group">
            <div class="post-author-avatar-wrap">
              <img src="${profile.avatar}" alt="${escapeHTML(profile.name)}" class="post-author-avatar-img" data-sr-user="avatar">
            </div>
            <div class="post-author-details">
              <span class="post-author-name" style="display:flex; align-items:center; flex-wrap:wrap; gap:2px;">
                <span data-sr-user="name">${escapeHTML(profile.name)}</span>
                ${destBadgeHtml}
                ${tagBadge}
              </span>
              <span class="post-timestamp">${escapeHTML(post.timestampLabel || 'Agora mesmo')}</span>
            </div>
          </div>
          <button type="button" class="btn-top-action" style="font-size:16px; color:var(--color-text-secondary);" onclick="if(typeof showToast==='function') showToast('Opções da publicação')">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        ${collabHtml}
        ${mediaHtml}
        ${safeText ? `<p class="post-text-body">${safeText}</p>` : ''}
        <div class="post-actions-row">
          <div class="post-actions-left">
            <button type="button" class="action-btn" id="like-btn-${post.id}" onclick="if(typeof toggleLike==='function') toggleLike(this, '1', '0')">
              <i class="fa-solid fa-heart"></i>
              <span>0</span>
            </button>
            <button type="button" class="action-btn" onclick="if(typeof showToast==='function') showToast('Comentários desta publicação')">
              <i class="fa-regular fa-comment"></i>
              <span>0</span>
            </button>
            <button type="button" class="action-btn" onclick="if(typeof showToast==='function') showToast('Publicação repostada!')">
              <i class="fa-solid fa-repeat"></i>
              <span>0</span>
            </button>
          </div>
          <button type="button" class="action-btn" onclick="if(typeof showToast==='function') showToast('Salvo nos favoritos')">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
      `;
    } else {
      article.innerHTML = `
        <div class="post-header">
          <div class="post-author-group">
            <div class="post-author-avatar-wrap">
              <img src="${profile.avatar}" alt="${escapeHTML(profile.name)}" class="post-author-avatar-img" data-sr-user="avatar">
            </div>
            <div class="post-author-details">
              <span class="post-author-name" style="display:flex; align-items:center; flex-wrap:wrap; gap:2px;">
                <span data-sr-user="name">${escapeHTML(profile.name)}</span>
                ${destBadgeHtml}
                ${tagBadge}
              </span>
              <span class="post-timestamp">${post.isScheduled ? '⏰ Agendado · Agora mesmo' : escapeHTML(post.timestampLabel || 'Agora mesmo')}</span>
            </div>
          </div>
          <button type="button" class="btn-post-options" aria-label="Mais opções" onclick="if(typeof openOptionsModal==='function') openOptionsModal(window.SocialRatsUser ? window.SocialRatsUser.getProfile().name : 'Você')">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        ${collabHtml}
        ${mediaHtml}
        ${safeText ? `<div class="post-text-body">${safeText}</div>` : ''}
        <div class="post-actions-row">
          <div class="post-actions-left">
            <button type="button" class="action-btn like-btn" id="like-btn-${post.id}" onclick="if(typeof toggleLike==='function') toggleLike(this, '1', '0')">
              <i class="fa-regular fa-heart"></i>
              <span class="action-count">0</span>
            </button>
            <button type="button" class="action-btn" onclick="if(typeof openCommentsModal==='function') openCommentsModal(window.SocialRatsUser ? window.SocialRatsUser.getProfile().name : 'Você')">
              <i class="fa-regular fa-comment-dots"></i>
              <span class="action-count">0</span>
            </button>
            <button type="button" class="action-btn" onclick="if(typeof toggleRepost==='function') toggleRepost(this, '0', '1')">
              <i class="fa-solid fa-repeat"></i>
              <span class="action-count">0</span>
            </button>
          </div>
          <button type="button" class="bookmark-btn" onclick="if(typeof toggleBookmark==='function') toggleBookmark(this)">
            <i class="fa-regular fa-bookmark"></i>
            <span class="action-count" style="font-size:13.5px; font-weight:600; margin-left:4px;">0</span>
          </button>
        </div>
      `;
    }

    return article;
  }

  /**
   * Renderiza publicações salvas do usuário no Feed (#posts-list) e no Perfil (#posts-panel)
   * sem duplicar caso já estejam no DOM.
   */
  function renderPersistedUserPosts() {
    const posts = getUserPosts();
    if (!posts.length) return;

    const feedList = document.getElementById('posts-list');
    const profilePanel = document.getElementById('posts-panel');

    // Percorre do mais antigo para o mais recente usando prepend para manter o mais novo no topo
    for (let i = posts.length - 1; i >= 0; i--) {
      const post = posts[i];
      if (feedList && !document.getElementById(post.id)) {
        feedList.prepend(buildUserPostElement(post, 'feed'));
      }
      if (profilePanel && !profilePanel.querySelector(`[data-user-post-id="${post.id}"]`)) {
        profilePanel.prepend(buildUserPostElement(post, 'profile'));
      }
    }
  }

  /**
   * 4. SINCRONIZAÇÃO AUTOMÁTICA DE TODOS OS ELEMENTOS DE PERFIL NO DOM
   * Atualiza avatares, nomes, @handles, stories, modais, publicações existentes,
   * comentários/respostas e cartões de compartilhamento em qualquer tela.
   */
  function syncAllDOMElements() {
    const profile = getProfile();

    // A. Imagens / Avatares do usuário logado em todas as telas
    const avatarSelectors = [
      '[data-sr-user="avatar"]',
      '.desktop-user-avatar',
      '#desktop-user-avatar',
      '#sidebar-user-avatar',
      '#profile-main-avatar',
      '#modal-user-avatar',
      '#metrics-user-avatar',
      '#switcher-primary-avatar',
      '.story-item.your-story .story-avatar-img',
      '.connection-item.your-story .connection-avatar-img',
      '#posts-panel .post-author-avatar-img',
      '#replies-panel .reply-user-avatar',
      '.post-card[data-own-post="true"] .post-author-avatar-img',
      '#share-preview img[data-sr-share-avatar]'
    ];

    document.querySelectorAll(avatarSelectors.join(', ')).forEach((imgEl) => {
      if (imgEl && imgEl.tagName === 'IMG') {
        imgEl.src = profile.avatar;
        imgEl.alt = profile.name;
        imgEl.onerror = function () {
          if (this.src !== DESIGN_SYSTEM_DEFAULT_AVATAR_SVG) {
            this.src = DESIGN_SYSTEM_DEFAULT_AVATAR_SVG;
          }
        };
      }
    });

    // B. Nome de exibição do usuário em todas as telas e nas publicações existentes
    const nameSelectors = [
      '[data-sr-user="name"]',
      '.desktop-user-name',
      '#desktop-user-name',
      '#sidebar-user-name',
      '#profile-display-name',
      '#modal-user-name',
      '#hero-user-display-name',
      '#switcher-primary-name'
    ];

    document.querySelectorAll(nameSelectors.join(', ')).forEach((el) => {
      if (el) el.textContent = profile.name;
    });

    // Atualizar nome nas publicações existentes do próprio usuário (#posts-panel e [data-own-post="true"])
    // preservando eventuais badges de comunidade/tags filhos
    document.querySelectorAll('#posts-panel .post-author-name, .post-card[data-own-post="true"] .post-author-name').forEach((nameContainer) => {
      const explicitSpan = nameContainer.querySelector('[data-sr-user="name"]');
      if (explicitSpan) {
        explicitSpan.textContent = profile.name;
      } else if (nameContainer.children.length === 0) {
        nameContainer.textContent = profile.name;
      } else {
        // Atualiza o primeiro nó de texto antes dos badges
        const firstNode = nameContainer.childNodes[0];
        if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
          firstNode.nodeValue = profile.name + ' ';
        }
      }
    });

    // Atualizar nome nas respostas/comentários do usuário na aba Respostas (#replies-panel)
    document.querySelectorAll('#replies-panel .reply-author-meta').forEach((metaEl) => {
      const firstSpan = metaEl.querySelector('span:first-child');
      if (firstSpan) firstSpan.textContent = profile.name;
    });

    // C. Identificador @handle (com @)
    const handleSelectors = [
      '[data-sr-user="handle"]',
      '.desktop-user-handle',
      '#desktop-user-handle',
      '#sidebar-user-handle',
      '#profile-display-handle'
    ];

    document.querySelectorAll(handleSelectors.join(', ')).forEach((el) => {
      if (el) el.textContent = profile.handle;
    });

    // D. Identificador limpo (sem @) em seletores de conta / topo
    const cleanHandleSelectors = [
      '[data-sr-user="handle-clean"]',
      '#top-username-label',
      '#direct-logged-username',
      '#switcher-primary-handle'
    ];

    document.querySelectorAll(cleanHandleSelectors.join(', ')).forEach((el) => {
      if (el) el.textContent = profile.handleClean;
    });

    // E. Elementos compostos (ex: "Sua Conta em Geral (@handle)", "Gabriel (@gabriel)", "socialrats.app/u/handle")
    document.querySelectorAll('[data-sr-user="account-dest-title"]').forEach((el) => {
      el.textContent = `Sua Conta em Geral (${profile.handle})`;
    });

    document.querySelectorAll('[data-sr-user="name-and-handle"]').forEach((el) => {
      el.textContent = `${profile.name} (${profile.handle})`;
    });

    document.querySelectorAll('[data-sr-user="share-url"]').forEach((el) => {
      el.textContent = `socialrats.app/u/${profile.handleClean}`;
    });

    // F. Bio, Localização e Website na tela de Perfil
    const bioEl = document.getElementById('profile-display-bio');
    if (bioEl && typeof profile.bio === 'string') {
      bioEl.textContent = profile.bio;
    }

    const locWrap = document.getElementById('profile-meta-location-wrap');
    const locEl = document.getElementById('profile-display-location');
    if (locEl && typeof profile.location === 'string') {
      locEl.textContent = profile.location;
      if (locWrap) locWrap.style.display = profile.location ? 'flex' : 'none';
    }

    const webWrap = document.getElementById('profile-meta-website-wrap');
    const webEl = document.getElementById('profile-display-website');
    if (webEl && typeof profile.website === 'string') {
      webEl.textContent = profile.website;
      if (webWrap) webWrap.style.display = profile.website ? 'flex' : 'none';
    }

    // G. Banner de capa do perfil
    const coverImg = document.getElementById('profile-cover-img');
    const coverOrb = document.getElementById('profile-cover-orb');
    if (coverImg && profile.banner) {
      coverImg.src = profile.banner;
      coverImg.style.display = 'block';
      if (coverOrb) coverOrb.style.display = 'none';
    }

    // H. Atualizar o item "Seu Story" no Story Viewer do Feed (se storiesList existir na página)
    const yourStoryItem = document.querySelector('.story-item.your-story');
    if (yourStoryItem) {
      yourStoryItem.setAttribute(
        'onclick',
        `openStoryViewer('${escapeHTML(profile.name)}', '${profile.avatar}', '../../../assets/images/post-sunset-crop.png', true)`
      );
    }
  }

  // Inicializar sincronização ao carregar a página e escutar alterações entre abas/telas
  document.addEventListener('DOMContentLoaded', () => {
    renderPersistedUserPosts();
    syncAllDOMElements();
  });

  window.addEventListener('storage', (event) => {
    if (
      !event.key ||
      event.key === PROFILE_STORAGE_KEY ||
      event.key === USER_HANDLE_KEY ||
      event.key === USER_POSTS_STORAGE_KEY
    ) {
      renderPersistedUserPosts();
      syncAllDOMElements();
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     DIRECT · Configurações por conversa, bloqueios e denúncias
     Persistido em localStorage, vinculado ao usuário logado (handle).
     ═══════════════════════════════════════════════════════════════ */
  const DM_STORAGE_KEY = 'socialrats_dm_settings_v1';
  const DM_DEFAULT_SETTINGS = Object.freeze({ blocked: false, muted: false, theme: 'default' });

  function readDmStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DM_STORAGE_KEY) || '{}');
      const owner = getProfile().handle;
      if (parsed && parsed.owner === owner && parsed.conversations) return parsed;
      return { owner, conversations: {}, reports: [] };
    } catch (e) {
      return { owner: getProfile().handle, conversations: {}, reports: [] };
    }
  }

  function writeDmStore(store) {
    try {
      localStorage.setItem(DM_STORAGE_KEY, JSON.stringify(store));
    } catch (e) { /* storage indisponível */ }
    window.dispatchEvent(new CustomEvent('sr:dm-updated'));
  }

  const DM_GROUPS_KEY = 'socialrats_dm_groups_v1';

  function readDmGroups() {
    const owner = getProfile().handle;
    try {
      const parsed = JSON.parse(localStorage.getItem(DM_GROUPS_KEY) || '{}');
      if (parsed && parsed.owner === owner && Array.isArray(parsed.groups)) return parsed;
    } catch (e) { /* ignora */ }
    return { owner, groups: [] };
  }

  function writeDmGroups(store) {
    localStorage.setItem(DM_GROUPS_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('sr:dm-updated'));
  }

  // Entitlement do plano (SocialRats Pro). Somente leitura: a ativação virá do fluxo de assinatura.
  const PLAN_STORAGE_KEY = 'socialrats_plan';
  function getPlan() {
    try {
      const plan = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || 'null');
      if (plan && plan.tier === 'pro' && plan.status === 'active' &&
        (!plan.expiresAt || new Date(plan.expiresAt) > new Date())) return plan;
    } catch (e) { /* ignora */ }
    return { tier: 'free', status: 'active' };
  }
  function hasProAccess() {
    return getPlan().tier === 'pro';
  }

  const dm = {
    getSettings(contactKey) {
      const store = readDmStore();
      return Object.assign({}, DM_DEFAULT_SETTINGS, store.conversations[contactKey] || {});
    },
    updateSettings(contactKey, partial) {
      const store = readDmStore();
      store.conversations[contactKey] = Object.assign(
        {}, DM_DEFAULT_SETTINGS, store.conversations[contactKey] || {}, partial
      );
      writeDmStore(store);
      return store.conversations[contactKey];
    },
    isBlocked(contactKey) {
      return !!dm.getSettings(contactKey).blocked;
    },
    addReport(report) {
      const store = readDmStore();
      const entry = Object.assign({
        id: 'rep_' + Date.now().toString(36),
        reporter: store.owner,
        createdAt: new Date().toISOString(),
        status: 'enviada'
      }, report);
      store.reports.push(entry);
      writeDmStore(store);
      return entry;
    },
    createGroup({ name, description, photo, members }) {
      const cleanName = String(name || '').trim();
      const ids = Array.from(new Set(members || []));
      if (!cleanName) throw new Error('Informe o nome do grupo.');
      if (!ids.length) throw new Error('Selecione ao menos um participante.');
      const store = readDmGroups();
      const group = {
        id: 'g' + Date.now().toString(36),
        name: cleanName.slice(0, 40),
        description: String(description || '').trim().slice(0, 200),
        photo: photo || '',
        members: ids,
        createdBy: store.owner,
        createdAt: new Date().toISOString()
      };
      store.groups.unshift(group);
      writeDmGroups(store);
      return group;
    },
    getGroups() {
      return readDmGroups().groups;
    },
    getGroup(id) {
      return readDmGroups().groups.find((g) => g.id === id) || null;
    },
    getReports(contactKey) {
      return readDmStore().reports.filter((r) => !contactKey || r.contactKey === contactKey);
    }
  };

  window.addEventListener('storage', (event) => {
    if (event.key === DM_STORAGE_KEY || event.key === DM_GROUPS_KEY || event.key === PLAN_STORAGE_KEY) window.dispatchEvent(new CustomEvent('sr:dm-updated'));
  });

  window.SocialRatsUser = {
    dm,
    getPlan,
    hasProAccess,
    DEFAULT_AVATAR: DESIGN_SYSTEM_DEFAULT_AVATAR_SVG,
    DEFAULT_PROFILE,
    getProfile,
    saveProfile,
    getUserPosts,
    addUserPost,
    buildUserPostElement,
    renderPersistedUserPosts,
    syncAllDOMElements
  };
})(window);

