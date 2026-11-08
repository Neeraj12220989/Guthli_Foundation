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

  function initDiwaliLightbox() {
    const lightbox = document.getElementById('diwaliLightbox');
    const image = lightbox?.querySelector('.diwali-lightbox-image');
    const caption = lightbox?.querySelector('.diwali-lightbox-caption');
    const close = lightbox?.querySelector('.diwali-lightbox-close');
    if (!(lightbox instanceof HTMLDialogElement) || !image || !caption || !close) return;

    document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const source = trigger.getAttribute('data-lightbox-src');
        const alt = trigger.getAttribute('data-lightbox-alt') || '';
        const thumbnail = trigger.querySelector('img');
        if (!source) return;

        image.src = source;
        image.alt = alt;
        caption.textContent = thumbnail?.alt || '';
        lightbox.showModal();
        close.focus();
      });
    });

    close.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.open) lightbox.close();
    });
  }

  function initDiwaliNavigation() {
    const target = document.getElementById('gaushala-event');
    if (!target) return;
    const heading = target.querySelector('h2');

    document.querySelectorAll('a[href="#gaushala-event"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        if (window.location.hash !== '#gaushala-event') {
          window.history.pushState(null, '', '#gaushala-event');
        }
        const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        if (!prefersReducedMotion.matches) {
          let attempts = 0;
          let settleTimer;
          const alignTarget = () => {
            const correction = target.getBoundingClientRect().top - scrollPadding;
            if (Math.abs(correction) > 8 && attempts < 5) {
              attempts += 1;
              window.scrollTo({
                top: window.scrollY + correction,
                behavior: 'smooth'
              });
            }
            window.clearTimeout(settleTimer);
            settleTimer = window.setTimeout(() => {
              window.removeEventListener('scrollend', alignTarget);
            }, 1200);
          };
          window.addEventListener('scrollend', alignTarget);
          window.setTimeout(() => window.removeEventListener('scrollend', alignTarget), 10000);
        }
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - scrollPadding,
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
        heading?.focus({ preventScroll: true });
      });
    });
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
        window.gsap.to(progress, { scaleX: (index + 1) / beats.length, duration: .42, ease: 'power2.out', overwrite: true ,clearProps: "transform,opacity,visibility",});
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
        trigger: '[data-register-event]',
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
/* =========================================================
   CORE TEAM — GSAP STORY REVEAL
   Plays the story first, then reveals the team cards.
   Falls back to static content if GSAP is unavailable.
   ========================================================= */

