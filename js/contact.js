(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initContactForm();
        initInputAnimations();
    });

    function initContactForm() {
        var form = document.getElementById('contactForm');
        var submitBtn = document.getElementById('submitBtn');
        var successMessage = document.getElementById('formSuccess');

        if (!form || !submitBtn) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name');
            var email = document.getElementById('email');

            if (!name.value.trim()) {
                name.style.borderColor = '#ef4444';
                name.focus();
                return;
            } else {
                name.style.borderColor = '';
            }

            if (!email.value.trim() || !isValidEmail(email.value.trim())) {
                email.style.borderColor = '#ef4444';
                email.focus();
                return;
            } else {
                email.style.borderColor = '';
            }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            var formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
                company: document.getElementById('company') ? document.getElementById('company').value.trim() : '',
                service: document.getElementById('service') ? document.getElementById('service').value : '',
                message: document.getElementById('message') ? document.getElementById('message').value.trim() : 'No message provided'
            };

            fetch('https://formspree.io/f/xrerryve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    _replyto: formData.email,
                    email: formData.email,
                    phone: formData.phone || 'Not provided',
                    company: formData.company || 'Not provided',
                    service: formData.service || 'Not specified',
                    message: formData.message,
                    _subject: 'New Inquiry from ' + formData.name + ' — Hexi Agency'
                })
            })
            .then(function (response) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                if (response.ok) {
                    showSuccess();
                } else {
                    sendWhatsApp(formData);
                    showSuccess();
                }
            })
            .catch(function () {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                sendWhatsApp(formData);
                showSuccess();
            });

            function showSuccess() {
                if (successMessage) successMessage.classList.add('show');
                form.reset();
                clearBorders();
                setTimeout(function () {
                    if (successMessage) successMessage.classList.remove('show');
                }, 5000);
            }

            function clearBorders() {
                var inputs = form.querySelectorAll('.form-input');
                inputs.forEach(function (input) {
                    input.style.borderColor = '';
                });
            }
        });
    }

    function sendWhatsApp(data) {
        var text = '🔔 *New Inquiry — Hexi Agency*\n\n' +
                   '👤 *Name:* ' + data.name + '\n' +
                   '📧 *Email:* ' + data.email + '\n' +
                   '📱 *Phone:* ' + (data.phone || 'Not provided') + '\n' +
                   '🏢 *Company:* ' + (data.company || 'Not provided') + '\n' +
                   '🛠 *Service:* ' + (data.service || 'Not specified') + '\n\n' +
                   '💬 *Message:*\n' + data.message;

        window.open('https://wa.me/212772855818?text=' + encodeURIComponent(text), '_blank');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function initInputAnimations() {
        var inputs = document.querySelectorAll('.form-input');
        inputs.forEach(function (input) {
            input.addEventListener('focus', function () {
                this.style.borderColor = '';
                var wrapper = this.closest('.input-wrapper');
                if (wrapper) wrapper.classList.add('focused');
            });
            input.addEventListener('blur', function () {
                var wrapper = this.closest('.input-wrapper');
                if (wrapper) wrapper.classList.remove('focused');
            });
        });
    }

})();