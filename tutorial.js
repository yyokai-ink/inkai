class TutorialManager {
    constructor() {
        this.isTutorialActive = false;
    }

    startFirstTimeTutorial() {
        if (localStorage.getItem('inkai_tutorial_done')) return;

        this.isTutorialActive = true;
        document.getElementById('tutorialOverlay').classList.remove('hidden');
        
        if (typeof gameState !== 'undefined') gameState.timeScale = 0.15;

        window.addEventListener('pointerdown', () => {
            if (this.isTutorialActive) {
                this.completeTutorial();
            }
        }, { once: true });
    }

    completeTutorial() {
        this.isTutorialActive = false;
        document.getElementById('tutorialOverlay').classList.add('hidden');
        if (typeof gameState !== 'undefined') gameState.timeScale = 1.0;
        localStorage.setItem('inkai_tutorial_done', 'true');
    }
}

window.TutorialManager = new TutorialManager();
setTimeout(() => window.TutorialManager.startFirstTimeTutorial(), 1000);
