import * as PIXI from 'pixi.js';
import Key from 'key-js';
import { not, isEmpty } from 'ramda';

import { WIDTH } from '../game.constants';
import getTexture from '../getTexture';
import { Keyboard } from '../helpers/Keyboard';
import { Bullet } from '../effects/bullet';
import Store from '../helpers/Store';

export class Plane {
    constructor(ticker) {
        this.ticker = ticker;
        this.id = `plane${new Date().getTime()}`;
        ticker.add(this.onTick);

        this.xMoving = null;
        this.sprite = new PIXI.Sprite(getTexture('images/plane.png'));
        this.sprite.position.set(160, 400);
        this.leftArrowHandler = new Keyboard(Key.LEFT, this.onLeftPress, this.onLeftRelease);
        this.rightArrowHandler = new Keyboard(Key.RIGHT, this.onRightPress, this.onRightRelease);
        this.spaceHandler = new Keyboard(Key.SPACEBAR, this.onSpacePress);
    }

    onTick = () => {
        if (this.xMoving) {
            if (this.direction === 'RIGHT' && this.sprite.position.x >= 0 && this.sprite.position.x < WIDTH - 85) {
                return this.sprite.position.x += this.xMoving;
            }

            if (this.direction === 'RIGHT' && this.sprite.position.x >= 0 && this.sprite.position.x >= WIDTH - 85) {
                return this.sprite.position.x = WIDTH - 85;
            }

            if (this.direction === 'LEFT' && this.sprite.position.x <= 0) {
                return this.sprite.position.x = 0;
            }

            return this.sprite.position.x -= this.xMoving;
        }
    };

    onSpacePress = () => {
        const bullets = Store.get('bullets', []);

        if (not(isEmpty(bullets))) {
            return Store.add('bullets', [
                ...bullets,
                new Bullet(this.ticker, this.sprite.position.x + 42, this.sprite.position.y)
            ]);
        }

        return Store.add('bullets', [
            new Bullet(this.ticker, this.sprite.position.x + 42, this.sprite.position.y)
        ]);
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