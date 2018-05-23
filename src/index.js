import { Application } from "pixi.js";

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
        this.enemy = new Enemy(this.ticker);

        Store.add('enemies', [this.enemy]);

        this.stage.addChild(this.plane.sprite);
        this.stage.addChild(this.enemy.sprite);
        this.renderer.render(this.stage);
    }
}

window.addEventListener("load", () => {
    // List of resources to load
    const resources = ["images/plane.png", "images/chickens.png", "images/bullet.png", "images/racoon.png"];

    // Then load the images
    preloadResources(resources, () => {
        window.game = new Game(window.innerHeight, window.innerWidth, {
            antialias: false,
            transparent: true,
            resolution: window.devicePixelRatio,
        });
    });
});
