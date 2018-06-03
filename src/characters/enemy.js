import { ticker } from 'pixi.js';
import { getRandomInt } from '../helpers/functions';
import GameState from '../game/game.state';
import { createSprite } from "../helpers/sprite";
import { positionToVector, vectorAsPosition } from "../helpers/vectors";
import Vector from 'victor';

const SPEED = 1.5;
const CATCH_THRESHOLD = 5;

export class Enemy {
    constructor(targetEgg) {
        this.sprite = createSprite('racoon.png');
        this.sprite.position.set(getRandomInt(window.innerWidth), 0 - this.sprite.height);
        ticker.shared.add(this.update);
        this._targetPosition = positionToVector(targetEgg.position);
    }

    update = () => {
        if (this.sprite.y > window.innerHeight) {
            return this.destroy();
        }

        if (Math.abs(this.sprite.y - this._targetPosition.y) < CATCH_THRESHOLD || Math.abs(this.sprite.x - this._targetPosition.x) < CATCH_THRESHOLD) {
            return this.destroy();
        }

        const currentPosition = positionToVector(this.sprite.position);
        const direction = this._targetPosition.clone().subtract(currentPosition);
        const moveVector = direction.normalize().multiply(new Vector(SPEED, SPEED));
        vectorAsPosition(this.sprite.position, currentPosition.add(moveVector));
    };

    destroy = () => {
        GameState.enemies.remove(this);
    }
}