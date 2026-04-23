/* ============================================
   HEXI AGENCY - PORTFOLIO FILTER
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initPortfolioFilter();
        initPortfolioHover();
    });

    /* ============================================
       PORTFOLIO FILTER SYSTEM
       ============================================ */
    function initPortfolioFilter() {
        var filterButtons = document.querySelectorAll('.filter-btn');
        var portfolioItems = document.querySelectorAll('.portfolio-item');
        var portfolioGrid = document.getElementById('portfolioGrid');

        if (filterButtons.length === 0 || portfolioItems.length === 0) return;

        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = this.getAttribute('data-filter');

                filterButtons.forEach(function (b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                filterPortfolio(filter);
            });
        });

        function filterPortfolio(filter) {
            var delay = 0;

            portfolioItems.forEach(function (item) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });

            setTimeout(function () {
                portfolioItems.forEach(function (item) {
                    var category = item.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.display = '';

                        setTimeout(function () {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, delay);

                        delay += 80;
                    } else {
                        item.classList.add('hidden');

                        setTimeout(function () {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            }, 300);
        }

        var urlParams = new URLSearchParams(window.location.search);
        var categoryParam = urlParams.get('category');
        if (categoryParam) {
            var targetBtn = document.querySelector('.filter-btn[data-filter="' + categoryParam + '"]');
            if (targetBtn) {
                targetBtn.click();
            }
        }
    }

    /* ============================================
       PORTFOLIO HOVER EFFECTS
       ============================================ */
    function initPortfolioHover() {
        var portfolioCards = document.querySelectorAll('.portfolio-card');

        if (portfolioCards.length === 0) return;

        if (window.innerWidth < 768 || 'ontouchstart' in window) return;

        portfolioCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = this.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                var rotateX = (y - centerY) / centerY * -4;
                var rotateY = (x - centerX) / centerX * 4;

                this.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    /* ============================================
       PORTFOLIO LIGHTBOX (Optional Enhancement)
       ============================================ */
    (function initLightbox() {
        var viewButtons = document.querySelectorAll('.portfolio-view-btn');

        viewButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                var card = this.closest('.portfolio-item');
                if (!card) return;

                var title = card.querySelector('.portfolio-title');
                var category = card.querySelector('.portfolio-category');

                console.log('View Project:', {
                    title: title ? title.textContent : '',
                    category: category ? category.textContent : ''
                });
            });
        });
    })();

})();