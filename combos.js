class ComboSystem {
    constructor() {
        this.count = 0;
        this.timer = null;
    }

    registerHit() {
        this.count++;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.reset(), 1500);
        this.updateUI();
    }

    reset() {
        this.count = 0;
        this.updateUI();
    }

    updateUI() {
        const badge = document.getElementById('comboBadge');
        if (!badge) return;
        if (this.count > 1) {
            badge.textContent = `COMBO x${this.count}`;
            badge.classList.add('active');
        } else {
            badge.classList.remove('active');
        }
    }
}
window.ComboSystem = new ComboSystem();
