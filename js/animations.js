/* ============================================
   HEXI AGENCY - ANIMATIONS JAVASCRIPT
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initScrollReveal();
        initCounterAnimation();
        initStatBars();
        initParallaxEffects();
        initMagneticButtons();
        initTextSplitAnimation();
        initMarqueeSpeed();
    });

    /* ============================================
       SCROLL REVEAL (Intersection Observer)
       ============================================ */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
        );

        if (revealElements.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay');
                    if (delay) {
                        setTimeout(function () {
                            entry.target.classList.add('revealed');
                        }, parseInt(delay));
                    } else {
                        entry.target.classList.add('revealed');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ============================================
       COUNTER ANIMATION
       ============================================ */
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.counter, .hero-stat-number[data-count]');

        if (counters.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(function (counter) {
                const target = parseInt(counter.getAttribute('data-count'));
                counter.textContent = target;
            });
            return;
        }

        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });

        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;

            function easeOutExpo(t) {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            }

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

                element.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        }
    }

    /* ============================================
       STAT BAR FILL ANIMATION
       ============================================ */
    function initStatBars() {
        const statBars = document.querySelectorAll('.stat-bar-fill');

        if (statBars.length === 0) return;

        const barObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(function () {
                        entry.target.style.width = width + '%';
                    }, 300);
                    barObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        statBars.forEach(function (bar) {
            barObserver.observe(bar);
        });
    }

    /* ============================================
       PARALLAX EFFECTS
       ============================================ */
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-gradient-orb, .cta-orb, .stats-orb');

        if (parallaxElements.length === 0 || window.innerWidth < 768) return;

        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    const scrollY = window.pageYOffset;

                    parallaxElements.forEach(function (el) {
                        const speed = 0.3;
                        const rect = el.closest('section') || el.parentElement;
                        if (!rect) return;

                        const sectionTop = rect.getBoundingClientRect().top + window.pageYOffset;
                        const offset = (scrollY - sectionTop) * speed;

                        el.style.transform = 'translateY(' + offset + 'px)';
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ============================================
       MAGNETIC BUTTON EFFECT
       ============================================ */
    function initMagneticButtons() {
        if (window.innerWidth < 768 || 'ontouchstart' in window) return;

        const magneticElements = document.querySelectorAll('.btn-primary, .nav-cta-btn, .portfolio-view-btn');

        magneticElements.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                this.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });

            el.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ============================================
       TEXT SPLIT ANIMATION (Hero Title)
       ============================================ */
    function initTextSplitAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const words = heroTitle.querySelectorAll('.hero-title-highlight, .hero-title-gradient');

        words.forEach(function (word, index) {
            word.style.opacity = '0';
            word.style.transform = 'translateY(20px)';
            word.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            word.style.transitionDelay = (0.3 + index * 0.15) + 's';
        });

        const titleObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    words.forEach(function (word) {
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    });
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        titleObserver.observe(heroTitle);
    }

    /* ============================================
       MARQUEE SPEED CONTROL
       ============================================ */
    function initMarqueeSpeed() {
        const marquee = document.querySelector('.clients-track');
        if (!marquee) return;

        marquee.addEventListener('mouseenter', function () {
            this.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('mouseleave', function () {
            this.style.animationPlayState = 'running';
        });
    }

    /* ============================================
       SECTION IN-VIEW DETECTION
       ============================================ */
    (function initSectionInView() {
        document.addEventListener('DOMContentLoaded', function () {
            const sections = document.querySelectorAll('.process-section');

            if (sections.length === 0) return;

            const sectionObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, {
                threshold: 0.3
            });

            sections.forEach(function (section) {
                sectionObserver.observe(section);
            });
        });
    })();

    /* ============================================
       TILT EFFECT FOR CARDS
       ============================================ */
    (function initTiltCards() {
        document.addEventListener('DOMContentLoaded', function () {
            if (window.innerWidth < 768 || 'ontouchstart' in window) return;

            const tiltCards = document.querySelectorAll('.service-card, .value-card');

            tiltCards.forEach(function (card) {
                card.addEventListener('mousemove', function (e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / centerY * -5;
                    const rotateY = (x - centerX) / centerX * 5;

                    this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                });
            });
        });
    })();

    /* ============================================
       ACTIVE NAV LINK UPDATER
       ============================================ */
    (function initActiveNavLink() {
        document.addEventListener('DOMContentLoaded', function () {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active');
                }
                if (currentPage === '' && href === 'index.html') {
                    link.classList.add('active');
                }
            });
        });
    })();

    /* ============================================
       LAZY LOAD IMAGES (future-proof)
       ============================================ */
    (function initLazyLoad() {
        document.addEventListener('DOMContentLoaded', function () {
            const lazyImages = document.querySelectorAll('img[data-src]');

            if (lazyImages.length === 0) return;

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '100px'
                });

                lazyImages.forEach(function (img) {
                    imageObserver.observe(img);
                });
            } else {
                lazyImages.forEach(function (img) {
                    img.src = img.getAttribute('data-src');
                });
            }
        });
    })();

    /* ============================================
       SMOOTH PAGE TRANSITIONS
       ============================================ */
    (function initPageTransitions() {
        document.addEventListener('DOMContentLoaded', function () {
            const internalLinks = document.querySelectorAll('a[href$=".html"]');

            internalLinks.forEach(function (link) {
                link.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (!href || href.startsWith('http') || href.startsWith('#')) return;

                    e.preventDefault();

                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.3s ease';

                    setTimeout(function () {
                        window.location.href = href;
                    }, 300);
                });
            });

            document.body.style.opacity = '0';
            requestAnimationFrame(function () {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            });
        });
    })();

})();