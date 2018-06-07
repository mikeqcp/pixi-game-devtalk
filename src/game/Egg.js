import Game from './game';
import { createSprite } from "../helpers/sprite";

export default class Egg {
    constructor(position) {
        this._position = position;
        const sprite = createSprite('egg.png');

        sprite.position.x = position.x;
        sprite.position.y = position.y;
        sprite.scale.x = sprite.scale.y = .02;

        sprite.anchor.x = sprite.anchor.y = .5;
        Game.stage.addChild(sprite);
        this._sprite = sprite;
    }

    get position() { return this._position; }

    get element() { return this._sprite; }
}
