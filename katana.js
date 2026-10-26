class KatanaManager {
    constructor() {
        this.trails = [];
        this.currentRank = 'legendary'; // options: common, epic, legendary
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        window.addEventListener('pointerdown', (e) => this.startStroke(e.clientX, e.clientY));
        window.addEventListener('pointermove', (e) => this.moveStroke(e.clientX, e.clientY));
        window.addEventListener('pointerup', () => this.endStroke());
    }

    startStroke(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
        this.trails = [{ x, y, alpha: 1.0 }];
        if (window.SoundManager) window.SoundManager.playSlash();
    }

    moveStroke(x, y) {
        if (!this.isDrawing) return;
        
        this.trails.push({ x, y, alpha: 1.0 });
        if (this.trails.length > 25) this.trails.shift();

        if (window.ParticleSystem && Math.random() < 0.4) {
            const color = this.currentRank === 'legendary' ? '#ffd700' : (this.currentRank === 'epic' ? '#b400ff' : '#ff3333');
            window.ParticleSystem.spawnSparks(x, y, color);
        }

        this.lastX = x;
        this.lastY = y;
    }

    endStroke() {
        this.isDrawing = false;
    }

    triggerHitStop() {
        if (this.currentRank === 'legendary') {
            gameState.timeScale = 0.05;
            setTimeout(() => {
                gameState.timeScale = 1.0;
            }, 50);
        }
    }

    update(dt) {
        for (let i = this.trails.length - 1; i >= 0; i--) {
            this.trails[i].alpha -= dt * 3;
            if (this.trails[i].alpha <= 0) {
                this.trails.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        if (this.trails.length < 2) return;

        ctx.save();
        ctx.lineWidth = this.currentRank === 'legendary' ? 8 : (this.currentRank === 'epic' ? 6 : 4);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < this.trails.length; i++) {
            const p1 = this.trails[i - 1];
            const p2 = this.trails[i];
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            if (this.currentRank === 'legendary') {
                ctx.strokeStyle = `rgba(255, 215, 0, ${p2.alpha})`;
                ctx.shadowColor = '#ff3333';
                ctx.shadowBlur = 15;
            } else if (this.currentRank === 'epic') {
                ctx.strokeStyle = `rgba(180, 0, 255, ${p2.alpha})`;
                ctx.shadowBlur = 8;
            } else {
                ctx.strokeStyle = `rgba(255, 51, 51, ${p2.alpha})`;
                ctx.shadowBlur = 4;
            }

            ctx.stroke();
        }
        ctx.restore();
    }
}

window.KatanaManager = new KatanaManager();
