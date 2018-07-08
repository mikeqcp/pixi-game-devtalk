import Game from './game';
import { createSprite } from "../helpers/sprite";
import { EARN_SCORE, emitter, GAME_OVER } from "./game.events";
import * as PIXI from "pixi.js";
import score from "./score";
import { TEXT_STYLE } from 'game.constants.js'

const ANIMATION_TIME = 500;

export default class Egg {
    _lastLabelUpdate = 0;

    constructor(position) {
        this._position = position;
        const sprite = createSprite('egg.png');

        sprite.position.x = position.x;
        sprite.position.y = position.y;
        sprite.scale.x = sprite.scale.y = .02;

        sprite.anchor.x = sprite.anchor.y = .5;
        Game.stage.addChild(sprite);
        this._sprite = sprite;

        emitter.on(EARN_SCORE, this._showPoints);
        Game.ticker.add(this._update);
        emitter.on(GAME_OVER, () => {
            Game.ticker.remove(this._update);
            Game.stage.removeChild(this._currentLabel);
            this._currentLabel = null;
        })
    }

    get position() { return this._position; }

    get element() { return this._sprite; }

    _update = () => {
        const labelTimeElapsed = Date.now() - this._lastLabelUpdate;
        if (labelTimeElapsed >= ANIMATION_TIME && this._currentLabel) {
            Game.stage.removeChild(this._currentLabel);
            this._currentLabel = null;
        } else if (this._currentLabel) {
            const alpha = 1 - Math.abs(-2 * (labelTimeElapsed / ANIMATION_TIME) + 1);
            this._currentLabel.position.y -= .2;
            this._currentLabel.alpha = alpha;
        }
    };

    _showPoints = ({ pointsPerEgg }) => {
        const scoreLabel = new PIXI.Text(pointsPerEgg, TEXT_STYLE);

        scoreLabel.position.x = this._position.x;
        scoreLabel.position.y = this._position.y - 30;
        scoreLabel.anchor.x = scoreLabel.anchor.y = .5;
        scoreLabel.alpha = 0;

        Game.stage.addChild(scoreLabel);
        Game.stage.removeChild(this._currentLabel);

        this._currentLabel = scoreLabel;

        this._lastLabelUpdate = Date.now();
    }
}
