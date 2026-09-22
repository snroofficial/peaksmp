(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ─── NEBEL / FOG LAYER ───────────────────────────────────────────
    const fogBlobs = [];
    const FOG_COUNT = 8;

    function createFogBlob(fromScratch) {
        const side = Math.random() > 0.5 ? 1 : -1;
        return {
            x: fromScratch ? Math.random() * canvas.width : (side === 1 ? -300 : canvas.width + 300),
            y: Math.random() * canvas.height,
            radiusX: 250 + Math.random() * 300,
            radiusY: 120 + Math.random() * 180,
            opacity: 0.04 + Math.random() * 0.07,
            speedX: (0.12 + Math.random() * 0.18) * (Math.random() > 0.5 ? 1 : -1),
            speedY: (0.04 + Math.random() * 0.08) * (Math.random() > 0.5 ? 1 : -1),
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() * 0.002 - 0.001),
            pulseOffset: Math.random() * Math.PI * 2,
            pulseSpeed: 0.003 + Math.random() * 0.004,
            // Deep dark red to near-black
            r: Math.floor(40 + Math.random() * 80),
            g: Math.floor(0 + Math.random() * 5),
            b: Math.floor(0 + Math.random() * 5),
        };
    }

    for (let i = 0; i < FOG_COUNT; i++) {
        fogBlobs.push(createFogBlob(true));
    }

    function drawFog(f, time) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);

        const pulse = 1 + 0.08 * Math.sin(time * f.pulseSpeed + f.pulseOffset);
        const rx = f.radiusX * pulse;
        const ry = f.radiusY * pulse;

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
        grad.addColorStop(0,   `rgba(${f.r}, ${f.g}, ${f.b}, ${f.opacity})`);
        grad.addColorStop(0.5, `rgba(${f.r}, ${f.g}, ${f.b}, ${f.opacity * 0.4})`);
        grad.addColorStop(1,   `rgba(${f.r}, ${f.g}, ${f.b}, 0)`);

        ctx.scale(1, ry / rx);
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    function updateFog(f) {
        f.x += f.speedX;
        f.y += f.speedY;
        f.angle += f.angleSpeed;

        const margin = 400;
        if (f.x > canvas.width + margin || f.x < -margin ||
            f.y > canvas.height + margin || f.y < -margin) {
            Object.assign(f, createFogBlob(false));
        }
    }

    // ─── ASH PARTICLES ───────────────────────────────────────────────
    const ashColors = [
        'rgba(120, 10, 10, VAL)',
        'rgba(80, 5, 5, VAL)',
        'rgba(160, 20, 20, VAL)',
        'rgba(50, 2, 2, VAL)',
        'rgba(100, 8, 8, VAL)',
        'rgba(30, 0, 0, VAL)',
        'rgba(180, 30, 30, VAL)',
        'rgba(60, 4, 4, VAL)',
    ];

    const PARTICLE_COUNT = 160;
    const particles = [];

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function createParticle(fromBottom) {
        const size = rnd(1.5, 5.5);
        const colorTemplate = ashColors[Math.floor(Math.random() * ashColors.length)];
        return {
            x: rnd(0, canvas.width),
            y: fromBottom ? canvas.height + rnd(10, 80) : rnd(0, canvas.height),
            size,
            color: colorTemplate,
            speedY: rnd(0.3, 1.3),
            speedX: rnd(-0.35, 0.35),
            angle: rnd(0, Math.PI * 2),
            angleSpeed: rnd(-0.015, 0.015),
            opacity: rnd(0.4, 1.0),
            opacityDir: Math.random() > 0.5 ? 1 : -1,
            flicker: rnd(0.005, 0.02),
            wobble: rnd(0, Math.PI * 2),
            wobbleSpeed: rnd(0.01, 0.04),
            wobbleAmp: rnd(0.3, 1.2),
            life: 1.0,
            decay: rnd(0.0008, 0.003),
            shape: Math.floor(Math.random() * 3),
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(false));
    }

    function getColor(p) {
        return p.color.replace('VAL', (p.opacity * p.life).toFixed(3));
    }

    function drawCircle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = getColor(p);
        ctx.fill();
    }

    function drawShard(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        const w = p.size * 0.6, h = p.size * 1.8;
        ctx.moveTo(0, -h);
        ctx.lineTo(w, h * 0.3);
        ctx.lineTo(-w, h * 0.3);
        ctx.closePath();
        ctx.fillStyle = getColor(p);
        ctx.fill();
        ctx.restore();
    }

    function drawEmber(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, getColor(p));
        grad.addColorStop(1, p.color.replace('VAL', '0'));
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    function drawParticle(p) {
        if (p.shape === 1) drawShard(p);
        else if (p.shape === 2) drawEmber(p);
        else drawCircle(p);
    }

    function updateParticle(p) {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmp;
        p.y -= p.speedY;
        p.angle += p.angleSpeed;
        p.life -= p.decay;
        p.opacity += p.flicker * p.opacityDir;
        if (p.opacity > 1.0 || p.opacity < 0.2) p.opacityDir *= -1;
    }

    // ─── MAIN LOOP ────────────────────────────────────────────────────
    let time = 0;

    function loop() {
        time++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw fog blobs first (behind ash)
        for (const f of fogBlobs) {
            updateFog(f);
            drawFog(f, time);
        }

        // Draw ash particles on top
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            updateParticle(p);
            drawParticle(p);
            if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
                particles[i] = createParticle(true);
            }
        }

        requestAnimationFrame(loop);
    }

    loop();
})();