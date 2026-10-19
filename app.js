/* Guthli Foundation — small, dependency-light interaction layer */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatNumber = (value) => Math.round(value).toLocaleString('en-IN');

  
function initLoader() {
  const loader = document.getElementById('preloader');
  const progress = loader?.querySelector('.preloader-progress');
  const percentage = loader?.querySelector('#preloaderPercentage');

  if (!loader) return;

  // Respect reduced-motion preferences.
  if (prefersReducedMotion.matches) {
    loader.remove();
    return;
  }

  let finished = false;
  let fallbackTimer;

  const finishLoader = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(fallbackTimer);

    if (progress) progress.style.width = '100%';
    if (percentage) percentage.textContent = '100%';

    window.setTimeout(() => {
      loader.classList.add('hidden');
      window.setTimeout(() => loader.remove(), 500);
    }, 180);
  };

  // Show an initial loading state.
  requestAnimationFrame(() => {
    if (progress) progress.style.width = '72%';
    if (percentage) percentage.textContent = '72%';
  });

  // Hide the loader when the page finishes loading.
  if (document.readyState === 'complete') {
    window.setTimeout(finishLoader, 220);
  } else {
    window.addEventListener('load', finishLoader, { once: true });
  }

  // Never leave the loader covering the page indefinitely.
  fallbackTimer = window.setTimeout(finishLoader, 1600);
}

  

  function initNavigation() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    if (!toggle || !menu || !navbar) return;

    const setMenuOpen = (isOpen) => {
      toggle.classList.toggle('active', isOpen);
      menu.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    };

    toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });

    let scrollQueued = false;
    const updateScrollUi = () => {
      const scrollTop = window.scrollY;
      navbar.classList.toggle('scrolled', scrollTop > 24);
      const backToTop = document.getElementById('backToTop');
      if (backToTop) backToTop.classList.toggle('visible', scrollTop > 550);
      const progressBar = document.getElementById('scrollProgress');
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
      scrollQueued = false;
    };
    window.addEventListener('scroll', () => {
      if (scrollQueued) return;
      scrollQueued = true;
      window.requestAnimationFrame(updateScrollUi);
    }, { passive: true });
    updateScrollUi();

    const backToTop = document.getElementById('backToTop');
    backToTop?.addEventListener('click', () => window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    }));
  }

  function initBanner() {
    const close = document.getElementById('bannerClose');
    const banner = document.querySelector('.independence-banner');
    close?.addEventListener('click', () => banner?.remove());
  }

  function initSeedStory() {
    const story = document.querySelector('.seed-story');
    const stage = story?.querySelector('.story-art');
    const beats = [...(story?.querySelectorAll('.story-beat') ?? [])];
    if (!story || !stage || !beats.length) return;

    const stageNames = ['A possibility', 'Strong roots', 'New growth', 'A shared canopy'];
    const label = story.querySelector('#storyStageName');
    const count = story.querySelector('#storyStageCount');
    const progress = story.querySelector('.story-progress span');
    let currentStage = -1;
    const updateStage = (index) => {
      if (index === currentStage) return;
      currentStage = index;
      beats.forEach((beat, beatIndex) => {
        const active = beatIndex === index;
        beat.classList.toggle('is-active', active);
        if (active) beat.setAttribute('aria-current', 'step');
        else beat.removeAttribute('aria-current');
      });
      stage.dataset.storyStage = String(index + 1);
      if (label) label.textContent = stageNames[index];
      if (count) count.textContent = `0${index + 1} / 0${beats.length}`;
      if (progress && window.gsap) {
        window.gsap.to(progress, { scaleX: (index + 1) / beats.length, duration: .42, ease: 'power2.out', overwrite: true });
      } else if (progress) {
        progress.style.transform = `scaleX(${(index + 1) / beats.length})`;
      }
    };

    updateStage(0);

    if (prefersReducedMotion.matches) return;

    const syncStoryChapter = () => {
      const readingLine = window.innerHeight * .58;
      let activeIndex = 0;
      beats.forEach((beat, index) => {
        if (beat.getBoundingClientRect().top <= readingLine) activeIndex = index;
      });
      updateStage(activeIndex);
    };
    let storyScrollQueued = false;
    const queueStoryChapterSync = () => {
      if (storyScrollQueued) return;
      storyScrollQueued = true;
      requestAnimationFrame(() => {
        syncStoryChapter();
        storyScrollQueued = false;
      });
    };
    window.addEventListener('scroll', queueStoryChapterSync, { passive: true });
    window.addEventListener('resize', queueStoryChapterSync, { passive: true });

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      const roots = [...stage.querySelectorAll('.story-plant-root')];
      const stems = [...stage.querySelectorAll('.story-plant-stem')];
      const branches = [...stage.querySelectorAll('.story-plant-branch')];
      const leaves = [...stage.querySelectorAll('.story-leaf')];
      [...roots, ...stems, ...branches].forEach((path) => {
        const length = path.getTotalLength();
        window.gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      window.gsap.set(leaves, { autoAlpha: 0, scale: .45, transformOrigin: '50% 75%' });
      stage.classList.add('story-art-enhanced');

      const growth = window.gsap.timeline({
        scrollTrigger: {
          trigger: story.querySelector('.story-beats'),
          start: 'top 66%',
          end: 'bottom 72%',
          scrub: 1,
          onUpdate: syncStoryChapter
        }
      });
      growth.to(roots, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      growth.to(stems, { strokeDashoffset: 0, duration: 1.1, ease: 'none' }, .85);
      growth.to(branches, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 1.8);
      growth.to(leaves.slice(0, 2), { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(1.4)' }, 2.25);
      growth.to(leaves.slice(2), { autoAlpha: 1, scale: 1, duration: .55, stagger: .12, ease: 'back.out(1.4)' }, 2.65);

      return;
    }

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) updateStage(beats.indexOf(entry.target));
      });
    }, { threshold: .55 });
    beats.forEach((beat) => observer.observe(beat));
  }

  function initGrowthIllustrations() {
    const scenes = [...document.querySelectorAll('.about-illustration, .vision-visual')];
    if (!scenes.length) return;

    if (prefersReducedMotion.matches) scenes.forEach((scene) => scene.classList.add('is-grown'));
    else {
      let revealQueued = false;
      const revealScenesInView = () => {
        revealQueued = false;
        scenes.forEach((scene) => {
          if (scene.classList.contains('is-grown')) return;
          const bounds = scene.getBoundingClientRect();
          if (bounds.top < window.innerHeight * .86 && bounds.bottom > window.innerHeight * .12) {
            scene.classList.add('is-grown');
          }
        });
      };
      const queueRevealCheck = () => {
        if (revealQueued) return;
        revealQueued = true;
        requestAnimationFrame(revealScenesInView);
      };
      window.addEventListener('scroll', queueRevealCheck, { passive: true });
      window.addEventListener('resize', queueRevealCheck, { passive: true });
      revealScenesInView();
    }

    if (prefersReducedMotion.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    scenes.forEach((scene) => {
      scene.addEventListener('pointermove', (event) => {
        const bounds = scene.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        scene.style.setProperty('--scene-tilt-x', `${x * 5}deg`);
        scene.style.setProperty('--scene-tilt-y', `${y * -5}deg`);
        if (scene.classList.contains('vision-visual')) {
  scene.style.setProperty('--canopy-float', `${y * -10}px`);
  scene.style.setProperty('--canopy-shift-x', `${x * 8}px`);
}
      });
      scene.addEventListener('pointerleave', () => {
        scene.style.setProperty('--scene-tilt-x', '0deg');
        scene.style.setProperty('--scene-tilt-y', '0deg');
        scene.style.setProperty('--canopy-float', '0px');
    scene.style.setProperty('--canopy-shift-x', '0px');
      });
    });
  }

  function initRevealsAndCounters() {
    const animated = [...document.querySelectorAll('[data-aos]')];
    const sections = [...document.querySelectorAll('.section')];
    if (!prefersReducedMotion.matches) document.body.classList.add('reveal-ready');

    if (!('IntersectionObserver' in window)) {
      animated.forEach((element) => element.classList.add('aos-animate'));
      sections.forEach((section) => section.classList.add('section-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    animated.forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.04 });
    sections.forEach((section) => sectionObserver.observe(section));

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const element = entry.target;
        const target = Number(element.dataset.target ?? element.dataset.count);
        if (!Number.isFinite(target)) return;
        if (prefersReducedMotion.matches) {
          element.textContent = formatNumber(target);
          return;
        }
        const startedAt = performance.now();
        const duration = 1150;
        const step = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = formatNumber(target * eased);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter-number, .about-stat .stat-number').forEach((element) => counterObserver.observe(element));
  }

  function showFeedback(form, message, state = 'success') {
    let feedback = form.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.className = 'form-feedback';
      feedback.setAttribute('aria-live', 'polite');
      form.append(feedback);
    }
    feedback.dataset.state = state;
    feedback.textContent = message;
  }

  function initModals() {
    const settings = [
      {
        modalId: 'applyModal', formId: 'applyForm', closeId: 'modalClose',
        publicKey: '5ATVd4xHeSdttqrIw', serviceId: 'service_2tfcpgi', templateId: 'template_vrt6ibc',
        trigger: '.apply-btn, .apply-cta-btn, .btn-primary[data-open-modal], .cta .btn-primary',
        fields: ['appName', 'appEmail', 'appPhone', 'appRole', 'appMessage'],
        getParams: (fields) => ({
          name: fields[0], email: fields[1], phone: fields[2], application_type: fields[3],
          time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          message: fields[4], recipient: 'guthlifoundation2026@gmail.com'
        }),
        busy: 'Sending application…', success: 'Application sent. Thank you for reaching out.',
        titleField: 'appRole'
      },
      {
        modalId: 'eventModal', formId: 'eventForm', closeId: 'eventModalClose',
        publicKey: '5ATVd4xHeSdttqrIw', serviceId: 'service_2tfcpgi', templateId: 'template_nw8sg54',
        trigger: '.event-register',
        fields: ['evtName', 'evtEmail', 'evtPhone', 'evtSelect', 'evtCount', 'evtMessage'],
        getParams: (fields) => ({
          name: fields[0], email: fields[1], phone: fields[2], event: fields[3], count: fields[4] || '1',
          message: fields[5], recipient: 'guthlifoundation2026@gmail.com'
        }),
        busy: 'Sending registration…', success: 'Registration received. Thank you.',
        titleField: 'evtSelect'
      }
    ];

    let activeDialog = null;
    let returnFocus = null;
    let emailInitialized = false;

    const closeDialog = () => {
      if (!activeDialog) return;
      activeDialog.modal.classList.remove('active');
      activeDialog.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (activeDialog.button) activeDialog.button.focus();
      else returnFocus?.focus();
      activeDialog = null;
    };

    settings.forEach((config) => {
      const modal = document.getElementById(config.modalId);
      const form = document.getElementById(config.formId);
      const close = document.getElementById(config.closeId);
      if (!modal || !form || !close) return;

      const openDialog = (trigger) => {
        returnFocus = trigger;
        activeDialog = { modal, button: trigger };
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        const select = document.getElementById(config.titleField);
        if (select && trigger) {
          const cardTitle = trigger.closest('.job-card')?.querySelector('.job-title')?.textContent.trim();
          const eventTitle = trigger.closest('.event-card')?.querySelector('.event-title')?.textContent.trim();
          const candidate = cardTitle || eventTitle;
          const matchingOption = [...select.options].find((option) => option.value === candidate);
          if (matchingOption) select.value = matchingOption.value;
        }
        window.setTimeout(() => document.getElementById(config.fields[0])?.focus(), 40);
      };

      document.querySelectorAll(config.trigger).forEach((trigger) => trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openDialog(trigger);
      }));
      close.addEventListener('click', closeDialog);
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeDialog();
      });

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const values = config.fields.map((id) => document.getElementById(id)?.value.trim() ?? '');
        const email = values[1];
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          document.getElementById(config.fields[1])?.focus();
          showFeedback(form, 'Please enter a valid email address.', 'error');
          return;
        }

        const submit = form.querySelector('[type="submit"]');
        const originalText = submit?.textContent ?? '';
        if (submit) {
          submit.disabled = true;
          submit.textContent = config.busy;
        }
        showFeedback(form, config.busy, 'loading');

        try {
          if (!window.emailjs) throw new Error('Email service did not load. Please try again later.');
          if (!emailInitialized) {
            window.emailjs.init(config.publicKey);
            emailInitialized = true;
          }
          await window.emailjs.send(config.serviceId, config.templateId, config.getParams(values));
          showFeedback(form, config.success);
          if (submit) submit.textContent = 'Sent';
          window.setTimeout(() => {
            form.reset();
            if (submit) { submit.disabled = false; submit.textContent = originalText; }
            closeDialog();
          }, 1100);
        } catch (error) {
          console.error('EmailJS submission failed:', error);
          showFeedback(form, 'We could not send that just now. Please try again.', 'error');
          if (submit) { submit.disabled = false; submit.textContent = originalText; }
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (!activeDialog) return;
      if (event.key === 'Escape') {
        closeDialog();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...activeDialog.modal.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const status = document.getElementById('newsletterStatus');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (status) {
        status.textContent = 'Newsletter sign-up is not connected yet. Please contact us by email.';
        status.dataset.state = 'error';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initBanner();
    initSeedStory();
    initGrowthIllustrations();
    initRevealsAndCounters();
    initModals();
    initNewsletter();
  }, { once: true });
})();