function initCoreTeamStory() {
    const coreGroup = document.querySelector(".team-group--core");

    if (!coreGroup) return;

    const story = coreGroup.querySelector(".core-team-story");
    const grid = coreGroup.querySelector(".team-grid");
    const cards = [...coreGroup.querySelectorAll(".team-card")];

    /*
     * Remove AOS attributes from this group.
     * GSAP owns its animations, avoiding two libraries
     * trying to control the same elements.
     */
    coreGroup.removeAttribute("data-aos");

    coreGroup.querySelectorAll("[data-aos]").forEach((element) => {
        element.removeAttribute("data-aos");
    });

    if (!story || !grid) return;

    /*
     * With reduced motion, missing GSAP, or missing
     * ScrollTrigger, simply display the complete content.
     */
    if (
        prefersReducedMotion.matches ||
        !window.gsap ||
        !window.ScrollTrigger
    ) {
        return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    const topline = story.querySelector(
        ".core-team-story__topline"
    );

    const overline = story.querySelector(
        ".core-team-story__overline"
    );

    const titleLines = [
        ...story.querySelectorAll(".core-team-story__title-line")
    ];

    const description = story.querySelector(
        ".core-team-story__description"
    );

    const footnote = story.querySelector(
        ".core-team-story__footnote"
    );

    const chapters = [
        ...story.querySelectorAll(".core-team-chapter")
    ];

    const introElements = [
        topline,
        overline,
        ...titleLines,
        description,
        footnote,
        ...chapters
    ].filter(Boolean);

    /*
     * Initial states are applied only when animations
     * are supported and motion is permitted.
     */
    gsap.set(introElements, {
        autoAlpha: 0,
        y: 24
    });

    const introTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: story,
            start: "top 78%",
            once: true
        }
    });

    // 1. The story label enters first.
    introTimeline.to(topline, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out"
    }, 0);

    // 2. Introduce the opening statement.
    introTimeline.to(overline, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out"
    }, 0.08);

    // 3. Reveal the headline line by line.
    introTimeline.to(titleLines, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.13,
        ease: "power3.out"
    }, 0.16);

    // 4. Bring in the supporting story.
    introTimeline.to(description, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out"
    }, 0.53);

    introTimeline.to(footnote, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
    }, 0.66);

    // 5. Introduce the chapters in reading order.
    introTimeline.to(chapters, {
        autoAlpha: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.14,
        ease: "power3.out"
    }, 0.3);

    /*
     * 6. Reveal the existing profile cards as the visitor
     * scrolls down to meet the people behind the story.
     */
    if (cards.length) {
        gsap.set(cards, {
            autoAlpha: 0,
            y: 32,
            scale: 0.985
        });

        gsap.to(cards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
                trigger: grid,
                start: "top 84%",
                once: true
            }
        });
    }
}
/* =========================================================
   GUTHLI FOUNDATION — CINEMATIC SCROLL NARRATIVE
   Replace the previous initScrollNarrative() with this entire
   function. Keep initCoreTeamStory() as a separate function.
   Requires GSAP + ScrollTrigger already loaded by index.html.
   ========================================================= */
