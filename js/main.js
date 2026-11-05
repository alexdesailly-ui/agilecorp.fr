/* ============================================
   AGILECORP - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll behavior ---
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.remove('header--transparent');
      header.classList.add('header--solid');
    } else {
      header.classList.remove('header--solid');
      header.classList.add('header--transparent');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile navigation toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // --- Intersection Observer for animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // --- Counter animation for metrics ---
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // --- Form handling ---
  // Envoi via contact.php (Hostinger). Repli sur mailto si le serveur ne répond pas.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const startedAt = Date.now();
    const track = (name, data) => { if (window.agileTrack) window.agileTrack(name, data); };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const fd = new FormData(contactForm);
      fd.append('t', String(startedAt));
      fd.append('source', document.referrer || location.href);

      btn.disabled = true;
      btn.textContent = 'Envoi en cours...';

      let sent = false;
      try {
        const res = await fetch('contact.php', { method: 'POST', body: fd });
        const json = await res.json();
        sent = res.ok && json.ok;
      } catch (err) { sent = false; }

      if (sent) {
        track('lead-formulaire', { objet: fd.get('objet') });
        contactForm.reset();
        btn.textContent = 'Message reçu, réponse sous 24h';
        btn.style.background = '#2ecc71';
      } else {
        track('lead-formulaire-repli-mailto', { objet: fd.get('objet') });
        const subject = encodeURIComponent('[AgileCorp] ' + fd.get('objet') + ' - ' + fd.get('prenom') + ' ' + fd.get('nom'));
        const body = encodeURIComponent(
          'Nom : ' + fd.get('prenom') + ' ' + fd.get('nom') + '\n' +
          'Email : ' + fd.get('email') + '\n' +
          'Telephone : ' + fd.get('telephone') + '\n' +
          'Societe : ' + fd.get('societe') + '\n' +
          'Objet : ' + fd.get('objet') + '\n\n' +
          'Message :\n' + fd.get('message')
        );
        window.location.href = 'mailto:alexandre@agilecorp.fr?subject=' + subject + '&body=' + body;
        btn.textContent = 'Redirection vers votre messagerie...';
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.background = '';
      }, 5000);
    });
  }

});
