/* ====================================================
   GUTHILI FOUNDATION — Premium NGO Website
   script.js
   ==================================================== */

// ============================================
// PRELOADER
// ============================================
const preloader = {
    init() {
        const loader = document.getElementById('preloader');
        const progressBar = document.querySelector('.preloader-progress');
        const percentageEl = document.getElementById('preloaderPercentage');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.style.overflow = 'visible';
                    this.initAnimations();
                }, 500);
            }
            progressBar.style.width = progress + '%';
            percentageEl.textContent = Math.floor(progress) + '%';
        }, 200);
    },

    initAnimations() {
        // Trigger GSAP animations after preloader
        this.animateHeroElements();
    },

    animateHeroElements() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        tl.from('.hero-title .text-reveal-inner', {
            y: '100%',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        })
        .from('.hero-subtitle', {
            y: 40,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from('.hero-motto', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.5')
        .from('.hero-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        }, '-=0.4')
        .from('.scroll-indicator', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.3');
    }
};

// ============================================
// SMOOTH SCROLL WITH LENIS
// ============================================
const smoothScroll = {
    lenis: null,

    init() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 1.2,
            wheelMultiplier: 0.8,
            mouseMultiplier: 1,
            infinite: false,
            lerp: 0.08,
        });

        // Link Lenis scroll to GSAP ScrollTrigger
        this.lenis.on('scroll', ScrollTrigger.update);

        // Use requestAnimationFrame for smoother GSAP + Lenis integration
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        // Handle resize events to recalculate
        window.addEventListener('resize', () => {
            this.lenis.resize();
        });
    }
};

// ============================================
// NAVIGATION
// ============================================
const navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.handleScroll();
        this.handleToggle();
        this.handleLinks();
        this.magneticButtons();
    },

    handleScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    },

    handleToggle() {
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        });
    },

    handleLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    },

    magneticButtons() {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
};

// ============================================
// MOUSE FOLLOWER
// ============================================
const mouseFollower = {
    init() {
        const follower = document.getElementById('mouseFollower');
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hide on touch devices
        if ('ontouchstart' in window) {
            follower.style.display = 'none';
            return;
        }

        function animate() {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            
            follower.style.transform = `translate(${currentX}px, ${currentY}px)`;
            requestAnimationFrame(animate);
        }

        animate();

        // Add active state on hoverable elements
        document.querySelectorAll('a, button, .btn, .nav-link, .focus-card, .approach-card, .mission-card, .team-card, .join-card').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('active'));
        });
    }
};

// ============================================
// HERO PARTICLES
// ============================================
const heroParticles = {
    init() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                animation: floatParticle ${Math.random() * 10 + 8}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }

        // Add keyframes dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: ${Math.random() * 0.5 + 0.1}; }
                25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -50 - 20}px) scale(1.2); }
                50% { transform: translate(${Math.random() * -80 + 40}px, ${Math.random() * -80 - 30}px) scale(0.8); }
                75% { transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * -40 - 10}px) scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================
// FLOATING LEAVES
// ============================================
const floatingLeaves = {
    init() {
        const container = document.getElementById('floatingLeaves');
        if (!container) return;

        const leafColors = ['#0B6E4F', '#2E8B57', '#3DAF6E', '#F59E0B', '#D97706'];
        const leafShapes = [
            'M0,0 Q15,-10 30,0 Q15,10 0,0',
            'M0,0 Q10,-15 20,0 Q10,10 0,0',
            'M0,0 Q20,-8 35,0 Q20,8 0,0'
        ];

        for (let i = 0; i < 12; i++) {
            const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const size = Math.random() * 20 + 15;
            const color = leafColors[Math.floor(Math.random() * leafColors.length)];
            const shape = leafShapes[Math.floor(Math.random() * leafShapes.length)];
            const startLeft = Math.random() * 100;
            const startDelay = Math.random() * 10;
            const duration = Math.random() * 15 + 20;

            path.setAttribute('d', shape);
            path.setAttribute('fill', color);
            path.setAttribute('opacity', '0.3');

            leaf.setAttribute('viewBox', '0 0 35 15');
            leaf.setAttribute('width', size);
            leaf.setAttribute('height', size * 0.5);
            leaf.style.cssText = `
                position: absolute;
                left: ${startLeft}%;
                top: -50px;
                pointer-events: none;
                animation: leafFall${i} ${duration}s ease-in-out infinite;
                animation-delay: ${startDelay}s;
                transform: rotate(${Math.random() * 360}deg);
            `;
            leaf.appendChild(path);
            container.appendChild(leaf);

            // Dynamic keyframes for each leaf
            const keyframes = `
                @keyframes leafFall${i} {
                    0% { transform: translateY(-50px) rotate(0deg) scale(1); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(110vh) rotate(${Math.random() * 720 - 360}deg) scale(0.6); opacity: 0; }
                }
            `;
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
    }
};

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const scrollProgressBar = {
    init() {
        const progressBar = document.getElementById('scrollProgress');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }
};

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = {
    init() {
        const btn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            smoothScroll.lenis.scrollTo(0, { duration: 1.5 });
        });
    }
};

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================
const themeToggle = {
    init() {
        const toggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        const sunIcon = toggle.querySelector('.sun-icon');
        const moonIcon = toggle.querySelector('.moon-icon');

        // Check saved preference
        const savedTheme = localStorage.getItem('guthli-theme');
        if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        }

        toggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('guthli-theme', newTheme);

            // Animate icon swap
            if (newTheme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }
};

