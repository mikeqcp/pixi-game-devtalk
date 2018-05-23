import { Application } from "pixi.js";
import { not, isEmpty } from 'ramda';

import { Plane } from './characters/Plane';
import preloadResources from './preloadResources';
import { Enemy } from './characters/enemy';
import Store from './helpers/Store';

class Game extends Application {
    constructor(app) {
        super(app);
        this.view.className = "renderArea";
        document.getElementById("main").appendChild(this.view);

        this.plane = new Plane(this.ticker);

        this.stage.addChild(this.plane.sprite);
        this.renderer.render(this.stage);
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
    const resources = ["images/plane.png", "images/chickens.png", "images/bullet.png", "images/racoon.png"];

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
