/* =========================================================
   GROUP CAM — script.js
   Menu mobile, ombre du header au scroll, horloge du poste
   de contrôle, révélation au scroll, validation du formulaire.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderShadow();
  initLiveClock();
  initScrollReveal();
  initContactForm();
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
 * Valide le formulaire de devis côté client puis simule un envoi réussi
 * (aucun backend réel n'est branché à ce stade).
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    clearErrors(form);

    const nom = form.nom.value.trim();
    const telephone = form.telephone.value.trim();
    const projet = form.projet.value.trim();
    const message = form.message.value.trim();

    if (nom.length < 2) {
      showError(form, 'nom', 'Merci d\'indiquer votre nom.');
      isValid = false;
    }

    // Format simple : chiffres, espaces, "+" acceptés, 8 à 14 caractères utiles.
    const phonePattern = /^[0-9+\s]{8,14}$/;
    if (!phonePattern.test(telephone)) {
      showError(form, 'telephone', 'Merci d\'indiquer un numéro de téléphone valide.');
      isValid = false;
    }

    if (!projet) {
      showError(form, 'projet', 'Merci de sélectionner le type de projet.');
      isValid = false;
    }

    if (message.length < 10) {
      showError(form, 'message', 'Merci de décrire votre projet en quelques mots (10 caractères minimum).');
      isValid = false;
    }

    if (!isValid) {
      successMsg.classList.remove('visible');
      successMsg.classList.add('hidden');
      return;
    }

    // Simulation d'envoi réussi (pas de backend réel connecté).
    successMsg.classList.remove('hidden');
    successMsg.classList.add('visible');
    form.reset();
  });
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
