(function () {

    // ─── SMOOTH SCROLL (kein externes CDN, pure JS) ──────────────────
    let currentY = window.scrollY;
    let targetY  = window.scrollY;
    let rafId    = null;
    const ease   = 0.08; // 0.05 = sehr träge, 0.12 = schneller

    function lerp(a, b, t) { return a + (b - a) * t; }

    function smoothLoop() {
        currentY = lerp(currentY, targetY, ease);

        // Snap wenn nah genug
        if (Math.abs(targetY - currentY) < 0.5) {
            currentY = targetY;
            rafId = null;
            return;
        }

        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(smoothLoop);
    }

    window.addEventListener('wheel', function (e) {
        e.preventDefault();

        // Scroll-Geschwindigkeit skalieren
        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 40;   // Firefox Zeilen-Modus
        if (e.deltaMode === 2) delta *= 800;  // Seiten-Modus

        targetY = Math.max(0, Math.min(
            document.body.scrollHeight - window.innerHeight,
            targetY + delta * 0.8
        ));

        if (!rafId) rafId = requestAnimationFrame(smoothLoop);
    }, { passive: false });

    // Touch support
    let touchStartY = 0;
    window.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
        const delta = (touchStartY - e.touches[0].clientY) * 1.5;
        touchStartY = e.touches[0].clientY;
        targetY = Math.max(0, Math.min(
            document.body.scrollHeight - window.innerHeight,
            targetY + delta
        ));
        if (!rafId) rafId = requestAnimationFrame(smoothLoop);
    }, { passive: true });

    // Anchor links smooth
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + currentY - 80;
        targetY = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, offset));
        if (!rafId) rafId = requestAnimationFrame(smoothLoop);
    });

    // ─── SCROLL REVEAL ───────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        .sr {
            opacity: 0;
            transform: translateY(36px);
            transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
        }
        .sr.sr--left  { transform: translateX(-40px); }
        .sr.sr--right { transform: translateX(40px); }
        .sr.sr--scale { transform: translateY(20px) scale(0.97); }
        .sr.visible   { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    function initReveal() {
        const map = [
            { sel: '.hero-title',                        cls: 'sr--scale', delay: 0    },
            { sel: '.hero-subtitle',                     cls: '',          delay: 0.1  },
            { sel: '.hero-buttons',                      cls: '',          delay: 0.2  },
            { sel: '.section-title',                     cls: 'sr--scale', delay: 0    },
            { sel: '.feature-column-left  .banner-card', cls: 'sr--left',  delay: 0    },
            { sel: '.feature-column-right .banner-card', cls: 'sr--right', delay: 0    },
            { sel: '.cta-container h2',                  cls: 'sr--scale', delay: 0    },
            { sel: '.cta-container p',                   cls: '',          delay: 0.1  },
            { sel: '.cta-container .btn',                cls: '',          delay: 0.2  },
            { sel: '.footer-brand',                      cls: 'sr--left',  delay: 0    },
            { sel: '.footer-links',                      cls: 'sr--right', delay: 0    },
        ];

        map.forEach(({ sel, cls, delay }) => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.classList.add('sr');
                if (cls) el.classList.add(cls);
                el.style.transitionDelay = `${delay + i * 0.09}s`;
            });
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll('.sr').forEach(el => io.observe(el));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReveal);
    } else {
        initReveal();
    }

})();