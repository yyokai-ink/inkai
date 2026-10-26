const StorageManager = {
    save(key, val) {
        localStorage.setItem('inkai_' + key, JSON.stringify(val));
    },
    load(key) {
        const val = localStorage.getItem('inkai_' + key);
        return val ? JSON.parse(val) : null;
    }
};
