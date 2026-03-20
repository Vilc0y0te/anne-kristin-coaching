/* ============================================
   ANNE-KRISTIN VAUDOUR — Main JavaScript
   Mobile nav, FAQ accordion, scroll animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Nav scroll state (transparent → solid) ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNavScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    };
    updateNavScroll();
    window.addEventListener('scroll', updateNavScroll, { passive: true });
  }

  // ============================================
  //   SCROLL ANIMATIONS
  // ============================================

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -80px 0px'
  });

  // Observe all fade-up elements
  document.querySelectorAll('.fade-up').forEach(el => {
    revealObserver.observe(el);
  });

  // Auto-apply fade-up to common elements
  const autoRevealSelectors = [
    '.po-item',
    '.step',
    '.card',
    '.offer-detail',
    '.testimonial',
    '.insight-card',
    '.magazine-article',
    '.magazine-feature',
    '.magazine-theme',
    '.faq-item',
    '.episode',
    '.contact-info'
  ];

  document.querySelectorAll(autoRevealSelectors.join(', ')).forEach((el) => {
    if (el.classList.contains('fade-up')) return;

    const parent = el.parentElement;
    const siblings = parent ? Array.from(parent.children).filter(c =>
      c.matches(autoRevealSelectors.join(', '))
    ) : [];
    const siblingIndex = siblings.indexOf(el);

    if (siblingIndex > 0 && siblingIndex < 8) {
      el.style.transitionDelay = (siblingIndex * 0.12) + 's';
    }

    el.classList.add('fade-up');
    revealObserver.observe(el);
  });

  // --- Section headers reveal ---
  document.querySelectorAll('.section-header, .page-hero, .magazine-divider').forEach(el => {
    if (!el.classList.contains('fade-up')) {
      el.classList.add('fade-up');
      revealObserver.observe(el);
    }
  });

  // --- Subtle parallax on hero image ---
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const rect = heroImg.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = window.scrollY * 0.04;
        heroImg.style.transform = `translateY(${offset}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  // --- Number counter animation for trust bar ---
  const counters = document.querySelectorAll('.trust-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const match = text.match(/(\d+)/);
          if (match) {
            const target = parseInt(match[1]);
            const prefix = text.substring(0, text.indexOf(match[1]));
            const suffix = text.substring(text.indexOf(match[1]) + match[1].length);
            let current = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = prefix + current + suffix;
            }, 35);
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // --- Image hover tilt effect ---
  document.querySelectorAll('.magazine-article-image, .card-img').forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = container.querySelector('img');
      if (img) {
        img.style.transform = `scale(1.03) translate(${x * 6}px, ${y * 6}px)`;
      }
    });
    container.addEventListener('mouseleave', () => {
      const img = container.querySelector('img');
      if (img) {
        img.style.transform = '';
      }
    });
  });

});
