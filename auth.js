class AuthManager {
    constructor() {
        this.user = null;
    }
    loginGuest() {
        this.user = { uid: 'guest_' + Date.now(), isAnonymous: true };
    }
}
window.AuthManager = new AuthManager();
