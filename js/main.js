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

  // --- Language preference (manual switch overrides auto-detection) ---
  document.querySelectorAll('[data-set-lang]').forEach(el => {
    el.addEventListener('click', () => {
      try { localStorage.setItem('agc_lang', el.getAttribute('data-set-lang')); } catch (e) {}
    });
  });

  // --- Form handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prenom = document.getElementById('prenom').value;
      const nom = document.getElementById('nom').value;
      const email = document.getElementById('email').value;
      const telephone = document.getElementById('telephone').value;
      const societe = document.getElementById('societe').value;
      const objet = document.getElementById('objet').value;
      const message = document.getElementById('message').value;

      const isEN = (document.documentElement.lang || 'fr').toLowerCase().indexOf('en') === 0;
      const labels = isEN
        ? { name: 'Name', email: 'Email', phone: 'Phone', company: 'Company', subject: 'Subject', message: 'Message', redirect: 'Redirecting to your email app...' }
        : { name: 'Nom', email: 'Email', phone: 'Telephone', company: 'Societe', subject: 'Objet', message: 'Message', redirect: 'Redirection vers votre messagerie...' };

      const subject = encodeURIComponent('[AgileCorp] ' + objet + ' - ' + prenom + ' ' + nom);
      const body = encodeURIComponent(
        labels.name + ' : ' + prenom + ' ' + nom + '\n' +
        labels.email + ' : ' + email + '\n' +
        labels.phone + ' : ' + telephone + '\n' +
        labels.company + ' : ' + societe + '\n' +
        labels.subject + ' : ' + objet + '\n\n' +
        labels.message + ' :\n' + message
      );
      window.location.href = 'mailto:alexandre@agilecorp.fr?subject=' + subject + '&body=' + body;

      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = labels.redirect;
      btn.style.background = '#2ecc71';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    });
  }

});
