/* =========================================================
   GROUP CAM — script.js
   Menu mobile, ombre du header au scroll, horloge du poste
   de contrôle, révélation au scroll, validation du formulaire.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderShadow();
  initLiveClock();
  initHeroVideos();
  initScrollReveal();
  initContactForm();
  initAvisCarousel();
  initCookieBanner();
  initRealisationsMarquee();
  initServiceTabs();
  initOffers();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/**
 * Ouvre/ferme le menu de navigation mobile et bascule l'icône burger/croix.
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-mobile-toggle');
  const menu = document.getElementById('menu-mobile');
  const icon = document.getElementById('menu-icon');

  toggleBtn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    icon.classList.toggle('fa-bars', isOpen);
    icon.classList.toggle('fa-xmark', !isOpen);
  });

  // Ferme le menu mobile automatiquement après le clic sur un lien.
  document.querySelectorAll('.menu-mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    });
  });
}

/**
 * Ajoute une ombre discrète au header dès que la page est scrollée.
 */
function initHeaderShadow() {
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Affiche l'heure locale en direct dans le visuel du "poste de contrôle" du Hero.
 */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  const updateClock = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Fait apparaître en fondu les éléments marqués ".reveal" lorsqu'ils entrent dans l'écran.
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Formulaire de devis : validation côté client, choix du canal d'envoi
 * (e-mail via Web3Forms ou WhatsApp) et bouton d'envoi dynamique.
 */
const WHATSAPP_NUMBER = '213660661432';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const CHANNELS = {
  email: { labelKey: 'form.btn_email', icon: 'fa-solid fa-envelope' },
  whatsapp: { labelKey: 'form.btn_whatsapp', icon: 'fa-brands fa-whatsapp' }
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');
  const successText = document.getElementById('form-success-text');
  const failureMsg = document.getElementById('form-failure');
  const submitBtn = document.getElementById('submit-btn');
  const submitIcon = document.getElementById('submit-icon');
  const submitLabel = document.getElementById('submit-label');
  const radios = form.querySelectorAll('input[name="canal"]');

  const getChannel = () => {
    const checked = form.querySelector('input[name="canal"]:checked');
    return checked ? checked.value : 'email';
  };

  const hideStatus = () => {
    [successMsg, failureMsg].forEach((el) => {
      el.classList.remove('visible');
      el.classList.add('hidden');
    });
  };

  const showStatus = (el) => {
    hideStatus();
    el.classList.remove('hidden');
    el.classList.add('visible');
  };

  // Met à jour le texte, l'icône et la couleur du bouton selon le canal choisi.
  const syncButton = () => {
    const channel = getChannel();
    submitBtn.dataset.channel = channel;
    submitLabel.textContent = I18N.t(CHANNELS[channel].labelKey);
    submitIcon.className = CHANNELS[channel].icon;
    hideStatus();
  };

  radios.forEach((r) => r.addEventListener('change', syncButton));
  syncButton();

  // Changement de langue : on efface les messages affichés (ils seraient dans l'ancienne langue)
  document.addEventListener('i18n:change', () => {
    clearErrors(form);
    syncButton();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);
    hideStatus();

    const nom = form.nom.value.trim();
    const telephone = form.telephone.value.trim();
    const email = form.email.value.trim();
    const projet = form.projet.value.trim();
    const message = form.message.value.trim();
    let isValid = true;

    if (nom.length < 2) {
      showError(form, 'nom', I18N.t('form.err_name'));
      isValid = false;
    }

    // Format simple : chiffres, espaces, "+" acceptés, 8 à 14 caractères utiles.
    const phonePattern = /^[0-9+\s]{8,14}$/;
    if (!phonePattern.test(telephone)) {
      showError(form, 'telephone', I18N.t('form.err_phone'));
      isValid = false;
    }

    // E-mail facultatif : vérifié uniquement s'il est renseigné.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (email && !emailPattern.test(email)) {
      showError(form, 'email', I18N.t('form.err_email'));
      isValid = false;
    }

    if (!projet) {
      showError(form, 'projet', I18N.t('form.err_project'));
      isValid = false;
    }

    // Services souhaités : au moins une case cochée
    const checkedServices = Array.from(form.querySelectorAll('input[name="services"]:checked'));
    if (checkedServices.length === 0) {
      showError(form, 'services', I18N.t('form.err_services'));
      isValid = false;
    }

    if (!isValid) return;

    // Libellé lisible : le texte de l'option choisie dans le menu déroulant.
    // Libellé affiché (langue active) pour WhatsApp ; libellé français pour l'e-mail reçu par l'équipe.
    const projetOption = form.projet.selectedOptions[0];
    const projetLabel = projetOption.textContent.trim();
    const projetLabelFr = I18N.originalText(projetOption);

    // Services cochés : libellés dans la langue active (WhatsApp) et en français (e-mail reçu par l'équipe)
    const serviceSpans = checkedServices.map((cb) => cb.parentElement.querySelector('span'));
    const servicesLabel = serviceSpans.map((sp) => sp.textContent.trim()).join(', ');
    const servicesLabelFr = serviceSpans.map((sp) => I18N.originalText(sp)).join(', ');

    if (getChannel() === 'whatsapp') {
      sendViaWhatsApp({ nom, telephone, email, projetLabel, servicesLabel, message });
      successText.textContent = I18N.t('form.ok_whatsapp');
      form.reset();
      syncButton();
      showStatus(successMsg);
      return;
    }

    // Envoi par e-mail via Web3Forms
    const originalLabel = submitLabel.textContent;
    submitBtn.disabled = true;
    submitLabel.textContent = I18N.t('form.sending');
    submitIcon.className = 'fa-solid fa-spinner fa-spin';

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({
          access_key: form.access_key.value,
          subject: form.subject.value,
          from_name: form.from_name.value,
          botcheck: form.botcheck.checked,
          nom,
          telephone,
          type_de_projet: projetLabelFr,
          services_souhaites: servicesLabelFr
        },
        // Champs facultatifs : envoyés seulement s'ils sont remplis.
        // L'e-mail sert d'adresse de réponse (Reply-To) chez Web3Forms.
        email ? { email, replyto: email } : {},
        message ? { message } : {}))
      });
      const result = await response.json();

      if (response.ok && result.success) {
        successText.textContent = I18N.t('form.ok_email');
        form.reset();
        syncButton();
        showStatus(successMsg);
      } else {
        throw new Error(result.message || 'Échec de l\'envoi');
      }
    } catch (err) {
      console.error('Web3Forms :', err);
      submitLabel.textContent = originalLabel;
      showStatus(failureMsg);
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = I18N.t(CHANNELS[getChannel()].labelKey);
      submitIcon.className = CHANNELS[getChannel()].icon;
    }
  });
}

