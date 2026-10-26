const canvas = document.getElementById('inkCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let gameState = {
    score: 0,
    combo: 1,
    isSlowMo: false,
    timeScale: 1.0
};

function addScore(points) {
    gameState.score += points * gameState.combo;
    document.getElementById('scoreValue').textContent = gameState.score;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dt = 0.016 * gameState.timeScale;
    
    if (window.ParticleSystem) {
        window.ParticleSystem.update(dt);
        window.ParticleSystem.draw(ctx);
    }
    if (window.KatanaManager) {
        window.KatanaManager.update(dt);
        window.KatanaManager.draw(ctx);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
