document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. ПЛАВНАЯ НАВИГАЦИЯ И ПОДСВЕТКА МЕНЮ
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const yOffset = -100; // Отступ под шапку
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // Подсветка активного раздела при скролле
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id], div[id].section-heading');
        const navLinks = document.querySelectorAll('.nav-link, .tab-item');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // =========================================
    // 2. УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ
    // =========================================
    const modal = document.getElementById('bookingModal');

    document.addEventListener('click', (e) => {
        // Открытие по кнопкам с атрибутом data-open-modal
        const openBtn = e.target.closest('[data-open-modal]');
        if (openBtn) {
            e.preventDefault();
            if (modal) modal.classList.add('active');
        }

        // Закрытие окна
        if (e.target.closest('#closeModal') || e.target.classList.contains('modal-overlay')) {
            if (modal) modal.classList.remove('active');
        }
    });

    // =========================================
    // 3. ОТПРАВКА ЗАЯВОК В TELEGRAM
    // =========================================
    const tgForm = document.getElementById('tgForm');

    if (tgForm) {
        tgForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // ВСТАВЬ СЮДА СВОИ ДАННЫЕ СНОВА!
            const TOKEN = "8789103931:AAHLw_mvAFbM2FprXXUAhwP4fnGWdYdvZG0";
            const CHAT_ID = "1475868054";
            const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

            const clientName = document.getElementById('clientName').value;
            const clientPhone = document.getElementById('clientPhone').value;

            let message = `🔥 <b>Новая заявка на детейлинг!</b>\n\n`;
            message += `👤 <b>Имя:</b> ${clientName}\n`;
            message += `📞 <b>Телефон:</b> ${clientPhone}`;

            const btn = tgForm.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText.innerText;
            btnText.innerText = 'ОТПРАВКА...';

            fetch(URI_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'html'
                })
            })
                .then(response => {
                    if (response.ok) {
                        btnText.innerText = 'ЗАЯВКА ПРИНЯТА ✓';
                        btn.style.background = '#10b981';
                        setTimeout(() => {
                            if (modal) modal.classList.remove('active');
                            tgForm.reset();
                            btnText.innerText = originalText;
                            btn.style.background = 'var(--accent)';
                        }, 2500);
                    } else {
                        throw new Error('Ошибка Telegram API');
                    }
                })
                .catch(err => {
                    console.error(err);
                    btnText.innerText = 'ОШИБКА ОТПРАВКИ!';
                    btn.style.background = '#ef4444';
                    setTimeout(() => {
                        btnText.innerText = originalText;
                        btn.style.background = 'var(--accent)';
                    }, 3000);
                });
        });
    }

    // =========================================
    // 4. ВАУ-ЭФФЕКТ (АНИМАЦИИ ПРИ СКРОЛЛЕ)
    // =========================================
    const elementsToAnimate = document.querySelectorAll(`
        .feature-item, 
        .service-card, 
        .gallery-item, 
        .info-card, 
        .review-card, 
        .map-container, 
        .section-heading
    `);

    // Сразу прячем элементы
    elementsToAnimate.forEach(el => el.classList.add('reveal'));

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Анимируем только один раз
            }
        });
    }, observerOptions);

    // Запускаем слежку
    elementsToAnimate.forEach(el => scrollObserver.observe(el));

});