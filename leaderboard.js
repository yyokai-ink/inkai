class LeaderboardManager {
    async fetchTopScores() {
        return [
            { name: 'YYOKAI', score: 9999 },
            { name: 'RONIN', score: 8500 }
        ];
    }
}
window.LeaderboardManager = new LeaderboardManager();
