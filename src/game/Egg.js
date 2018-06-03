import Game from './game';
import { createSprite } from "../helpers/sprite";

export default class Egg {
    constructor(position) {
        this._position = position;
        const sprite = createSprite('egg.png');

        sprite.position.x = position.x;
        sprite.position.y = position.y;
        sprite.scale.x = sprite.scale.y = .02;
        Game.stage.addChild(sprite);
    }

    get position() { return this._position; }
}