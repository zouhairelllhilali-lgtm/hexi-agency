/* ============================================
   HEXI AGENCY - SPA ROUTER
   Handles page switching without reload
   ============================================ */

(function () {
    'use strict';

    var HexiRouter = {
        currentPage: 'home',
        isTransitioning: false,
        transitionDuration: 400,
       pages: ['home', 'about', 'services', 'team', 'clients', 'contact'],

        init: function () {
            this.bindNavigationEvents();
            this.handleInitialRoute();
            this.bindPopState();
        },

        /* ---- Bind all navigation clicks ---- */
        bindNavigationEvents: function () {
            var self = this;

            document.addEventListener('click', function (e) {
                var link = e.target.closest('[data-page]');
                if (!link) return;

                e.preventDefault();
                var page = link.getAttribute('data-page');

                if (page && self.pages.indexOf(page) !== -1) {
                    self.navigateTo(page);
                }
            });
        },

        /* ---- Handle initial URL hash ---- */
        handleInitialRoute: function () {
            var hash = window.location.hash.replace('#', '').replace('/', '');

            if (hash && this.pages.indexOf(hash) !== -1) {
                this.showPage(hash, false);
            } else {
                this.showPage('home', false);
            }
        },

        /* ---- Handle browser back/forward ---- */
        bindPopState: function () {
            var self = this;

            window.addEventListener('popstate', function (e) {
                if (e.state && e.state.page) {
                    self.showPage(e.state.page, false);
                } else {
                    var hash = window.location.hash.replace('#', '').replace('/', '');
                    if (hash && self.pages.indexOf(hash) !== -1) {
                        self.showPage(hash, false);
                    } else {
                        self.showPage('home', false);
                    }
                }
            });
        },

        /* ---- Navigate to a page ---- */
        navigateTo: function (page) {
            if (this.isTransitioning || page === this.currentPage) return;

            this.isTransitioning = true;

            /* Close mobile menu if open */
            var hamburger = document.getElementById('navHamburger');
            var mobileMenu = document.getElementById('mobileMenuOverlay');
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }

            /* Update URL */
            if (page === 'home') {
                history.pushState({ page: page }, '', '#/');
            } else {
                history.pushState({ page: page }, '', '#/' + page);
            }

            this.transitionToPage(page);
        },

        /* ---- Transition animation ---- */
        transitionToPage: function (page) {
            var self = this;
            var overlay = document.getElementById('pageTransition');
            var currentPageEl = document.getElementById('page-' + this.currentPage);

            /* Fade out current page */
            if (currentPageEl) {
                currentPageEl.classList.add('fade-out');
            }

            /* Show transition overlay */
            if (overlay) {
                overlay.classList.add('active');
            }

            setTimeout(function () {
                self.showPage(page, true);

                /* Hide transition overlay */
                setTimeout(function () {
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                    self.isTransitioning = false;
                }, 200);

            }, self.transitionDuration / 2);
        },

        /* ---- Show a specific page ---- */
        showPage: function (page, animated) {
            var self = this;

            /* Hide all pages */
            var allPages = document.querySelectorAll('.page-section');
            allPages.forEach(function (p) {
                p.classList.remove('active', 'fade-in', 'fade-out');
            });

            /* Show target page */
            var targetPage = document.getElementById('page-' + page);
            if (!targetPage) {
                targetPage = document.getElementById('page-home');
                page = 'home';
            }

            targetPage.classList.add('active');

            /* Animate in */
            if (animated) {
                requestAnimationFrame(function () {
                    targetPage.classList.add('fade-in');
                });
            } else {
                targetPage.classList.add('fade-in');
            }

            /* Update navigation active states */
            self.updateNavigation(page);

            /* Update page title */
            self.updatePageTitle(page);

            /* Scroll to top */
            window.scrollTo({ top: 0, behavior: animated ? 'smooth' : 'auto' });

            /* Reset and re-trigger animations for the new page */
            setTimeout(function () {
                self.resetPageAnimations(targetPage);
            }, animated ? 100 : 0);

            /* Update current page */
            self.currentPage = page;
        },

        /* ---- Update active nav links ---- */
        updateNavigation: function (page) {
            /* Desktop nav */
            var navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === page) {
                    link.classList.add('active');
                }
            });

            /* Mobile nav */
            var mobileLinks = document.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === page) {
                    link.classList.add('active');
                }
            });
        },

        /* ---- Update browser tab title ---- */
        updatePageTitle: function (page) {
            var titles = {
                'home': 'Hexi Agency | Digital Agency',
                'about': 'About Us | Hexi Agency',
                'services': 'Services | Hexi Agency',
                'team': 'Our Team | Hexi Agency',
                'clients': 'Our Clients | Hexi Agency',
                'contact': 'Contact Us | Hexi Agency'
            };
            document.title = titles[page] || 'Hexi Agency | Digital Agency';
        },

        /* ---- Reset and re-trigger scroll animations ---- */
        resetPageAnimations: function (pageElement) {
            var revealElements = pageElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

            /* Reset all reveal elements */
            revealElements.forEach(function (el) {
                el.classList.remove('revealed');
            });

            /* Re-observe with IntersectionObserver */
            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var delay = entry.target.getAttribute('data-delay');
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
                }, {
                    root: null,
                    rootMargin: '0px 0px -50px 0px',
                    threshold: 0.1
                });

                revealElements.forEach(function (el) {
                    observer.observe(el);
                });
            } else {
                revealElements.forEach(function (el) {
                    el.classList.add('revealed');
                });
            }

            /* Re-trigger counter animations */
            var counters = pageElement.querySelectorAll('.counter, .hero-stat-number[data-count]');
            counters.forEach(function (counter) {
                counter.textContent = '0';
            });

            if ('IntersectionObserver' in window) {
                var counterObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCounterElement(entry.target);
                            counterObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                counters.forEach(function (counter) {
                    counterObserver.observe(counter);
                });
            }

            /* Re-trigger stat bars */
            var statBars = pageElement.querySelectorAll('.stat-bar-fill');
            statBars.forEach(function (bar) {
                bar.style.width = '0';
            });

            if ('IntersectionObserver' in window) {
                var barObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var width = entry.target.getAttribute('data-width');
                            setTimeout(function () {
                                entry.target.style.width = width + '%';
                            }, 300);
                            barObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.3 });

                statBars.forEach(function (bar) {
                    barObserver.observe(bar);
                });
            }
        }
    };

    /* Counter animation helper */
    function animateCounterElement(element) {
        var target = parseInt(element.getAttribute('data-count'));
        if (!target) return;

        var duration = 2000;
        var startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutExpo(progress);
            var currentValue = Math.floor(target * easedProgress);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    /* Initialize router when DOM is ready */
    document.addEventListener('DOMContentLoaded', function () {
        HexiRouter.init();
    });

    /* Make router globally accessible */
    window.HexiRouter = HexiRouter;

})();