import * as PIXI from 'pixi.js';

import getTexture from '../getTexture';
import Store from '../helpers/Store';
import { getRandomInt } from '../helpers/functions';

export class Enemy {
    constructor() {
        this.id = `enemy${new Date().getTime()}`;

        this.sprite = new PIXI.Sprite(getTexture('images/racoon.png'));
        this.sprite.position.set(getRandomInt(window.innerWidth), 0 - this.sprite.height);
    }

    update = () => {
        if (this.sprite.y > window.innerHeight) {
            return this.destroy();
        }

        this.sprite.position.y += 3;
    };

    destroy = () => {
        window.game.stage.removeChild(this.sprite);
        Store.add('enemies', Store.get('enemies', []).filter(enemy => enemy.id !== this.id));
    }
}