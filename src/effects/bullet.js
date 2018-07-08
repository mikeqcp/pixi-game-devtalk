import * as PIXI from 'pixi.js';
import 'pixi-particles'

import Store from '../helpers/Store';
import getTexture from '../getTexture';
import collision from "../helpers/collision";
import GameState from '../game/game.state';

export class Bullet {
    constructor(x, y) {
        this.id = `bullet${new Date().getTime()}`;

        this.sprite = new PIXI.Sprite(getTexture('images/bullet.png'));
        this.sprite.position.set(x, y);
        window.game.stage.addChild(this.sprite);

        let c = new PIXI.Container();
        c.position.set(100, 100);
        window.game.stage.addChild(c);

        this.emitter = new PIXI.particles.Emitter(
            this.sprite,
            ['images/particle.png'],
            // YAY HARDCODING AGAIN
            {
                "alpha": {
                    "start": 0.6,
                    "end": 0.2
                },
                "scale": {
                    "start": 0.4,
                    "end": 0.8,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#ff0000",
                    "end": "#ffea00"
                },
                "speed": {
                    "start": 300,
                    "end": 100,
                    "minimumSpeedMultiplier": 1
                },
                "acceleration": {
                    "x": 0,
                    "y": 0
                },
                "maxSpeed": 0,
                "startRotation": {
                    "min": 80,
                    "max": 110
                },
                "noRotation": false,
                "rotationSpeed": {
                    "min": 0,
                    "max": 0
                },
                "lifetime": {
                    "min": 0.6,
                    "max": 1.2
                },
                "blendMode": "normal",
                "frequency": 0.01,
                "emitterLifetime": -1,
                "maxParticles": 200,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "rect",
                "spawnRect": {
                    "x": 3,
                    "y": 12,
                    "w": 10,
                    "h": 10
                }
            }
        );

        this.emitter.emit = true;
    }

    update = (deltaTime) => {
        if (this.sprite.position.y <= 0) {
            this.destroy();
        }

        this.emitter.update(deltaTime * 0.02);

        this.sprite.position.y -= 3 * deltaTime;
        this.checkCollision();
    };

    checkCollision = () => {
        const enemies = GameState.enemies.enemies;
        if (this.sprite.y + this.sprite.height <= 0 ) {
            return this.destroy();
        }

        return enemies.forEach(enemy => {
           if (collision(this.sprite, enemy.sprite)) {
               this.destroy();
               enemy.destroy(true);
           }
        });
    };

    destroy = () => {
        window.game.stage.removeChild(this.sprite);
        Store.add('bullets', Store.get('bullets').filter(bullet => bullet.id !== this.id));
    };
}
