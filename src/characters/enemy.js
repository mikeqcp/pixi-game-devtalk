import * as PIXI from 'pixi.js';
import 'pixi-particles'
import { getRandomInt } from '../helpers/functions';
import GameState from '../game/game.state';
import { createSprite } from "../helpers/sprite";
import { positionToVector, vectorAsPosition } from "../helpers/vectors";
import Vector from 'victor';
import Game from "../game/game";

const SPEED = 3;
const CATCH_THRESHOLD = 5;

export class Enemy {
    constructor(targetEgg) {
        this._targetEgg = targetEgg;
        this.sprite = createSprite('racoon.png');
        this.sprite.position.set(getRandomInt(window.innerWidth), 0 - this.sprite.height);
        PIXI.ticker.shared.add(this.update);
        this._targetPosition = positionToVector(targetEgg.position);

        this.particlesContainer = new PIXI.Container();

        this.emitter = new PIXI.particles.Emitter(
            this.particlesContainer,
            // ¯\_(ツ)_/¯
            ['images/racoon.png'],
            // Emitter configuration, edit this to change the look
            // of the emitter
            // YAY HARDCODING
            {
                alpha: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0.1,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                scale: {
                    list: [
                        {
                            value: 1,
                            time: 0
                        },
                        {
                            value: 0.3,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                color: {
                    list: [
                        {
                            value: "fb1010",
                            time: 0
                        },
                        {
                            value: "f5b830",
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                speed: {
                    list: [
                        {
                            value: 200,
                            time: 0
                        },
                        {
                            value: 100,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                startRotation: {
                    min: 0,
                    max: 360
                },
                rotationSpeed: {
                    min: 0,
                    max: 0
                },
                lifetime: {
                    min: 0.5,
                    max: 0.5
                },
                frequency: 0.008,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: 0.31,
                maxParticles: 1000,
                pos: {
                    x: 0,
                    y: 0
                },
                addAtBack: false,
                spawnType: "circle",
                spawnCircle: {
                    x: 0,
                    y: 0,
                    r: 10
                }
            }
        );
    }

    update = () => {
        if (this.sprite.y > window.innerHeight) {
            return this.destroy();
        }

        if (Math.abs(this.sprite.y - this._targetPosition.y) < CATCH_THRESHOLD || Math.abs(this.sprite.x - this._targetPosition.x) < CATCH_THRESHOLD) {
            GameState.eggsController.destroyEgg(this._targetEgg);
            return this.destroy();
        }

        const currentPosition = positionToVector(this.sprite.position);
        const direction = this._targetPosition.clone().subtract(currentPosition);
        const moveVector = direction.normalize().multiply(new Vector(SPEED, SPEED));
        vectorAsPosition(this.sprite.position, currentPosition.add(moveVector));
    };

    destroy = () => {

        // Put the particles container in the middle of the sprite location
        this.particlesContainer.position.set(
            this.sprite.position.x + this.sprite.width / 2,
            this.sprite.position.y + this.sprite.height / 2
        );

        Game.stage.addChild(this.particlesContainer);
        this.emitter.playOnceAndDestroy(() => Game.stage.removeChild(this.particlesContainer));

        PIXI.ticker.shared.remove(this.update);
        GameState.enemies.remove(this);
    }
}
