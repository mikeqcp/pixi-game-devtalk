import * as PIXI from 'pixi.js';

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
    }

    update = (deltaTime) => {
        if (this.sprite.position.y <= 0) {
            this.destroy();
        }

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