/**
 * Ouvre WhatsApp (wa.me) avec un message prérempli contenant les infos du formulaire.
 */
function sendViaWhatsApp({ nom, telephone, email, projetLabel, servicesLabel, message }) {
  const lines = [
    I18N.t('wa.hello'),
    '',
    `*${I18N.t('wa.name')} :* ${nom}`,
    `*${I18N.t('wa.phone')} :* ${telephone}`,
    `*${I18N.t('wa.project')} :* ${projetLabel}`,
    `*${I18N.t('wa.services')} :* ${servicesLabel}`
  ];
  if (email) lines.push(`*${I18N.t('wa.email')} :* ${email}`);
  if (message) lines.push(`*${I18N.t('wa.message')} :* ${message}`);
  const text = lines.join('\n');

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const win = window.open(url, '_blank', 'noopener');
  if (!win) window.location.href = url; // pop-up bloqué : on redirige l'onglet courant
}

/**
 * Affiche un message d'erreur sous le champ concerné et marque le champ en rouge.
 */
function showError(form, fieldName, message) {
  const field = form.elements[fieldName];
  const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (field && field.classList) field.classList.add('input-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

/**
 * Réinitialise tous les messages d'erreur et styles d'erreur du formulaire.
 */
function clearErrors(form) {
  form.querySelectorAll('.form-input').forEach((el) => el.classList.remove('input-error'));
  form.querySelectorAll('.form-error').forEach((el) => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

/**
 * Lance les vidéos des caméras du Hero (au cas où le navigateur bloque l'autoplay)
 * et signale dans la console si un fichier vidéo est introuvable.
 */
function initHeroVideos() {
  document.querySelectorAll('.cam-tile video').forEach((video) => {
    const source = video.querySelector('source');
    const path = source ? source.getAttribute('src') : '(source manquante)';

    if (source) {
      source.addEventListener('error', () => {
        console.warn(`Vidéo introuvable : "${path}" — vérifiez que ce fichier est bien dans le même dossier que index.html.`);
      });
    }

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { /* lecture bloquée ou fichier absent : le fond du cadre reste affiché */ });
    }
  });
}

/**
 * Carrousel des avis clients (mobile) : swipe natif (scroll-snap) + flèches + puces.
 * Sur ordinateur (>= 768px), les avis restent affichés en grille et les contrôles sont masqués en CSS.
 */
function initAvisCarousel() {
  const track = document.getElementById('avis-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.avis-card'));
  const dotsWrap = document.getElementById('avis-dots');
  const prevBtn = document.getElementById('avis-prev');
  const nextBtn = document.getElementById('avis-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;

  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'avis-dot';
    dot.setAttribute('aria-label', I18N.t('carousel.dot', { n: i + 1 }));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(index) {
    const i = Math.max(0, Math.min(cards.length - 1, index));
    const card = cards[i];
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function updateState() {
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    current = closest;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cards.length - 1;
  }

  document.addEventListener('i18n:change', () => {
    dots.forEach((dot, i) => dot.setAttribute('aria-label', I18N.t('carousel.dot', { n: i + 1 })));
  });

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateState(); ticking = false; });
  }, { passive: true });

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Navigation clavier quand le carrousel a le focus
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  });

  window.addEventListener('resize', updateState);
  updateState();
}

