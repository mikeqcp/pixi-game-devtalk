import * as PIXI from 'pixi.js';
import { when, cond, both, gt, lt, gte, T } from 'ramda';
import Key from 'key-js';

import { WIDTH } from '../game.constants';
import getTexture from '../getTexture';
import { Keyboard } from '../helpers/Keyboard';

export class Plane {
    constructor(ticker) {
        ticker.add(this.onTick);

        this.xMoving = null;
        this.sprite = new PIXI.Sprite(getTexture('images/ghost.png'));
        this.sprite.position.set(160, 80);
        this.leftArrowHandler = new Keyboard(Key.LEFT, this.onLeftPress, this.onLeftRelease);
        this.rightArrowHandler = new Keyboard(Key.RIGHT, this.onRightPress, this.onRightRelease);
    }

    onTick = () => {
        if (this.xMoving) {
            if (this.direction === 'RIGHT' && this.sprite.position.x >= 0 && this.sprite.position.x < WIDTH - 64) {
                return this.sprite.position.x += this.xMoving;
            }

            if (this.direction === 'RIGHT' && this.sprite.position.x >= 0 && this.sprite.position.x >= WIDTH - 64) {
                return this.sprite.position.x = WIDTH - 64;
            }

            if (this.direction === 'LEFT' && this.sprite.position.x <= 0) {
                return this.sprite.position.x = 0;
            }

            return this.sprite.position.x -= this.xMoving;
        }
    };

    onLeftPress = () => {
        if (this.direction) {
            return;
        }

        this.direction = 'LEFT';
        this.xMoving = 4;
    };

    onLeftRelease = () => {
        if (this.direction !== 'LEFT') {
            return;
        }

        this.xMoving = null;
        this.direction = null;
    };

    onRightPress = () => {
        if (this.direction) {
            return;
        }
        this.direction = 'RIGHT';
        this.xMoving = 4;
    };

    onRightRelease = () => {
        if (this.direction !== 'RIGHT') {
            return;
        }

        this.xMoving = null;
        this.direction = null;
    };
}