import * as PIXI from 'pixi.js';

import Store from '../helpers/Store';
import getTexture from '../getTexture';
import collision from "../helpers/collision";

export class Bullet {
    constructor(x, y) {
        this.id = `bullet${new Date().getTime()}`;

        this.sprite = new PIXI.Sprite(getTexture('images/bullet.png'));
        this.sprite.position.set(x, y);
        window.game.stage.addChild(this.sprite);
    }

    update = () => {
        if (this.sprite.position.y <= 0) {
            this.destroy();
        }
        
        this.sprite.position.y -= 3;
        this.checkCollision();
    };

    checkCollision = () => {
        const enemies = Store.get('enemies', []);
        if (this.sprite.y + this.sprite.height <= 0 ) {
            return this.destroy();
        }

        return enemies.forEach(enemy => {
           if (collision(this.sprite, enemy.sprite)) {
               this.destroy();
               enemy.destroy();
           }
        });
    };

    destroy = () => {
        window.game.stage.removeChild(this.sprite);
        Store.add('bullets', Store.get('bullets').filter(bullet => bullet.id !== this.id));
    };
}