// ============================================
// AOS (Animate on Scroll) INIT
// ============================================
const aosInit = {
    init() {
        AOS.init({
            duration: 800,
            once: true,
            mirror: false,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
};

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
const gsapAnimations = {
    init() {
        this.animateImpactCounters();
        this.animateAboutStats();
        this.animateTimelineItems();
        this.animateWorkflowSteps();
        this.animateValueCards();
    },

    animateImpactCounters() {
        const counters = document.querySelectorAll('.counter-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                onEnter: () => {
                    this.animateCounter(counter, target);
                },
                once: true
            });
        });
    },

    animateCounter(element, target) {
        let current = 0;
        const increment = Math.ceil(target / 60);
        const duration = 2000;
        const stepTime = duration / (target / increment);

        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                current = target;
                element.textContent = current.toLocaleString();
                return;
            }
            element.textContent = current.toLocaleString();
            setTimeout(updateCounter, stepTime);
        };

        updateCounter();
    },

    animateAboutStats() {
        const statNumbers = document.querySelectorAll('.about-stat .stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    this.animateCounter(stat, target);
                },
                once: true
            });
        });
    },

    animateTimelineItems() {
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: i % 2 === 0 ? -60 : 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    },

    animateWorkflowSteps() {
        gsap.utils.toArray('.workflow-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });
    },

    animateValueCards() {
        gsap.utils.toArray('.value-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.6,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.08,
                ease: 'back.out(1.7)'
            });
        });
    }
};

// ============================================
// CTA PARTICLES
// ============================================
const ctaParticles = {
    init() {
        const container = document.getElementById('ctaParticles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 6 + 3;
            const colors = ['rgba(255,215,0,', 'rgba(255,255,255,', 'rgba(46,139,87,'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color}${Math.random() * 0.3 + 0.1})};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                animation: ctaFloatParticle ${Math.random() * 8 + 6}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes ctaFloatParticle {
                0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
                50% { transform: translateY(-30px) scale(1.3); opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForm = {
    init() {
        const form = document.getElementById('newsletterForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Animate submission
            const btn = form.querySelector('.btn-subscribe');
            const originalText = btn.textContent;
            btn.textContent = '✓ Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #2E8B57, #0B6E4F)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                form.querySelector('input[type="email"]').value = '';
            }, 3000);

            // Here you would typically send this to your backend
            console.log('Newsletter subscription:', email);
        });
    }
};

// ============================================
// RIPPLE EFFECT ON BUTTONS
// ============================================
const rippleEffect = {
    init() {
        document.querySelectorAll('.btn, .nav-donate-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                    animation: rippleAnim 0.6s ease-out forwards;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleAnim {
                0% { width: 0; height: 0; opacity: 0.5; }
                100% { width: 300px; height: 300px; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================
// IMAGE TILT EFFECT
// ============================================
const tiltEffect = {
    init() {
        document.querySelectorAll('.about-illustration').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                el.style.transition = 'transform 0.5s ease';
            });
        });
    }
};

// ============================================
// INTERSECTION OBSERVER FOR LAZY SECTIONS
// ============================================
const sectionObserver = {
    init() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));
    }
};

// ============================================
// SMOOTH NAV LINK SCROLL
// ============================================
const smoothNavScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target && smoothScroll.lenis) {
                    smoothScroll.lenis.scrollTo(target, {
                        offset: -70,
                        duration: 1.2
                    });
                }
            });
        });
    }
};

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
const performance = {
    init() {
        // Deactivate animations on devices with prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Debounce scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
};

// ============================================
// MOBILE DETECTION & ADAPTATION
// ============================================
const mobileAdaptation = {
    init() {
        if ('ontouchstart' in window) {
            document.querySelectorAll('.team-card, .focus-card, .approach-card, .mission-card, .join-card').forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'translateY(-8px)';
                });
                card.addEventListener('touchend', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        }
    }
};

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    performance.init();
    preloader.init();
    
    // Initialize after preloader
    setTimeout(() => {
        smoothScroll.init();
        navigation.init();
        mouseFollower.init();
        heroParticles.init();
        floatingLeaves.init();
        scrollProgressBar.init();
        backToTop.init();
        themeToggle.init();
        aosInit.init();
        gsapAnimations.init();
        ctaParticles.init();
        newsletterForm.init();
        rippleEffect.init();
        tiltEffect.init();
        sectionObserver.init();
        smoothNavScroll.init();
        mobileAdaptation.init();
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Update AOS
    AOS.refresh();
    
    // Update ScrollTrigger
    ScrollTrigger.refresh();
});

// ============================================
// REGISTER GSAP PLUGINS
// ============================================
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

console.log('%c🌱 Guthli Foundation', 'font-size: 24px; font-weight: bold; color: #0B6E4F;');
console.log('%cEvery Seed Holds the Power of Change', 'font-size: 14px; color: #2E8B57; font-style: italic;');
console.log('%cMade with ❤️ by DEVTRI', 'font-size: 12px; color: #6B7280;');

