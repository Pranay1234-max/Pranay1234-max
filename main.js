/* ===========================================
   main.js — Portfolio interactions
=========================================== */

// ── Navbar scroll state ──────────────────────────────────────────────────────
(function initNavScrollState() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ── Mobile hamburger menu ────────────────────────────────────────────────────
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // Close on mobile link click
  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();


// ── Active nav link on scroll ────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('header[id], section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === '#' + id ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


// ── Scroll-triggered animations ──────────────────────────────────────────────
(function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


// ── Contact form ─────────────────────────────────────────────────────────────
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Send via EmailJS
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    emailjs.send("service_odzij7q", "template_miz27ur", {
      from_name: name,
      email: email,
      subject: subject,
      message: message,
    })
    .then(() => {
      showStatus('Message sent successfully! 🚀', 'success');
      form.reset();
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      showStatus('Error sending message. Please try again later.', 'error');
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <iconify-icon icon="lucide:send"></iconify-icon>';
    });
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }
})();


// ── Typewriter effect on code card ──────────────────────────────────────────
(function initTypewriterCursor() {
  const card = document.querySelector('.code-card__body');
  if (!card) return;
  // Add a blinking cursor after the last line
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'color:var(--accent);animation:blink 1s step-end infinite;margin-left:2px;';
  document.head.insertAdjacentHTML('beforeend',
    '<style>@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}</style>'
  );
  card.appendChild(cursor);
})();


// ── Smooth scroll polyfill for older browsers ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
