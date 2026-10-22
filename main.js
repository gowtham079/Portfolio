// Portfolio JS – Hemanth S

document.addEventListener('DOMContentLoaded', function () {

  // ── Navigation ──────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function setActive(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('active');
      // Re-trigger animations on section enter
      section.querySelectorAll('.timeline-item').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth; // reflow
        el.style.animation = '';
      });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      setActive(sectionId);
    });
  });

  // Inline nav buttons (e.g. "Projects", "Internship", "Contact Me")
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      setActive(target);
      if (el.getAttribute('href') === '#experience' || el.title?.toLowerCase().includes('experience')) {
        setTimeout(() => {
          const expEl = document.getElementById('experience');
          if (expEl) expEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  });

  // Dynamic footer copyright year
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hash on load
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    setActive(hash);
  }

  // ── Typing effect ────────────────────────────────────────────
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const words = ['Data Analyst.', 'MCA Graduate.', 'Data Enthusiast.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pause = false;

    function type() {
      if (pause) return;
      const current = words[wordIndex];

      if (!isDeleting) {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          pause = true;
          setTimeout(() => { isDeleting = true; pause = false; requestAnimationFrame(tick); }, 1800);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      requestAnimationFrame(tick);
    }

    let lastTime = 0;
    function tick(timestamp) {
      const speed = isDeleting ? 60 : 110;
      if (!lastTime || timestamp - lastTime >= speed) {
        lastTime = timestamp;
        type();
      } else {
        requestAnimationFrame(tick);
      }
    }

    // Start after hero animate-in delay
    setTimeout(() => requestAnimationFrame(tick), 600);
  }

  // ── Contact form – mailto with validation & status ───────────
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('contact-status');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const messageInput = form.querySelector('[name="message"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Email format regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        if (statusDiv) {
          statusDiv.className = 'contact-status error';
          statusDiv.textContent = 'Please fill out all fields before sending.';
          statusDiv.classList.remove('d-none');
        }
        return;
      }

      if (!emailRegex.test(email)) {
        if (statusDiv) {
          statusDiv.className = 'contact-status error';
          statusDiv.textContent = 'Please enter a valid email address.';
          statusDiv.classList.remove('d-none');
        }
        return;
      }

      // Prevent accidental duplicate submission
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      const subject = encodeURIComponent('Portfolio message from ' + name);
      const body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
      const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=hemanth.s.mca@gmail.com&su=' + subject + '&body=' + body;
      const mailtoUrl = 'mailto:hemanth.s.mca@gmail.com?subject=' + subject + '&body=' + body;

      // Immediately open Gmail compose in a new tab during the user gesture
      const mailWindow = window.open(gmailUrl, '_blank');

      if (statusDiv) {
        statusDiv.className = 'contact-status success';
        statusDiv.innerHTML = 'Opening email compose for <strong>hemanth.s.mca@gmail.com</strong>...<br>' +
          '<span style="font-size:0.86rem;margin-top:6px;display:inline-block;">If email didn\'t open automatically: ' +
          '<a href="' + gmailUrl + '" target="_blank" rel="noopener noreferrer" style="color:var(--accent-purple);text-decoration:underline;font-weight:600;">Open Gmail Web</a> or ' +
          '<a href="' + mailtoUrl + '" style="color:var(--accent-green);text-decoration:underline;margin-left:6px;">Open Default Mail App</a></span>';
        statusDiv.classList.remove('d-none');
      }

      // If popup blocker stopped window.open, fall back to mailto
      if (!mailWindow || mailWindow.closed || typeof mailWindow.closed === 'undefined') {
        window.location.href = mailtoUrl;
      }

      setTimeout(() => {
        if (submitBtn) submitBtn.disabled = false;
      }, 1000);
    });
  }

  // ── Hover ripple on project cards ───────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function () {
      this.style.willChange = '';
    });
  });

  // ── Animate stats numbers safely ───────────────────────────
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    document.querySelectorAll('.stat-num').forEach(el => {
      const targetStr = el.getAttribute('data-target') || el.textContent;
      const target = parseFloat(targetStr);
      if (isNaN(target)) return;
      const isDecimal = el.getAttribute('data-decimal') === 'true' || targetStr.includes('.');
      const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : (targetStr.replace(/[\d.]/g, ''));
      let start = 0;
      const duration = 1200;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = (isDecimal ? value.toFixed(2) : Math.floor(value)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
        }
      };
      requestAnimationFrame(step);
    });
  }

  // Trigger stat animation when home section is visible
  const homeSection = document.getElementById('home');
  if (homeSection) {
    if (homeSection.classList.contains('active')) {
      setTimeout(animateStats, 300);
    }
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateStats();
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(homeSection);
  }

  // ── Universal Modal Controller (Bootstrap Compatible & Standalone Robust) ──
  function openModal(modalId) {
    const modal = document.querySelector(modalId);
    if (!modal) return;
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    document.querySelectorAll('.modal.show').forEach(m => {
      m.classList.remove('show');
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
      m.removeAttribute('aria-modal');
    });
    document.body.classList.remove('modal-open');
  }

  // Delegated click listener handles all clicks on buttons, SVGs, spans, close buttons, and backdrop
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-bs-toggle="modal"]');
    if (trigger) {
      e.preventDefault();
      const targetSelector = trigger.getAttribute('data-bs-target');
      if (targetSelector) openModal(targetSelector);
      return;
    }

    const dismiss = e.target.closest('[data-bs-dismiss="modal"]');
    if (dismiss) {
      e.preventDefault();
      closeModal();
      return;
    }

    // Click on the backdrop (outside modal dialog)
    if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

});
