const leftFeatures = [
    {
        icon: '❤️',
        title: 'Starke Community',
        lines: [
            'Hilfsbereite und aktive Spieler',
            'Gemeinsame Projekte und Events',
            'Neue Freundschaften und unvergessliche Erlebnisse'
        ]
    },
    {
        icon: '😂',
        title: 'Lustige Momente',
        lines: [
            'Spontane und chaotische RP-Situationen',
            'Unvergessliche Fails und Insider',
            'Jede Session schreibt neue Geschichten'
        ]
    },
    {
        icon: '🎥',
        title: 'Unterhaltsame Videos',
        lines: [
            'Spannende Kriege und PvP-Highlights',
            'Hochwertiger Content aus dem Servergeschehen',
            'Erinnerungen und epische Momente für die Ewigkeit'
        ]
    }
];

const rightFeatures = [
    {
        icon: '👑',
        title: 'Einzigartiges Roleplay',
        lines: [
            'Mehrere Königreiche mit eigener Kultur und Geschichte',
            'Kriege, Bündnisse, Verrat und politische Konflikte',
            'Spieler schreiben die Geschichte der Welt selbst'
        ]
    },
    {
        icon: '⚔️',
        title: 'Bedeutungsvolle Kämpfe',
        lines: [
            'Könige kämpfen mit begrenzten Leben um ihr Reich',
            'Jeder Kampf hat echte Konsequenzen',
            'Leben gehen nur durch legitimes RP-PvP verloren'
        ]
    },
    {
        icon: '🎉',
        title: 'Einzigartige Features',
        lines: [
            'Viele Mods, Plugins und besondere Mechaniken',
            'Regelmäßige Events und spannende Herausforderungen',
            'Shops, Kopfgelder, Intrigen und unvergessliche Momente'
        ]
    }
];

function createBannerCard(icon, title, lines) {
    const card = document.createElement('div');
    card.className = 'banner-card';
    const iconDiv = document.createElement('div');
    iconDiv.className = 'banner-icon';
    iconDiv.textContent = icon;
    const textDiv = document.createElement('div');
    const titleElem = document.createElement('h3');
    titleElem.textContent = title;
    const pElem = document.createElement('p');
    pElem.innerHTML = lines.join('<br>');
    textDiv.appendChild(titleElem);
    textDiv.appendChild(pElem);
    card.appendChild(iconDiv);
    card.appendChild(textDiv);
    return card;
}

function loadFeatures() {
    const leftCol = document.querySelector('.feature-column-left');
    const rightCol = document.querySelector('.feature-column-right');
    if (leftCol && rightCol) {
        leftCol.innerHTML = '';
        rightCol.innerHTML = '';
        leftFeatures.forEach(f => leftCol.appendChild(createBannerCard(f.icon, f.title, f.lines)));
        rightFeatures.forEach(f => rightCol.appendChild(createBannerCard(f.icon, f.title, f.lines)));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFeatures);
} else {
    loadFeatures();
}