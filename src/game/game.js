import Store from "../helpers/Store";
import { Plane } from "../characters/Plane";
import { Enemy } from "../characters/enemy";
import * as PIXI from "pixi.js";
import getTexture from "../getTexture";
import { Application } from "pixi.js";
import { isEmpty, not } from "ramda";
import GameState from './game.state';

const gameInstanceOpts = {
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: false,
    transparent: true,
    autoResize: true,
    resolution: window.devicePixelRatio,
};

class Game extends Application {
    constructor() {
        super(gameInstanceOpts);
        this.view.className = "renderArea";
    }

    setupStage() {
        document.getElementById("main").appendChild(this.view);

        const bgSprite = new PIXI.Sprite(getTexture('images/background.jpg'));
        bgSprite.width = window.innerWidth;
        bgSprite.height = window.innerHeight;
        this.stage.addChild(bgSprite);

        this.plane = new Plane();

        this.stage.addChild(this.plane.sprite);
        this.renderer.render(this.stage);

        this.ticker.add((deltaTime) => {
            const enemies = Store.get('enemies', []);
            const bullets = Store.get('bullets', []);

            this.plane.update(deltaTime);
            enemies.forEach(enemy => enemy.update(deltaTime));
            bullets.forEach(bullet => bullet.update(deltaTime));
        });

        this.addEnemies();
    }

    addEnemies = () => setInterval(() => {
        const enemy = new Enemy(this.ticker);
        this.addOrAppendEnemy(enemy);

        this.stage.addChild(enemy.sprite);
    }, 500);

    addOrAppendEnemy = enemy => {
        const enemies = Store.get('enemies', []);

        if (not(isEmpty(enemies))) {
            return Store.add('enemies', [...enemies, enemy]);
        }

        return Store.add('enemies', [enemy]);
    }
}

export default new Game();