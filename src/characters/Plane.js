import * as PIXI from 'pixi.js';
import Key from 'key-js';
import { not, isEmpty, clamp } from 'ramda';
import Vector from 'victor';
import convert from 'color-convert';

import getTexture from '../getTexture';
import { Keyboard } from '../helpers/Keyboard';
import { Bullet } from '../effects/bullet';
import Store from '../helpers/Store';
import { EGG_HATCH_END, EGG_HATCH_START, EGG_HATCHED, emitter, GAME_OVER } from '../game/game.events';
import { positionToVector, vectorAsPosition } from "../helpers/vectors";
import GameState from '../game/game.state';
import collision from '../helpers/collision';

const INITIAL_SPEED = 4;
const MAX_SPEED = 8;
const ACCELERATION = .03;

export class Plane {
    constructor() {

        var frames = [];

        for (var i = 0; i < 3; i++) {
            var val = i < 10 ? '0' + i : i;

            frames.push(PIXI.Texture.fromFrame('chicken_walk' + val + '.png'));
        }

        this.sprite = new PIXI.extras.AnimatedSprite(frames);
        this.sprite.play();
        this.sprite.animationSpeed = 0.15;

        this.id = `chicken${new Date().getTime()}`;

        // this.sprite = new PIXI.Sprite(getTexture('images/chicken.png'));
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight - 200);
        this.sprite.anchor.x = this.sprite.anchor.y = .5;

        new Keyboard(Key.SPACEBAR, this.onSpacePress, this.onSpaceRelease);
        new Keyboard(Key.X, this.onXPress, this.onXRelease);
        this.shooting = false;
        this.hatching = false;
        this.toShoot = 0;
        this.shootDelay = 10;
        this.speed = INITIAL_SPEED;
        this.elapsed = 0;
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
        this.checkGameOver();
        this.elapsed += deltaTime;

        this.sprite.tint = parseInt('0x' + convert.hsv.hex((this.elapsed * 8) % 360, 60, 100));

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

            Store.add('bullets', [
                ...bullets || [],
                new Bullet(this.sprite.position.x - 7, this.sprite.position.y - 10)
            ]);
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

    checkGameOver = () => {
        const enemies = GameState.enemies.enemies;

        const me = this.sprite.getBounds();

        if (enemies.some(e => {
            return collision(me, e.sprite.getBounds());
        })) {
            emitter.emit(GAME_OVER, { reason: "You were eaten by racoon :("});
        }
    };

    onSpacePress = () => {
        this.shooting = true;
    };

    onSpaceRelease = () => {
        this.shooting = false;
    };

    onXPress = () => {
        emitter.emit(EGG_HATCH_START, positionToVector(this.sprite.position));
        this.hatching = true;
    };
    onXRelease = () => {
        this.hatching = false;
        emitter.emit(EGG_HATCH_END);
    };

    reset() {
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight - 200);
    }
}