/**
 * Bandeau de consentement aux cookies : le choix est mémorisé dans le localStorage.
 * Une fois "Accepter" cliqué, le bandeau disparaît et ne réapparaît plus aux visites suivantes.
 */
function initCookieBanner() {
  const STORAGE_KEY = 'groupcam_cookie_consent';
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  if (!banner || !acceptBtn) return;

  // Lecture sécurisée : le localStorage peut être indisponible (navigation privée, blocage...).
  let alreadyAccepted = false;
  try {
    alreadyAccepted = localStorage.getItem(STORAGE_KEY) === 'accepted';
  } catch (e) {
    alreadyAccepted = false;
  }
  if (alreadyAccepted) return;

  // Affichage avec un léger délai pour une apparition en douceur.
  banner.hidden = false;
  setTimeout(() => {
    banner.classList.add('is-visible');
    syncBannerHeight();
  }, 600);

  // Décale le bouton WhatsApp flottant au-dessus du bandeau tant qu'il est affiché.
  function syncBannerHeight() {
    document.documentElement.style.setProperty('--cookie-banner-h', banner.offsetHeight + 'px');
  }
  window.addEventListener('resize', () => { if (!banner.hidden) syncBannerHeight(); });

  acceptBtn.addEventListener('click', () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch (e) {
      /* stockage indisponible : le bandeau se fermera simplement pour cette visite */
    }
    banner.classList.remove('is-visible');
    document.documentElement.style.setProperty('--cookie-banner-h', '0px');
    setTimeout(() => { banner.hidden = true; }, 450);
  });
}

/**
 * "Nos réalisations" : défilement automatique continu en boucle infinie (CSS), sans boutons.
 * - Les vraies cartes sont écrites une seule fois dans le HTML (.marquee-group > .marquee-item).
 * - Ce script les duplique autant que nécessaire pour que chaque groupe soit au moins aussi large
 *   que l'écran (aucun vide, même avec 2 photos), puis ajoute une copie complète du groupe :
 *   l'animation CSS déplace le ruban de -50 % (= exactement un groupe) puis recommence sans à-coup.
 * - Les copies sont masquées aux lecteurs d'écran (aria-hidden) et privées de leurs attributs
 *   de traduction : elles sont régénérées à chaque changement de langue.
 * Pour ajouter une réalisation, il suffit d'ajouter un <li class="marquee-item"> dans le HTML.
 */
function initRealisationsMarquee() {
  // Galerie « Nos interventions sur le terrain » + défilements de logos (marques, références clients)
  document.querySelectorAll('.marquee').forEach(setupMarquee);
}

