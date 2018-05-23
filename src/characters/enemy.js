import * as PIXI from 'pixi.js';

import getTexture from '../getTexture';
import Store from '../helpers/Store';
import { getRandomInt } from '../helpers/functions';

export class Enemy {
    constructor(ticker) {
        this.ticker = ticker;
        this.id = `enemy${new Date().getTime()}`;
        ticker.add(this.onTick);


        this.sprite = new PIXI.Sprite(getTexture('images/racoon.png'));
        this.sprite.position.set(getRandomInt(800), 0 - this.sprite.height);
    }

    onTick = () => {
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