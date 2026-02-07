/* ============================================
   ANNE-KRISTIN VAUDOUR — Main JavaScript
   Mobile nav, FAQ accordion, form handling
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

    // Close nav when a link is clicked
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

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Lead Form Handling (Netlify Forms) ---
  const leadForms = document.querySelectorAll('#leadForm');

  leadForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : '';
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send';

      if (!email) return;

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(response => {
        if (response.ok) {
          const parent = form.parentElement;
          form.style.display = 'none';
          const noteEl = parent.querySelector('.lead-form__note');
          if (noteEl) noteEl.style.display = 'none';

          const success = document.createElement('div');
          success.style.cssText = 'padding: 16px 24px; background: #E8F0E8; border-radius: 8px; color: #4A7C59; font-weight: 500; display: inline-block;';
          success.textContent = 'Thank you! Check your inbox for the guide.';
          parent.appendChild(success);
        } else {
          throw new Error('Server responded with ' + response.status);
        }
      })
      .catch(error => {
        console.error('Lead form error:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        let errorMsg = form.querySelector('.form-error');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.className = 'form-error';
          errorMsg.style.cssText = 'color: #c0392b; font-size: 0.85rem; margin-top: 8px;';
          form.appendChild(errorMsg);
        }
        errorMsg.textContent = 'Something went wrong. Please try again.';
      });
    });
  });

  // --- Contact Form Handling (Netlify Forms) ---
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show loading state
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
          // Replace form with success message
          contactForm.innerHTML = `
            <div style="text-align: center; padding: var(--space-3xl) var(--space-xl);">
              <div style="font-size: 2.5rem; margin-bottom: var(--space-md); color: #4A7C59;">&#10003;</div>
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
        // Show error state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        // Show inline error message
        let errorMsg = contactForm.querySelector('.form-error');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.className = 'form-error';
          errorMsg.style.cssText = 'color: #c0392b; background: #fdf0ef; padding: 12px 16px; border-radius: 8px; margin-top: var(--space-md); font-size: 0.9rem;';
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

  // --- Nav background on scroll ---
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        nav.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
      } else {
        nav.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Simple scroll reveal ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe key elements for reveal animation
  const revealElements = document.querySelectorAll(
    '.po-item, .method__step, .offer-card, .offer-detail, .testimonial-card, .value-card, .contact-info__item, .episode-card, .archetype-card, .insight-card'
  );

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
