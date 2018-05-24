import * as PIXI from 'pixi.js';
import Key from 'key-js';
import { not, isEmpty } from 'ramda';

import getTexture from '../getTexture';
import { Keyboard } from '../helpers/Keyboard';
import { Bullet } from '../effects/bullet';
import Store from '../helpers/Store';

export class Plane {
    constructor() {
        this.id = `chicken${new Date().getTime()}`;

        this.xMoving = null;
        this.sprite = new PIXI.Sprite(getTexture('images/chicken.png'));
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight - 200);
        this.leftArrowHandler = new Keyboard(Key.LEFT, this.onLeftPress, this.onLeftRelease);
        this.rightArrowHandler = new Keyboard(Key.RIGHT, this.onRightPress, this.onRightRelease);
        this.spaceHandler = new Keyboard(Key.SPACEBAR, this.onSpacePress);
    }

    update = () => {
        if (this.xMoving) {
            if (this.direction === 'RIGHT' && this.sprite.position.x >= 0
                && this.sprite.position.x < window.innerWidth - this.sprite.width) {
                return this.sprite.position.x += this.xMoving;
            }

            if (this.direction === 'RIGHT' && this.sprite.position.x >= 0
                && this.sprite.position.x >= window.innerWidth - this.sprite.width) {
                return this.sprite.position.x = window.innerWidth - this.sprite.width;
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
                new Bullet(this.sprite.position.x + this.sprite.width / 2, this.sprite.position.y)
            ]);
        }

        return Store.add('bullets', [
            new Bullet(this.sprite.position.x + this.sprite.width / 2, this.sprite.position.y)
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