/* ============================================
   HEXI AGENCY - PARTICLE CANVAS
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initHeroParticles();
    });

    function initHeroParticles() {
        const canvas = document.getElementById('heroParticles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles = [];
        let animationId;
        let mouseX = 0;
        let mouseY = 0;
        let isMouseOver = false;

           var config = {
            particleCount: 60,
            particleColor: 'rgba(90, 167, 80, ',
            lineColor: 'rgba(90, 167, 80, ',
            particleMinSize: 1,
            particleMaxSize: 3,
            lineDistance: 150,
            speed: 0.4,
            mouseRadius: 120
        };
        if (window.innerWidth < 768) {
            config.particleCount = 30;
            config.lineDistance = 100;
        }

        function resizeCanvas() {
            const heroSection = canvas.closest('.hero-section') || canvas.parentElement;
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (config.particleMaxSize - config.particleMinSize) + config.particleMinSize;
            this.speedX = (Math.random() - 0.5) * config.speed;
            this.speedY = (Math.random() - 0.5) * config.speed;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseDirection = 1;
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            if (this.x < 0) this.x = 0;
            if (this.x > canvas.width) this.x = canvas.width;
            if (this.y < 0) this.y = 0;
            if (this.y > canvas.height) this.y = canvas.height;

            this.opacity += this.pulseSpeed * this.pulseDirection;
            if (this.opacity >= 0.7) this.pulseDirection = -1;
            if (this.opacity <= 0.1) this.pulseDirection = 1;

            if (isMouseOver) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseRadius) {
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor + this.opacity + ')';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 2, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor + (this.opacity * 0.3) + ')';
            ctx.fill();
        };

        function createParticles() {
            particles = [];
            for (var i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawLines() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.lineDistance) {
                        var opacity = (1 - distance / config.lineDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = config.lineColor + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function drawMouseLines() {
            if (!isMouseOver) return;

            for (var i = 0; i < particles.length; i++) {
                var dx = particles[i].x - mouseX;
                var dy = particles[i].y - mouseY;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseRadius * 1.5) {
                    var opacity = (1 - distance / (config.mouseRadius * 1.5)) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = config.lineColor + opacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function (particle) {
                particle.update();
                particle.draw();
            });

            drawLines();
            drawMouseLines();

            animationId = requestAnimationFrame(animate);
        }

        var heroSection = canvas.closest('.hero-section') || canvas.parentElement;

        heroSection.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isMouseOver = true;
        });

        heroSection.addEventListener('mouseleave', function () {
            isMouseOver = false;
        });

        window.addEventListener('resize', window.hexiDebounce
            ? window.hexiDebounce(function () {
                resizeCanvas();
                createParticles();
            }, 250)
            : function () {
                resizeCanvas();
                createParticles();
            }
        );

        resizeCanvas();
        createParticles();
        animate();

        var visibilityObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!animationId) animate();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        visibilityObserver.observe(heroSection);
    }

})();