const LevelConfig = {
    currentLevel: 1,
    maxLevels: 10,
    nextLevel() {
        this.currentLevel++;
    }
};
window.LevelConfig = LevelConfig;
