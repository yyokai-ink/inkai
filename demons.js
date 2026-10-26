class DemonManager {
    constructor() {
        this.demons = [];
    }

    spawnDemon(x, y, type = 'oni') {
        this.demons.push({
            x, y,
            type,
            sliced: false,
            radius: 30
        });
    }

    update(dt) {
        // Logic for demon movement
    }
}
window.DemonManager = new DemonManager();
