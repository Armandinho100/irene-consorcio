/**
 * IRENE CAMPOS — CONSULTORIA EM CONSÓRCIOS
 * Interações: Menu Mobile, Simulador de Veículos, WhatsApp Dinâmico,
 * FAQ Accordion, Lightbox da Galeria e Animações de Scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '5598981511245';

  /* ========================================================================
     1. DADOS DO SIMULADOR DE CONSÓRCIO DE VEÍCULOS (TABELA OFICIAL)
     ======================================================================== */
  const SIMULATION_TABLE = {
    30000: {
      96: '298,38',
      86: '327,78',
      76: '364,92',
      66: '408,72',
      56: '473,66',
      46: '560,30',
      36: '703,67'
    },
    35000: {
      96: '348,11',
      86: '382,41',
      76: '425,74',
      66: '476,84',
      56: '552,61',
      46: '653,69',
      36: '820,95'
    },
    40000: {
      96: '397,84',
      86: '437,04',
      76: '486,56',
      66: '544,95',
      56: '631,55',
      46: '747,07',
      36: '938,23'
    }
  };

  const formatCreditBRL = (value) => {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  /* ========================================================================
     2. INICIALIZAÇÃO DO SIMULADOR
     ======================================================================== */
  const initSimulator = () => {
    const creditButtons = document.querySelectorAll('.credit-options .sim-chip');
    const termButtons = document.querySelectorAll('.term-options .sim-chip');
    const displayCredit = document.getElementById('sim-display-credit');
    const displayTerm = document.getElementById('sim-display-term');
    const displayInstallment = document.getElementById('sim-display-installment');
    const whatsappBtn = document.getElementById('sim-whatsapp-btn');

    if (!creditButtons.length || !termButtons.length || !displayInstallment || !whatsappBtn) {
      return;
    }

    let selectedCredit = 30000;
    let selectedTerm = 86;

    const updateSimulatorUI = () => {
      const creditPlans = SIMULATION_TABLE[selectedCredit];
      if (!creditPlans || !creditPlans[selectedTerm]) return;

      const formattedCredit = formatCreditBRL(selectedCredit);
      const installmentValue = creditPlans[selectedTerm];

      if (displayCredit) displayCredit.textContent = formattedCredit;
      if (displayTerm) displayTerm.textContent = `${selectedTerm} meses`;
      displayInstallment.textContent = `R$ ${installmentValue}`;

      const message = `Olá, Irene! Fiz uma simulação no seu site e gostaria de saber mais sobre o consórcio de veículo de ${formattedCredit}, com prazo de ${selectedTerm} meses e parcela de referência de R$ ${installmentValue}.`;
      whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    creditButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedCredit = Number(btn.dataset.credit);
        creditButtons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        updateSimulatorUI();
      });
    });

    termButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedTerm = Number(btn.dataset.term);
        termButtons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        updateSimulatorUI();
      });
    });

    updateSimulatorUI();
  };

  /* ========================================================================
     3. HEADER & MENU MOBILE
     ======================================================================== */
  const initNavigation = () => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const closeMenu = () => {
      if (!menuToggle || !mainNav) return;
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    };

    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute(
          'aria-label',
          isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
        );
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
          closeMenu();
          menuToggle.focus();
        }
      });
    }

    const handleScroll = () => {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  /* ========================================================================
     4. FAQ ACCORDION
     ======================================================================== */
  const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const button = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!button || !answer) return;

      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Fecha os demais itens para manter a leitura limpa
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAns = otherItem.querySelector('.faq-answer');
            otherItem.classList.remove('is-open');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.hidden = true;
          }
        });

        button.setAttribute('aria-expanded', String(!isExpanded));
        answer.hidden = isExpanded;
        item.classList.toggle('is-open', !isExpanded);
      });
    });
  };

  /* ========================================================================
     5. LIGHTBOX DA GALERIA EDITORIAL
     ======================================================================== */
  const initGalleryLightbox = () => {
    const triggers = document.querySelectorAll('.gal-trigger');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const backdrop = document.querySelector('[data-close-lightbox]');

    if (!triggers.length || !lightbox || !lightboxImg) return;

    let lastFocusedElement = null;

    const openLightbox = (src, alt, caption) => {
      lastFocusedElement = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = alt || caption || 'Fotografia ampliada';
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightboxImg.src = '';
      document.body.style.overflow = '';
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const img = trigger.querySelector('img');
        const fullSrc = trigger.dataset.full || (img ? img.src : '');
        const caption = trigger.dataset.caption || '';
        const alt = img ? img.alt : caption;
        if (fullSrc) openLightbox(fullSrc, alt, caption);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
      }
    });
  };

  /* ========================================================================
     6. ANIMAÇÕES DISCRETAS DE ENTRADA (INTERSECTION OBSERVER)
     ======================================================================== */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  };

  /* ========================================================================
     7. ANO ATUAL NO RODAPÉ
     ======================================================================== */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initSimulator();
  initNavigation();
  initFaqAccordion();
  initGalleryLightbox();
  initScrollReveal();
});