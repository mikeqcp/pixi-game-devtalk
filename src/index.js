import { Application } from "pixi.js";

import { Plane } from './characters/Plane';
import preloadResources from './preloadResources';

class Game extends Application {
    constructor(app) {
        super(app);
        this.view.className = "renderArea";
        document.getElementById("main").appendChild(this.view);

        this.plane = new Plane(this.ticker);

        this.stage.addChild(this.plane.sprite);
        this.renderer.render(this.stage);
    }
}

window.addEventListener("load", () => {
    // List of resources to load
    const resources = ["images/ghost.png"];

    // Then load the images
    preloadResources(resources, () => {
        new Game(window.innerHeight, window.innerWidth, {
            antialias: false,
            transparent: false,
            resolution: window.devicePixelRatio,
        });
    });
});
