import * as PIXI from 'pixi.js';

import getTexture from '../getTexture';
import Store from "../helpers/Store";

export class Enemy {
    constructor(ticker) {
        this.ticker = ticker;
        this.id = `enemy${new Date().getTime()}`;
        ticker.add(this.onTick);


        this.sprite = new PIXI.Sprite(getTexture('images/racoon.png'));
        this.sprite.position.set(300, 0);

    }

    onTick = () => {
        this.sprite.position.y += 3;
    };

    destroy = () => {
        window.game.stage.removeChild(this.sprite);
        Store.add('enemies', Store.get('enemies', []).filter(enemy => enemy.id !== this.id));
    }
}