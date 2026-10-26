class ChestSystem {
    constructor() {
        this.hits = 0;
        this.maxHits = 5;
        this.lastDirection = null;
        this.lastX = null;
        this.isOpen = false;

        const chestBox = document.getElementById('chestBox');
        
        chestBox.addEventListener('pointerdown', (e) => {
            this.lastX = e.clientX;
        });

        chestBox.addEventListener('pointermove', (e) => {
            if (this.isOpen || this.lastX === null) return;
            
            const currentX = e.clientX;
            const diffX = currentX - this.lastX;

            if (Math.abs(diffX) > 60) {
                const direction = diffX > 0 ? 'right' : 'left';

                if (this.lastDirection && this.lastDirection !== direction) {
                    this.registerValidHit();
                    this.lastX = currentX;
                } else if (!this.lastDirection) {
                    this.lastDirection = direction;
                    this.registerValidHit();
                    this.lastX = currentX;
                }
            }
        });

        chestBox.addEventListener('pointerup', () => {
            this.lastX = null;
        });
    }

    registerValidHit() {
        if (this.isOpen) return;
        this.hits++;
        document.getElementById('chestHitsCount').textContent = this.hits;

        if (window.SoundManager) window.SoundManager.playChestHit();
        if (window.ParticleSystem) {
            const rect = document.getElementById('chestSprite').getBoundingClientRect();
            window.ParticleSystem.spawnSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ffd700');
        }

        const sprite = document.getElementById('chestSprite');
        sprite.style.transform = `scale(0.9) rotate(${(Math.random() - 0.5) * 15}deg)`;
        setTimeout(() => {
            sprite.style.transform = 'scale(1) rotate(0deg)';
        }, 100);

        if (this.hits >= this.maxHits) {
            this.openChest();
        }
    }

    openChest() {
        this.isOpen = true;
        document.getElementById('chestModal').classList.add('hidden');
        if (typeof addScore === 'function') addScore(500);
        alert('Печать разрушена! Вы получили Легендарную КАТАНУ!');
    }

    showChest() {
        this.hits = 0;
        this.isOpen = false;
        document.getElementById('chestHitsCount').textContent = '0';
        document.getElementById('chestModal').classList.remove('hidden');
    }
}

window.ChestSystem = new ChestSystem();
