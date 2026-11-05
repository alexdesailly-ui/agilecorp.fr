/* ============================================
   AGILECORP - Mesure d'audience (Umami, sans cookie)
   --------------------------------------------
   1. Créer un compte gratuit sur https://cloud.umami.is (région EU)
   2. Ajouter le site "agilecorp.fr"
   3. Copier le "Website ID" ci-dessous
   Tant que l'ID est vide, rien n'est chargé ni envoyé.
   ============================================ */
(function () {
  var UMAMI_WEBSITE_ID = ''; // <-- coller ici le Website ID Umami
  var UMAMI_SRC = 'https://cloud.umami.is/script.js';

  var queue = [];
  function track(name, data) {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(name, data);
    } else {
      queue.push([name, data]);
    }
  }
  window.agileTrack = track; // utilisé par main.js (formulaire)

  if (!UMAMI_WEBSITE_ID) return;
  if (location.hostname === 'localhost' || location.protocol === 'file:') return;

  var s = document.createElement('script');
  s.defer = true;
  s.src = UMAMI_SRC;
  s.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
  s.setAttribute('data-domains', 'agilecorp.fr,www.agilecorp.fr');
  s.onload = function () {
    queue.splice(0).forEach(function (e) { track(e[0], e[1]); });
  };
  document.head.appendChild(s);

  var page = location.pathname.replace(/\/index\.html$/, '/') || '/';

  // --- Clics à intention commerciale ---
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) track('contact-email', { page: page });
    else if (href.indexOf('wa.me') !== -1) track('contact-whatsapp', { page: page });
    else if (href.indexOf('linkedin.com') !== -1) track('clic-linkedin', { page: page });
    else if (href.indexOf('#contact') !== -1) track('cta-contact', { page: page, label: (a.textContent || '').trim().slice(0, 40) });
    else if (href.indexOf('articles/') !== -1) track('ouverture-article', { article: href.split('/').pop() });
  }, true);

  // --- Lecture réelle des articles (75 % de la page) ---
  if (page.indexOf('/articles/') !== -1) {
    var done = false;
    window.addEventListener('scroll', function () {
      if (done) return;
      var h = document.documentElement;
      if ((h.scrollTop + window.innerHeight) / h.scrollHeight >= 0.75) {
        done = true;
        track('article-lu-75', { article: page.split('/').pop() });
      }
    }, { passive: true });
  }

  // --- Démarrage du formulaire (signal d'intention) ---
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('focusin', function once() {
      track('formulaire-commence');
      form.removeEventListener('focusin', once);
    });
  }
})();
