import { Application } from "pixi.js";
import { not, isEmpty } from 'ramda';

import { Plane } from './characters/Plane';
import preloadResources from './preloadResources';
import { Enemy } from './characters/enemy';
import Store from './helpers/Store';
import * as PIXI from "pixi.js";
import getTexture from "./getTexture";

class Game extends Application {
    constructor(app) {
        super(app);
        this.view.className = "renderArea";
        document.getElementById("main").appendChild(this.view);

        const bgSprite = new PIXI.Sprite(getTexture('images/background.jpg'));
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

window.addEventListener("load", () => {
    // List of resources to load
    const resources = ["images/plane.png", "images/chicken.png", "images/bullet.png", "images/racoon.png",
        "images/background.jpg"];

    // Then load the images
    preloadResources(resources, () => {
        window.game = new Game({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            transparent: true,
            autoResize: true,
            resolution: window.devicePixelRatio,
        });
    });
});