function setupMarquee(marquee) {
  const track = marquee.querySelector('.marquee-track');
  const group = track && track.querySelector('.marquee-group');
  if (!track || !group) return;

  // Vitesse de défilement en pixels par seconde (plus la valeur est grande, plus c'est rapide).
  // Un défilement peut fixer sa propre vitesse avec data-speed="60" (logos : plus lent).
  const customSpeed = Number(marquee.dataset.speed);
  const SPEED_DESKTOP = customSpeed > 0 ? customSpeed : 90;
  const SPEED_MOBILE = customSpeed > 0 ? customSpeed : 70; // cartes plus petites sur mobile : défilement un peu plus lent
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isLogoMarquee = marquee.classList.contains('marquee--logos');
  const logoMobileQuery = window.matchMedia('(max-width: 768px)');

  const makeClone = (node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute('data-clone', '');
    [clone, ...clone.querySelectorAll('*')].forEach((el) => {
      el.removeAttribute('data-i18n');
      el.removeAttribute('data-i18n-html');
      el.removeAttribute('data-i18n-attr');
    });
    return clone;
  };

  function build() {
    // Repart de zéro : supprime les copies précédentes
    marquee.querySelectorAll('[data-clone]').forEach((el) => el.remove());

    // Logos (marques, références) : sur ordinateur (> 768px) l'affichage reste statique, sans doublons ;
    // le défilement infini ne s'active que sur mobile (<= 768px).
    if (isLogoMarquee && !logoMobileQuery.matches) {
      marquee.classList.remove('is-static');
      marquee.classList.add('is-desktop-static');
      marquee.style.removeProperty('--marquee-duration');
      return;
    }
    marquee.classList.remove('is-desktop-static');

    if (reduceMotion.matches) {
      marquee.classList.add('is-static'); // pas d'animation : ruban défilable à la main
      return;
    }
    marquee.classList.remove('is-static');

    const originals = Array.from(group.children);
    const viewport = marquee.clientWidth;
    if (originals.length === 0 || viewport === 0) return;

    // 1) Remplit le groupe jusqu'à dépasser la largeur de l'écran.
    //    On duplique en priorité les cartes « Bientôt disponible » (data-filler) pour ne pas répéter les photos.
    const fillers = originals.filter((item) => item.hasAttribute('data-filler'));
    const fillSource = fillers.length ? fillers : originals;
    let guard = 0;
    while (group.getBoundingClientRect().width < viewport && guard < 40) {
      fillSource.forEach((item) => group.appendChild(makeClone(item)));
      guard += 1;
    }

    // 2) Copie complète du groupe : la boucle ne présente jamais de vide
    const copy = makeClone(group);
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);

    // 3) Vitesse constante, quelle que soit la largeur du groupe
    const speed = mobileQuery.matches ? SPEED_MOBILE : SPEED_DESKTOP;
    const duration = group.getBoundingClientRect().width / speed;
    marquee.style.setProperty('--marquee-duration', `${duration.toFixed(1)}s`);
  }

  build();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
  document.addEventListener('i18n:change', build);
  if (isLogoMarquee) {
    // bascule immédiate mobile <-> ordinateur (rotation de l'écran, redimensionnement de la fenêtre)
    if (logoMobileQuery.addEventListener) logoMobileQuery.addEventListener('change', build);
    else if (logoMobileQuery.addListener) logoMobileQuery.addListener(build);
  }
}


/**
 * Onglets « Nos services » : un seul service affiché à la fois, transition fluide,
 * navigation au clavier (flèches, Début, Fin) et sens de lecture respecté en arabe (RTL).
 */
