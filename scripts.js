document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. TOGGLE MODO OSCURO
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('bi-moon-stars-fill');
            themeIcon.classList.add('bi-sun-fill');
        } else {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-stars-fill');
        }
    }

    // ==========================================
    // 2. ANIMACIÓN DE CONTADORES (ESTADÍSTICAS)
    // ==========================================
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ==========================================
    // 3. FADE IN AL SCROLL (Intersection Observer)
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // ==========================================
    // 4. VALIDACIÓN DE FORMULARIO
    // ==========================================
    const form = document.getElementById('subscribeForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (form.checkValidity()) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

            setTimeout(() => {
                form.reset();
                form.classList.add('d-none');
                successMessage.classList.remove('d-none');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        } else {
            form.classList.add('was-validated');
        }
    });

    // ==========================================
    // 5. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
    });

    // ==========================================
    // 6. SMOOTH SCROLL PARA LINKS INTERNOS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // ==========================================
    // 7. ANIMACIÓN DE ENTRADA INICIAL
    // ==========================================
    setTimeout(() => {
        document.querySelector('.hero-content').classList.add('is-visible');
    }, 100);

    setTimeout(() => {
        document.querySelector('.hero-image-wrapper').classList.add('is-visible');
    }, 300);

 // ==========================================
// 8. MANEJO DE MODALES DE VIDEO (aria-hidden + pausa)
// ==========================================
document.querySelectorAll('.modal').forEach(function (modal) {

    // Observar cuando Bootstrap añade aria-hidden y eliminarlo
    const observer = new MutationObserver(function () {
        if (modal.getAttribute('aria-hidden') === 'true') {
            const focused = modal.querySelector(':focus');
            if (focused) focused.blur();
            modal.removeAttribute('aria-hidden');
        }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ['aria-hidden'] });

    modal.addEventListener('shown.bs.modal', function () {
        this.removeAttribute('aria-hidden');
        const closeBtn = this.querySelector('.btn-close');
        if (closeBtn) closeBtn.focus();
    });

    modal.addEventListener('hide.bs.modal', function () {
        const focused = this.querySelector(':focus');
        if (focused) focused.blur();

        const video = this.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

});

});