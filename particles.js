class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    spawnSparks(x, y, color = '#ff3333') {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1.0,
                color,
                size: Math.random() * 3 + 1
            });
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= dt * 2;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        for (let p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.restore();
    }
}

window.ParticleSystem = new ParticleSystem();