function initServiceTabs() {
  const tablist = document.querySelector('.svc-tabs');
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LEAVE_MS = 160;
  let token = 0;

  function currentIndex() {
    return tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
  }

  function markTabs(index) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
  }

  function showPanel(index) {
    panels.forEach((panel, i) => {
      if (!panel) return;
      panel.classList.remove('is-leaving', 'is-entering');
      if (i === index) {
        panel.hidden = false;
        panel.classList.add('is-active');
        if (!reduceMotion.matches) {
          void panel.offsetWidth; // relance l'animation d'entrée
          panel.classList.add('is-entering');
        }
      } else {
        panel.hidden = true;
        panel.classList.remove('is-active');
      }
    });
  }

  function select(index, { focus = false } = {}) {
    if (index < 0 || index >= tabs.length) return;
    const previous = currentIndex();
    markTabs(index);
    if (focus) tabs[index].focus();

    if (index === previous) return;
    const myToken = ++token;
    const leaving = panels[previous];
    if (leaving && !reduceMotion.matches) {
      leaving.classList.add('is-leaving');
      setTimeout(() => { if (myToken === token) showPanel(index); }, LEAVE_MS);
    } else {
      showPanel(index);
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
  });

  tablist.addEventListener('keydown', (e) => {
    const rtl = document.documentElement.dir === 'rtl';
    const idx = currentIndex();
    let next = null;
    if (e.key === 'ArrowRight') next = rtl ? idx - 1 : idx + 1;
    else if (e.key === 'ArrowLeft') next = rtl ? idx + 1 : idx - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    select((next + tabs.length) % tabs.length, { focus: true });
  });
}

/* =========================================================
   Offres & Promotions — module dynamique alimenté par l'admin
   ---------------------------------------------------------
   Tant qu'aucune offre ACTIVE n'est chargée, la section #offres
   et tous les liens [data-offers-nav] (menu PC, menu mobile,
   pied de page) restent masqués (attribut hidden → display: none).

   Brancher l'admin, au choix :
   1) renseigner OFFERS_ENDPOINT (URL renvoyant du JSON), ou
   2) définir window.GROUPCAM_OFFERS = [...] avant script.js, ou
   3) appeler GroupCamOffers.set([...]) depuis n'importe quel script.

   Format d'une offre (seul "title" est obligatoire) :
   {
     "title": "Kit 4 caméras Dahua",   "title_ar": "...",
     "description": "Installation incluse.", "description_ar": "...",
     "image": "https://.../photo.jpg",
     "badge": "-15%",                  "badge_ar": "...",
     "price": 45000,                   // nombre → "45 000 DA", ou texte libre
     "old_price": 52000,
     "cta_label": "Profiter de l'offre", "cta_label_ar": "...",
     "cta_url": "#contact",
     "active": true,                   // false → offre ignorée
     "starts_at": "2026-12-01T00:00:00Z", "ends_at": "2026-12-31T23:59:59Z"
   }
   Les champs *_ar sont optionnels : sans eux, le texte français est affiché.
   ========================================================= */
const OFFERS_ENDPOINT = ''; // ex. '/api/offers' — vide = aucun chargement distant

let currentOffers = [];

