class Store {
    _store = {};

    add = (key, value) => this._store[key] = value;

    remove = key => delete this._store[key];

    get = (key, defaultValue) => {
        return this._store[key] || defaultValue;
    };

    save = key => localStorage.setItem('gameStore', {
        ...localStorage.getItem('gameStore'),
        [key]: this._store[key],
    });

    load = () => this._store = localStorage.getItem('gameStore');
}

const store = new Store();

export default store;
