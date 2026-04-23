(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initPreloader();
        initNavbar();
        initMobileMenu();
        initThemeToggle();
        initCustomCursor();
        initSmoothScroll();
        initBackToTop();
    });

    function initPreloader() {
        var preloader = document.getElementById('preloader');
        if (!preloader) return;
        window.addEventListener('load', function () {
            setTimeout(function () {
                preloader.classList.add('loaded');
                document.body.classList.remove('no-scroll');
                setTimeout(function () { preloader.style.display = 'none'; }, 500);
            }, 1500);
        });
        document.body.classList.add('no-scroll');
    }

    function initNavbar() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;
        var lastScroll = 0;
        var ticking = false;
        function updateNavbar() {
            var currentScroll = window.pageYOffset;
            if (currentScroll > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
            if (currentScroll > lastScroll && currentScroll > 200) { navbar.style.transform = 'translateY(-100%)'; } else { navbar.style.transform = 'translateY(0)'; }
            lastScroll = currentScroll;
            ticking = false;
        }
        window.addEventListener('scroll', function () { if (!ticking) { window.requestAnimationFrame(updateNavbar); ticking = true; } });
        updateNavbar();
    }

    function initMobileMenu() {
        var hamburger = document.getElementById('navHamburger');
        var mobileMenu = document.getElementById('mobileMenuOverlay');
        if (!hamburger || !mobileMenu) return;
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    function initThemeToggle() {
        var toggleBtn = document.getElementById('themeToggle');
        var themeIcon = document.getElementById('themeIcon');
        if (!toggleBtn || !themeIcon) return;

        var savedTheme = localStorage.getItem('hexi-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
            swapThemeImages(savedTheme);
        } else {
            swapThemeImages('dark');
        }

        toggleBtn.addEventListener('click', function () {
            var currentTheme = document.documentElement.getAttribute('data-theme');
            var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('hexi-theme', newTheme);
            updateThemeIcon(newTheme);
            swapThemeImages(newTheme);
            toggleBtn.style.transform = 'rotate(360deg)';
            setTimeout(function () { toggleBtn.style.transform = 'rotate(0deg)'; }, 500);
        });

        function updateThemeIcon(theme) {
            if (theme === 'light') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }

    function swapThemeImages(theme) {
        var allThemeImages = document.querySelectorAll('.theme-logo, .theme-client');
        allThemeImages.forEach(function (img) {
            var darkSrc = img.getAttribute('data-dark');
            var lightSrc = img.getAttribute('data-light');
            if (theme === 'dark' && darkSrc) {
                img.src = darkSrc;
            } else if (theme === 'light' && lightSrc) {
                img.src = lightSrc;
            }
        });
    }

    window.swapThemeImages = swapThemeImages;

    function initCustomCursor() {
        var cursor = document.querySelector('.custom-cursor');
        var follower = document.querySelector('.custom-cursor-follower');
        if (!cursor || !follower) return;
        if (window.innerWidth < 768 || 'ontouchstart' in window) { cursor.style.display = 'none'; follower.style.display = 'none'; return; }
        var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;
        document.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; cursor.classList.add('active'); follower.classList.add('active'); });
        document.addEventListener('mouseleave', function () { cursor.classList.remove('active'); follower.classList.remove('active'); });
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.9; cursorY += (mouseY - cursorY) * 0.9;
            followerX += (mouseX - followerX) * 0.15; followerY += (mouseY - followerY) * 0.15;
            cursor.style.transform = 'translate(' + (cursorX - 4) + 'px, ' + (cursorY - 4) + 'px)';
            follower.style.transform = 'translate(' + (followerX - 18) + 'px, ' + (followerY - 18) + 'px)';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        function cursorHoverIn() { cursor.classList.add('hover'); follower.classList.add('hover'); }
        function cursorHoverOut() { cursor.classList.remove('hover'); follower.classList.remove('hover'); }
        function bindHoverElements() {
            var els = document.querySelectorAll('a, button, .service-card, .portfolio-card, .team-card, .client-card, .filter-btn, input, textarea, select');
            els.forEach(function (el) { el.removeEventListener('mouseenter', cursorHoverIn); el.removeEventListener('mouseleave', cursorHoverOut); el.addEventListener('mouseenter', cursorHoverIn); el.addEventListener('mouseleave', cursorHoverOut); });
        }
        bindHoverElements();
        var observer = new MutationObserver(function () { bindHoverElements(); });
        var mainContent = document.getElementById('mainContent');
        if (mainContent) { observer.observe(mainContent, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); }
    }

    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]:not([data-page])');
            if (!link) return;
            var href = link.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            var navbarHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 0;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20, behavior: 'smooth' });
        });
    }

    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) { window.requestAnimationFrame(function () { if (window.pageYOffset > 400) { btn.classList.add('visible'); } else { btn.classList.remove('visible'); } ticking = false; }); ticking = true; }
        });
        btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    window.hexiDebounce = function (func, wait) { var timeout; return function () { var context = this, args = arguments; clearTimeout(timeout); timeout = setTimeout(function () { func.apply(context, args); }, wait); }; };
    window.hexiThrottle = function (func, limit) { var inThrottle; return function () { var context = this, args = arguments; if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(function () { inThrottle = false; }, limit); } }; };
})();