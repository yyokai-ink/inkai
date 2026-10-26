function triggerScreenShake(duration = 200) {
    const container = document.getElementById('game-container');
    if (!container) return;
    container.style.animation = 'shake 0.2s ease-in-out';
    setTimeout(() => {
        container.style.animation = '';
    }, duration);
}