function initOffers() {
  // Re-rend les cartes (textes FR/AR, devise) quand la langue change.
  document.addEventListener('i18n:change', () => renderOffers(currentOffers));

  window.GroupCamOffers = { set: setOffers };

  if (Array.isArray(window.GROUPCAM_OFFERS)) setOffers(window.GROUPCAM_OFFERS);

  if (OFFERS_ENDPOINT) {
    fetch(OFFERS_ENDPOINT, { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setOffers(Array.isArray(data) ? data : data && data.offers))
      .catch(() => { /* échec réseau : la section reste masquée */ });
  }
}

function setOffers(list) {
  currentOffers = (Array.isArray(list) ? list : []).filter(isOfferActive);
  renderOffers(currentOffers);
}

function isOfferActive(offer) {
  if (!offer || typeof offer !== 'object' || offer.active === false) return false;
  if (!(offer.title || offer.title_ar)) return false;
  const now = Date.now();
  const start = offer.starts_at ? Date.parse(offer.starts_at) : NaN;
  const end = offer.ends_at ? Date.parse(offer.ends_at) : NaN;
  if (!Number.isNaN(start) && now < start) return false;
  if (!Number.isNaN(end) && now > end) return false;
  return true;
}

function renderOffers(offers) {
  const hasOffers = offers.length > 0;

  // Liens du menu / pied de page (présents aussi sur pourquoi-nous.html)
  document.querySelectorAll('[data-offers-nav]').forEach((el) => { el.hidden = !hasOffers; });

  const section = document.getElementById('offres');
  const grid = document.getElementById('offers-grid');
  if (!section || !grid) return; // page sans section (pourquoi-nous.html)

  grid.replaceChildren(...offers.map(buildOfferCard));
  section.hidden = !hasOffers;
}

function offerLang() {
  return window.I18N ? window.I18N.lang : 'fr';
}

/** Texte d'un champ dans la langue courante, avec repli sur l'autre langue. */
function offerText(offer, field) {
  const fr = offer[field];
  const ar = offer[field + '_ar'];
  const value = offerLang() === 'ar' ? (ar || fr) : (fr || ar);
  return value === undefined || value === null ? '' : String(value).trim();
}

function formatOfferPrice(value) {
  if (value === undefined || value === null || value === '') return '';
  const isNumeric = typeof value === 'number' || /^\d+(\.\d+)?$/.test(String(value).trim());
  if (!isNumeric) return String(value).trim();
  const formatted = Number(value).toLocaleString('fr-FR');
  return offerLang() === 'ar' ? formatted + ' د.ج' : formatted + ' DA';
}

/** N'accepte que des liens http(s), tel:, mailto: ou relatifs (jamais javascript:). */
function safeOfferUrl(url, fallback) {
  if (typeof url !== 'string' || !url.trim()) return fallback;
  const value = url.trim();
  try {
    const parsed = new URL(value, window.location.href);
    return ['http:', 'https:', 'tel:', 'mailto:'].includes(parsed.protocol) ? value : fallback;
  } catch (e) {
    return fallback;
  }
}

function offerEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function buildOfferCard(offer, index) {
  const title = offerText(offer, 'title');

  const card = offerEl('article', 'offer-card');
  card.setAttribute('role', 'listitem');
  card.style.setProperty('--i', String(index));

  // --- Zone image + badge ---
  const media = offerEl('div', 'offer-media');
  const showPlaceholder = () => {
    media.classList.add('offer-media--empty');
    const icon = offerEl('i', 'fa-solid fa-shield-halved');
    icon.setAttribute('aria-hidden', 'true');
    media.prepend(icon);
  };

  const imageUrl = safeOfferUrl(offer.image, '');
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => { img.remove(); showPlaceholder(); });
    media.appendChild(img);
  } else {
    showPlaceholder();
  }

  const badgeText = offerText(offer, 'badge');
  if (badgeText) {
    // <bdi> isole le texte (évite l'inversion de "-15%" en RTL) sans changer
    // la position du badge, qui suit toujours le sens de la page.
    const badge = offerEl('span', 'offer-badge');
    badge.appendChild(offerEl('bdi', '', badgeText));
    media.appendChild(badge);
  }
  card.appendChild(media);

  // --- Corps de carte ---
  const body = offerEl('div', 'offer-body');
  body.appendChild(offerEl('h3', 'offer-title font-display', title));

  const description = offerText(offer, 'description');
  if (description) body.appendChild(offerEl('p', 'offer-desc', description));
  else body.appendChild(offerEl('div', 'offer-desc')); // garde l'alignement du bas de carte

  const price = formatOfferPrice(offer.price);
  if (price) {
    const row = offerEl('div', 'offer-price-row');
    const priceEl = offerEl('span', 'offer-price font-display', price);
    priceEl.dir = 'auto';
    row.appendChild(priceEl);

    const oldPrice = formatOfferPrice(offer.old_price);
    if (oldPrice) {
      const oldEl = offerEl('del', 'offer-old-price', oldPrice);
      oldEl.dir = 'auto';
      row.appendChild(oldEl);
    }
    body.appendChild(row);
  }

  const href = safeOfferUrl(offer.cta_url, '#contact');
  const cta = offerEl('a', 'offer-btn');
  cta.href = href;
  if (/^https?:/i.test(href)) {
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
  }
  const ctaLabel = offerText(offer, 'cta_label')
    || (window.I18N ? window.I18N.t('offers.cta') : "Profiter de l'offre");
  cta.appendChild(offerEl('span', '', ctaLabel));
  const arrow = offerEl('i', 'fa-solid fa-arrow-right');
  arrow.setAttribute('aria-hidden', 'true');
  cta.appendChild(arrow);
  body.appendChild(cta);

  card.appendChild(body);
  return card;
}
