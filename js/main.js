/* ============================================
   ANNE-KRISTIN VAUDOUR — Main JavaScript
   Mobile nav, FAQ accordion, form handling,
   scroll animations, dynamic elements
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation (Full-screen overlay) ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Contact Form Handling (Netlify Forms) ---
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(response => {
        if (response.ok) {
          contactForm.innerHTML = `
            <div style="text-align: center; padding: var(--space-3xl) var(--space-xl);">
              <div style="font-size: 2.5rem; margin-bottom: var(--space-md); color: var(--color-accent);">&#10003;</div>
              <h3 style="margin-bottom: var(--space-sm);">Message sent!</h3>
              <p style="color: var(--color-text-light);">Thank you for reaching out. I'll get back to you within 24 hours.</p>
            </div>
          `;
        } else {
          throw new Error('Server responded with ' + response.status);
        }
      })
      .catch(error => {
        console.error('Form submission error:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        let errorMsg = contactForm.querySelector('.form-error');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.className = 'form-error';
          errorMsg.style.cssText = 'color: #c0392b; background: #fdf0ef; padding: 12px 16px; margin-top: var(--space-md); font-size: 0.9rem;';
          contactForm.appendChild(errorMsg);
        }
        errorMsg.textContent = 'Something went wrong. Please try again or email me directly at annek.vaudour@gmail.com';
      });
    });
  }

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
  //   DYNAMIC ELEMENTS — Scroll Animations
  // ============================================

  // --- Scroll Reveal with stagger ---
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

  // Apply reveal to all key elements
  document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  ).forEach(el => {
    revealObserver.observe(el);
  });

  // Auto-apply reveal classes to common elements
  const autoRevealSelectors = [
    '.po-item',
    '.method__step',
    '.offer-card',
    '.offer-detail',
    '.testimonial-card',
    '.value-card',
    '.contact-info__item',
    '.episode-card',
    '.archetype-card',
    '.insight-card',
    '.magazine__article',
    '.magazine__feature',
    '.magazine__theme',
    '.faq__item',
    '.contact-split__form',
    '.contact-split__info'
  ];

  document.querySelectorAll(autoRevealSelectors.join(', ')).forEach((el) => {
    // Add staggered delay for grid items
    const parent = el.parentElement;
    const siblings = parent ? Array.from(parent.children).filter(c =>
      c.matches(autoRevealSelectors.join(', '))
    ) : [];
    const siblingIndex = siblings.indexOf(el);

    if (siblingIndex > 0 && siblingIndex < 8) {
      el.style.transitionDelay = (siblingIndex * 0.12) + 's';
    }

    el.classList.add('reveal-up');
    revealObserver.observe(el);
  });

  // --- Section headers: reveal with subtle slide ---
  document.querySelectorAll('.page-header, section > .container > .text-center, .magazine__divider').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // --- Gold line accents: reveal ---
  document.querySelectorAll('.gold-line').forEach(el => {
    el.classList.add('reveal-scale');
    revealObserver.observe(el);
  });

  // --- Parallax on scroll for hero image only ---
  const heroImg = document.querySelector('.hero__image');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const rect = heroImg.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = window.scrollY * 0.04;
        heroImg.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

  // --- Horizontal line animation on scroll ---
  document.querySelectorAll('.magazine__divider, .quote-banner').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // --- Number counter animation for trust bar ---
  const counters = document.querySelectorAll('.trust-bar__number');
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

  // --- Smooth image hover tilt effect ---
  document.querySelectorAll('.magazine__article-image, .offer-card__image').forEach(container => {
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
