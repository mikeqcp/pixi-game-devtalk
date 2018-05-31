import * as PIXI from 'pixi.js';
import Key from 'key-js';
import { not, isEmpty } from 'ramda';

import getTexture from '../getTexture';
import { Keyboard } from '../helpers/Keyboard';
import { Bullet } from '../effects/bullet';
import Store from '../helpers/Store';
import { EGG_HATCH_END, EGG_HATCH_START, EGG_HATCHED, emitter } from '../game/game.events';
import { positionToVector } from "../helpers/vectors";

export class Plane {
    constructor() {
        this.id = `chicken${new Date().getTime()}`;

        this.xMovingLeft = false;
        this.xMovingRight = false;
        this.sprite = new PIXI.Sprite(getTexture('images/chicken.png'));
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight - 200);
        this.leftArrowHandler = new Keyboard(Key.LEFT, this.onLeftPress, this.onLeftRelease);
        this.rightArrowHandler = new Keyboard(Key.RIGHT, this.onRightPress, this.onRightRelease);
        this.AKeyHandler = new Keyboard(Key.A, this.onLeftPress, this.onLeftRelease);
        this.DKeyHandler = new Keyboard(Key.D, this.onRightPress, this.onRightRelease);
        this.spaceHandler = new Keyboard(Key.SPACEBAR, this.onSpacePress, this.onSpaceRelease);
        this.ctrlHandler = new Keyboard(Key.CONTROL, this.onCtrlPress, this.onCtrlRelease);
        this.shooting = false;
        this.toShoot = 0;
        this.shootDelay = 10;
        this.speed = 4;
    }

    update = (deltaTime) => {
        if(this.toShoot > 0) {
            this.toShoot -= deltaTime;
        }

        if(this.shooting && this.toShoot <= 0) {
            this.toShoot = this.shootDelay;

            const bullets = Store.get('bullets', []);

            // XXX some assumptions about bullet/plane sprite size are made below.
            if (not(isEmpty(bullets))) {
                Store.add('bullets', [
                    ...bullets,
                    new Bullet(this.sprite.position.x + this.sprite.width / 2 - 7, this.sprite.position.y - 10)
                ]);
            } else {
                Store.add('bullets', [
                    new Bullet(this.sprite.position.x + this.sprite.width / 2 - 7, this.sprite.position.y - 10)
                ]);
            }
        }

        if (this.xMovingRight || this.xMovingLeft) {
            if (this.xMovingRight && this.sprite.position.x >= 0
                && this.sprite.position.x < window.innerWidth - this.sprite.width) {
                return this.sprite.position.x += this.speed * deltaTime;
            }

            if (this.xMovingRight && this.sprite.position.x >= 0
                && this.sprite.position.x >= window.innerWidth - this.sprite.width) {
                return this.sprite.position.x = window.innerWidth - this.sprite.width;
            }

            if (this.xMovingLeft && this.sprite.position.x <= 0) {
                return this.sprite.position.x = 0;
            }

            return this.sprite.position.x -= this.speed * deltaTime;
        }
    };

    onSpacePress = () => {
        this.shooting = true;
    };

    onSpaceRelease = () => {
        this.shooting = false;
    };

    onLeftPress = () => {
        this.xMovingLeft = true;
    };

    onLeftRelease = () => {
        this.xMovingLeft = false;
    };

    onRightPress = () => {
        this.xMovingRight = true;
    };

    onRightRelease = () => {
        this.xMovingRight = false;
    };

    onCtrlPress = () => emitter.emit(EGG_HATCH_START, positionToVector(this.sprite.position));
    onCtrlRelease = () => emitter.emit(EGG_HATCH_END, positionToVector(this.sprite.position));
}