function initScrollNarrative() {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const about = document.querySelector("#about");
    const footer = document.querySelector("footer#contact, #contact.footer");

    if (!about) return;

    const sections = [...document.querySelectorAll("main section.section")];
    const startIndex = sections.findIndex((section) => section.id === "about");
    const narrativeSections = startIndex >= 0
        ? sections.slice(startIndex)
        : [];

    if (!narrativeSections.length) return;

    /* A small chapter rail—created in JS so no extra HTML is required. */
    const chapterStops = [
        { id: "about", label: "The belief" },
        { id: "why-exist", label: "The need" },
        { id: "vision", label: "The future" },
        { id: "focus", label: "The plan" },
        { id: "projects", label: "Action in the field" },
        { id: "gallery", label: "Moments that matter" },
        { id: "values", label: "What guides us" },
        { id: "team", label: "The people" },
        { id: "donate", label: "Your turn" },
        { id: "contact", label: "Stay connected" }
    ];

    const chapterForSection = {
        about: 0,
        "why-exist": 1,
        vision: 2,
        mission: 2,
        approach: 2,
        focus: 3,
        projects: 4,
        events: 4,
        gallery: 5,
        values: 6,
        workflow: 6,
        impact: 6,
        team: 7,
        join: 7,
        careers: 7,
        roadmap: 7,
        donate: 8,
        contact: 9
    };

    let nav = document.querySelector(".story-nav");
    if (!nav) {
        nav = document.createElement("nav");
        nav.className = "story-nav";
        nav.setAttribute("aria-label", "Explore the Guthli story");
        nav.innerHTML = `
            <div class="story-nav__counter" aria-hidden="true">
                <span class="story-nav__current">01</span>
                <span class="story-nav__total">/ 10</span>
            </div>
            <div class="story-nav__rail" aria-hidden="true">
                <span class="story-nav__track"></span>
                <span class="story-nav__fill"></span>
                <div class="story-nav__links">
                    ${chapterStops.map((chapter, index) => `
                        <a class="story-nav__link${index === 0 ? " is-active" : ""}"
                           href="#${chapter.id}"
                           data-chapter-index="${index}"
                           data-label="${chapter.label}"
                           aria-label="Go to chapter ${String(index + 1).padStart(2, "0")}: ${chapter.label}"
                           title="${chapter.label}">
                            <span class="story-nav__dot"></span>
                        </a>
                    `).join("")}
                </div>
            </div>
            <span class="story-nav__caption" aria-hidden="true">SCROLL TO GROW</span>
        `;
        document.body.append(nav);
    }

    const navLinks = [...nav.querySelectorAll(".story-nav__link")];
    const navCurrent = nav.querySelector(".story-nav__current");
    const navFill = nav.querySelector(".story-nav__fill");
    let activeChapter = -1;

    const setActiveChapter = (index) => {
        if (index < 0 || index >= chapterStops.length || index === activeChapter) return;
        activeChapter = index;
        if (navCurrent) navCurrent.textContent = String(index + 1).padStart(2, "0");
        navLinks.forEach((link, linkIndex) => {
            const isActive = linkIndex === index;
            link.classList.toggle("is-active", isActive);
            if (isActive) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    };

    /* The no-motion/no-GSAP path keeps the ordinary page fully usable. */
    if (reduceMotion || !gsap || !ScrollTrigger) {
        nav.remove();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* GSAP becomes the owner of these sections; remove old AOS attributes
       so the existing IntersectionObserver cannot animate the same nodes. */
    [...narrativeSections, ...(footer ? [footer] : [])].forEach((root) => {
        root.removeAttribute("data-aos");
        root.querySelectorAll("[data-aos]").forEach((element) => {
            element.removeAttribute("data-aos");
            element.removeAttribute("data-aos-delay");
        });
    });

    const isAlreadyReadable = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.64 && rect.bottom > 0;
    };

    const addSectionHeaderMotion = (section) => {
        const header = section.querySelector(":scope > .container > .section-header")
            || section.querySelector(".section-header");
        if (!header) return;

        const tag = header.querySelector(".section-tag");
        const title = header.querySelector(".section-title");
        const divider = header.querySelector(".section-divider");

        if (tag && !isAlreadyReadable(tag)) {
            gsap.fromTo(tag,
                { autoAlpha: 0, x: -18 },
                {
                    autoAlpha: 1, x: 0, duration: 0.55,
                    ease: "power3.out", clearProps: "transform,opacity,visibility",
                    scrollTrigger: { trigger: header, start: "top 83%", once: true }
                }
            );
        }

        if (title && !isAlreadyReadable(title)) {
            gsap.fromTo(title,
                { autoAlpha: 0, y: 34, clipPath: "inset(0 0 100% 0)" },
                {
                    autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)",
                    duration: 0.95, ease: "power4.out",
                    clearProps: "clipPath,transform,opacity,visibility",
                    scrollTrigger: { trigger: header, start: "top 83%", once: true }
                }
            );
        }

        if (divider && !isAlreadyReadable(divider)) {
            gsap.fromTo(divider,
                { autoAlpha: 0, scaleX: 0, transformOrigin: "center center" },
                {
                    autoAlpha: 1, scaleX: 1, duration: 0.72,
                    ease: "power3.inOut", clearProps: "transform,opacity,visibility",
                    scrollTrigger: { trigger: header, start: "top 79%", once: true }
                }
            );
        }
    };

    const revealBatch = (elements, sectionId) => {
        const pending = elements.filter((element) => !isAlreadyReadable(element));
        if (!pending.length) return;

        gsap.set(pending, { autoAlpha: 0 });
        ScrollTrigger.batch(pending, {
            start: "top 88%",
            once: true,
            interval: 0.08,
            batchMax: 3,
            onEnter: (batch) => {
                gsap.fromTo(batch,
                    {
                        autoAlpha: 0,
                        y: (index) => index % 2 ? 38 : 30,
                        x: (index, element) => {
                            if (sectionId === "about") {
                                return element.classList.contains("about-visual") ? 46 : -46;
                            }
                            if (sectionId === "vision") {
                                return element.classList.contains("vision-visual") ? -42 : 42;
                            }
                            if (sectionId === "why-exist") {
                                return element.classList.contains("solution-card") ? 52 : -52;
                            }
                            if (sectionId === "projects") return index % 2 ? 34 : -34;
                            return 0;
                        },
                        scale: (index, element) => element.classList.contains("team-group") ? 1 : 0.985,
                        rotateZ: (index, element) => element.classList.contains("team-group") ? 0 : (index % 2 ? 0.8 : -0.8)
                    },
                    {
                        autoAlpha: 1, x: 0, y: 0, scale: 1, rotateZ: 0,
                        duration: 0.82,
                        stagger: { each: 0.1, from: "start" },
                        ease: "power3.out",
                        clearProps: "transform,opacity,visibility",
                        overwrite: "auto"
                    }
                );
            }
        });
    };

    const selectorsBySection = {
        about: ".about-content, .about-visual",
        "why-exist": ".why-card",
        vision: ".vision-visual, .vision-content",
        mission: ".mission-card",
        approach: ".approach-card",
        focus: ".focus-card",
        projects: ".timeline-item",
        events: ".event-card",
        values: ".value-card",
        workflow: ".workflow-step",
        impact: ".impact-counter",
        team: ".team-group:not(.team-group--core)",
        join: ".join-card",
        careers: ".job-card, .careers-cta",
        roadmap: ".roadmap-item",
        donate: ".cta-buttons",
        contact: ".footer-grid > *, .footer-bottom"
    };

    /* Create triggers in DOM order so the gallery pin is registered before
       the sections that follow it. That keeps downstream measurements sound. */
    narrativeSections.forEach((section) => {
        const chapterIndex = chapterForSection[section.id];
        if (Number.isInteger(chapterIndex)) {
            ScrollTrigger.create({
                trigger: section,
                start: "top 53%",
                end: "bottom 53%",
                onEnter: () => setActiveChapter(chapterIndex),
                onEnterBack: () => setActiveChapter(chapterIndex)
            });
        }

        addSectionHeaderMotion(section);

        /* The closing appeal is treated as a four-line manifesto, not a
           conventional section heading. Each line arrives in sequence. */
        if (section.id === "donate") {
            const manifestoLines = [...section.querySelectorAll(".cta-title")]
                .filter((element) => !isAlreadyReadable(element));
            if (manifestoLines.length) {
                gsap.fromTo(manifestoLines,
                    { autoAlpha: 0, y: 42, clipPath: "inset(0 0 100% 0)" },
                    {
                        autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)",
                        duration: 0.9, stagger: 0.14, ease: "power4.out",
                        clearProps: "clipPath,transform,opacity,visibility",
                        scrollTrigger: { trigger: section, start: "top 75%", once: true }
                    }
                );
            }
        }

        const selector = selectorsBySection[section.id];
        if (selector) {
            const elements = [...section.querySelectorAll(selector)]
                .filter((element) => !element.closest(".team-group--core"));
            revealBatch(elements, section.id);
        }

        /* A little depth on Guthli's own botanical illustrations. Animate
           the SVG inside the scene, not the pointer-responsive wrapper. */
        if (section.id === "about") {
            const plant = section.querySelector(".about-svg");
            if (plant) {
                gsap.fromTo(plant,
                    { y: 34 },
                    {
                        y: -26, ease: "none",
                        scrollTrigger: {
                            trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8
                        }
                    }
                );
            }
        }

        if (section.id === "vision") {
            const canopy = section.querySelector(".vision-svg");
            if (canopy) {
                gsap.fromTo(canopy,
                    { y: 30, scale: 0.975, transformOrigin: "center center" },
                    {
                        y: -24, scale: 1.015, ease: "none",
                        scrollTrigger: {
                            trigger: section, start: "top bottom", end: "bottom top", scrub: 0.9
                        }
                    }
                );
            }
        }

        /* Draw the program timeline's central line in sync with scroll. */
        if (section.id === "projects") {
            const line = section.querySelector(".timeline-line");
            if (line) {
                gsap.fromTo(line,
                    { scaleY: 0, transformOrigin: "top center" },
                    {
                        scaleY: 1, ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 62%",
                            end: "bottom 56%",
                            scrub: 0.65
                        }
                    }
                );
            }
        }

        /* Cinematic horizontal gallery on desktop. The actual setup is
           isolated by matchMedia and reverts on resize/reduced-motion. */
        if (section.id === "gallery") {
            const mm = gsap.matchMedia();
            mm.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", () => {
                const gallery = section;
                const container = gallery.querySelector(":scope > .container");
                const track = gallery.querySelector(".gallery-grid");
                const cards = [...gallery.querySelectorAll(".gallery-card")];
                if (!container || !track || cards.length < 2) return;

                const distance = () => Math.max(0, track.scrollWidth - container.clientWidth);
                if (distance() < 80) return;

                const horizontalTween = gsap.to(track, {
                    x: () => -distance(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: gallery,
                        start: "top top",
                        end: () => `+=${distance()}`,
                        pin: true,
                        scrub: 0.85,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });

                const cardsToReveal = cards.filter((card) => !isAlreadyReadable(card));
                if (cardsToReveal.length) {
                    gsap.fromTo(cardsToReveal,
                        { autoAlpha: 0, y: 36, rotateZ: (index) => index % 2 ? 1.2 : -1.2, scale: 0.97 },
                        {
                            autoAlpha: 1, y: 0, rotateZ: 0, scale: 1,
                            duration: 0.72, stagger: 0.08, ease: "power3.out",
                            clearProps: "transform,opacity,visibility",
                            scrollTrigger: { trigger: gallery, start: "top 76%", once: true }
                        }
                    );
                }

                /* Each photograph gets a soft edge reveal as it enters the
                   horizontal frame. Child triggers use containerAnimation. */
                cards.forEach((card) => {
                    const image = card.querySelector("img");
                    if (!image) return;
                    gsap.fromTo(image,
                        { clipPath: "inset(0 0 0 16%)" },
                        {
                            clipPath: "inset(0 0 0 0%)",
                            ease: "none",
                            scrollTrigger: {
                                trigger: card,
                                containerAnimation: horizontalTween,
                                start: "left 92%",
                                end: "left 22%",
                                scrub: true
                            }
                        }
                    );
                });
            });
        }
    });

    if (footer) {
        ScrollTrigger.create({
            trigger: footer,
            start: "top 53%",
            end: "bottom 53%",
            onEnter: () => setActiveChapter(9),
            onEnterBack: () => setActiveChapter(9)
        });
    }

    /* Reveal the chapter rail only from Who We Are through the footer. */
    ScrollTrigger.create({
        trigger: about,
        start: "top 70%",
        endTrigger: footer || narrativeSections[narrativeSections.length - 1],
        end: "bottom top",
        onEnter: () => nav.classList.add("is-visible"),
        onEnterBack: () => nav.classList.add("is-visible"),
        onLeave: () => nav.classList.remove("is-visible"),
        onLeaveBack: () => nav.classList.remove("is-visible")
    });

    /* One continuous progress line across the full story. */
    if (navFill) {
        gsap.fromTo(navFill,
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: about,
                    start: "top center",
                    endTrigger: footer || narrativeSections[narrativeSections.length - 1],
                    end: "bottom center",
                    scrub: 0.2
                }
            }
        );
    }

    /* Let the browser finish loading natural dimensions before measuring
       pins; refresh again if lazy-loaded photos arrive later. */
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    document.querySelectorAll("#gallery img, #about img").forEach((image) => {
        if (!image.complete) {
            image.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        }
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
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
document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initNavigation();
    initBanner();
    initDiwaliNavigation();

    // Existing opening story.
    initSeedStory();

    // New continuous narrative, starting at Who We Are.
    initScrollNarrative();

    // Existing Core Team story animation.
    initCoreTeamStory();

    initGrowthIllustrations();
    initRevealsAndCounters();
    initModals();
    initDiwaliLightbox();
    initNewsletter();
}, { once: true });
})();