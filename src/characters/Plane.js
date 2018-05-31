import * as PIXI from 'pixi.js';
import Key from 'key-js';
import { not, isEmpty, clamp } from 'ramda';
import Vector from 'victor';

import getTexture from '../getTexture';
import { Keyboard } from '../helpers/Keyboard';
import { Bullet } from '../effects/bullet';
import Store from '../helpers/Store';
import { EGG_HATCH_END, EGG_HATCH_START, EGG_HATCHED, emitter } from '../game/game.events';
import { positionToVector, vectorAsPosition } from "../helpers/vectors";

export class Plane {
    constructor() {
        this.id = `chicken${new Date().getTime()}`;

        this.xMovingLeft = false;
        this.xMovingRight = false;
        this.yMovingUp = false;
        this.yMovingDown = false;
        this.sprite = new PIXI.Sprite(getTexture('images/chicken.png'));
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight - 200);

        this.leftArrowHandler = new Keyboard(Key.LEFT, this.onLeftPress, this.onLeftRelease);
        this.rightArrowHandler = new Keyboard(Key.RIGHT, this.onRightPress, this.onRightRelease);
        this.upArrowHandler = new Keyboard(Key.UP, this.onUpPress, this.onUpRelease);
        this.downArrowHandler = new Keyboard(Key.DOWN, this.onDownPress, this.onDownRelease);

        this.AKeyHandler = new Keyboard(Key.A, this.onLeftPress, this.onLeftRelease);
        this.DKeyHandler = new Keyboard(Key.D, this.onRightPress, this.onRightRelease);
        this.WKeyHandler = new Keyboard(Key.W, this.onUpPress, this.onUpRelease);
        this.SKeyHandler = new Keyboard(Key.S, this.onDownPress, this.onDownRelease);

        this.spaceHandler = new Keyboard(Key.SPACEBAR, this.onSpacePress, this.onSpaceRelease);
        this.ctrlHandler = new Keyboard(Key.CONTROL, this.onCtrlPress, this.onCtrlRelease);
        this.shooting = false;
        this.toShoot = 0;
        this.shootDelay = 10;
        this.speed = 4;
    }

    clampPosition = v => {
        const { x, y } = v;
        return new Vector(clamp(0, window.innerWidth, x), clamp(0, window.innerHeight, y));
    };

    get isMoving() {
        return this.xMovingRight || this.xMovingLeft || this.yMovingDown || this.yMovingUp;
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

        if (this.isMoving) {
            let moveVector = new Vector(0, 0);
            if(this.xMovingLeft) { moveVector = moveVector.add(new Vector(-1, 0)); }
            if(this.xMovingRight) { moveVector = moveVector.add(new Vector(1, 0)); }
            if(this.yMovingDown) { moveVector = moveVector.add(new Vector(0, 1)); }
            if(this.yMovingUp) { moveVector = moveVector.add(new Vector(0, -1)); }

            const currentPosition = positionToVector(this.sprite.position);

            const speedScalar = deltaTime * this.speed;
            const speedVector = new Vector(speedScalar, speedScalar);
            const newPosition = currentPosition.add(moveVector.normalize().multiply(speedVector));

            return vectorAsPosition(this.sprite.position, this.clampPosition(newPosition));
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

    onUpPress = () => {
        this.yMovingUp = true;
    };

    onUpRelease = () => {
        this.yMovingUp = false;
    };

    onDownPress = () => {
        this.yMovingDown = true;
    };

    onDownRelease = () => {
        this.yMovingDown = false;
    };

    onCtrlPress = () => emitter.emit(EGG_HATCH_START, positionToVector(this.sprite.position));
    onCtrlRelease = () => emitter.emit(EGG_HATCH_END, positionToVector(this.sprite.position));
}
