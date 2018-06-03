import { ticker } from 'pixi.js';
import { getRandomInt } from '../helpers/functions';
import GameState from '../game/game.state';
import { createSprite } from "../helpers/sprite";

export class Enemy {
    constructor() {
        this.sprite = createSprite('racoon.png');
        this.sprite.position.set(getRandomInt(window.innerWidth), 0 - this.sprite.height);
        ticker.shared.add(this.update);
    }

    update = () => {
        if (this.sprite.y > window.innerHeight) {
            return this.destroy();
        }

        this.sprite.position.y += 3;
    };

    destroy = () => {
        GameState.enemies.remove(this);
    }
}