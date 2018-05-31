import Eggs from './eggs';
import { Ticker } from 'pixi.js';
import { EARN_SCORE, emitter } from './game.events';

class GameState {
    _points = 0;

    eggs = Eggs;
    get ticker() { return Ticker.shared; }

    constructor() {
        emitter.on(EARN_SCORE, points => {
            this._points += points;
            console.log('Points: ', this._points);
        });
    }
}

export default new GameState();