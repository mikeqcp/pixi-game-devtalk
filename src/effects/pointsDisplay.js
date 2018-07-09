import { Text } from 'pixi.js';
import { TEXT_STYLE } from 'game.constants.js'

const displayScore = v => `${v} pts`;

export default class PointsDisplay {
    _score = 0;

    constructor() {

        const el = new Text(displayScore(this._score), TEXT_STYLE);
        el.anchor.x = 1;
        el.anchor.y = 0;

        el.position.x = window.innerWidth - 50;
        el.position.y = 10;

        this._element = el;
    }

    get element() {
        return this._element;
    }

    updateScore = score => {
        this._score = score;
        this._element.text = displayScore(score);
    }
}
