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

    if (!isValid) return;

    // Libellé lisible : le texte de l'option choisie dans le menu déroulant.
    // Libellé affiché (langue active) pour WhatsApp ; libellé français pour l'e-mail reçu par l'équipe.
    const projetOption = form.projet.selectedOptions[0];
    const projetLabel = projetOption.textContent.trim();
    const projetLabelFr = I18N.originalText(projetOption);

    if (getChannel() === 'whatsapp') {
      sendViaWhatsApp({ nom, telephone, email, projetLabel, message });
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
          type_de_projet: projetLabelFr
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
function sendViaWhatsApp({ nom, telephone, email, projetLabel, message }) {
  const lines = [
    I18N.t('wa.hello'),
    '',
    `*${I18N.t('wa.name')} :* ${nom}`,
    `*${I18N.t('wa.phone')} :* ${telephone}`,
    `*${I18N.t('wa.project')} :* ${projetLabel}`
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
  if (field) field.classList.add('input-error');
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
  const marquee = document.getElementById('realisations-marquee');
  if (!marquee) return;

  const track = marquee.querySelector('.marquee-track');
  const group = track.querySelector('.marquee-group');
  // Vitesse de défilement en pixels par seconde (plus la valeur est grande, plus c'est rapide)
  const SPEED_DESKTOP = 90;
  const SPEED_MOBILE = 110;
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
}
