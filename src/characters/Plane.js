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

const INITIAL_SPEED = 4;
const MAX_SPEED = 8;
const ACCELERATION = .03;

export class Plane {
    constructor() {
        this.id = `chicken${new Date().getTime()}`;

        this.sprite = new PIXI.Sprite(getTexture('images/chicken.png'));
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight - 200);
        this.sprite.anchor.x = this.sprite.anchor.y = .5;

        this.spaceHandler = new Keyboard(Key.SPACEBAR, this.onSpacePress, this.onSpaceRelease);
        this.ctrlHandler = new Keyboard(Key.CONTROL, this.onCtrlPress, this.onCtrlRelease);
        this.shooting = false;
        this.hatching = false;
        this.toShoot = 0;
        this.shootDelay = 10;
        this.speed = INITIAL_SPEED;
    }

    clampPosition = v => {
        const { x, y } = v;
        return new Vector(clamp(0, window.innerWidth, x), clamp(0, window.innerHeight, y));
    };

    get isMoving() {
        return this.isMovingDown || this.isMovingLeft || this.isMovingRight || this.isMovingUp;
    }

    speedUp = () => this.speed = Math.min(this.speed += ACCELERATION, MAX_SPEED);
    resetSpeed = () => this.speed = INITIAL_SPEED;

    get isMovingUp() {return [Key.W, Key.UP].some(Key.isDown)}
    get isMovingDown() {return [Key.S, Key.DOWN].some(Key.isDown)}
    get isMovingLeft() {return [Key.A, Key.LEFT].some(Key.isDown)}
    get isMovingRight() {return [Key.D, Key.RIGHT].some(Key.isDown)}

    update = (deltaTime) => {
        if (this.hatching) {
            return this.resetSpeed();
        }


        if (this.isMoving) {
            this.speedUp();
        } else {
            this.resetSpeed();
        }

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
            if(this.isMovingLeft) { moveVector = moveVector.add(new Vector(-1, 0)); }
            if(this.isMovingRight) { moveVector = moveVector.add(new Vector(1, 0)); }
            if(this.isMovingDown) { moveVector = moveVector.add(new Vector(0, 1)); }
            if(this.isMovingUp) { moveVector = moveVector.add(new Vector(0, -1)); }

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

    onCtrlPress = () => {
        emitter.emit(EGG_HATCH_START, positionToVector(this.sprite.position));
        this.hatching = true;
    };
    onCtrlRelease = () => {
        this.hatching = false;
        emitter.emit(EGG_HATCH_END);
    };
}
