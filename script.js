document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
        });
    }

    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    const cards = document.querySelectorAll('.feature-card, .role-block');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    const currentLocation = window.location.pathname;
    const filename = currentLocation.split('/').pop();
    document.querySelectorAll('.main-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename || (filename === '' && href === '/Main/index.html') || (filename === 'index.html' && href === '/Main/index.html')) {
            link.classList.add('active');
        } else if (filename === 'team.html' && href === '/Seiten/team.html') {
            link.classList.add('active');
        } else if (filename === 'über.uns.html' && href === '/Seiten/über.uns.html') {
            link.classList.add('active');
        } else if (filename === 'kontakt.html' && href === '/Seiten/kontakt.html') {
            link.classList.add('active');
        } else if (filename === 'datenschutz.html' && href === '/Seiten/datenschutz.html') {
            link.classList.add('active');
        }
    });
});

let notificationTimeout;
function showProtectionNotification() {
    let notif = document.getElementById('copy-protect-notification');
    if (notif) notif.remove();
    notif = document.createElement('div');
    notif.id = 'copy-protect-notification';
    notif.textContent = 'Geschützt - Minecraft Dominion';
    Object.assign(notif.style, {
        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%) scale(0.9)',
        backgroundColor: '#c0392b', color: '#ffffff', padding: '14px 28px', borderRadius: '50px',
        fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontWeight: 'bold', zIndex: '10000',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2) inset',
        opacity: '0', transition: 'opacity 0.2s ease, transform 0.3s ease', whiteSpace: 'nowrap',
        pointerEvents: 'none'
    });
    document.body.appendChild(notif);
    setTimeout(() => { notif.style.opacity = '1'; notif.style.transform = 'translateX(-50%) scale(1)'; }, 10);
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        if (notif) { notif.style.opacity = '0'; notif.style.transform = 'translateX(-50%) scale(0.9)'; setTimeout(() => notif.remove(), 300); }
    }, 2800);
}
document.addEventListener('contextmenu', (e) => { e.preventDefault(); showProtectionNotification(); });
document.addEventListener('keydown', (e) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    const blocked = [isCtrl && key === 's', isCtrl && key === 'u', isCtrl && key === 'c', isCtrl && key === 'v', isCtrl && key === 'x', isCtrl && key === 'p', key === 'f12', isCtrl && e.shiftKey && key === 'i', isCtrl && e.shiftKey && key === 'j', isCtrl && e.shiftKey && key === 'c'];
    if (blocked.some(Boolean)) { e.preventDefault(); showProtectionNotification(); }
});