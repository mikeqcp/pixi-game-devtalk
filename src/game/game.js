import Store from "../helpers/Store";
import { Plane } from "../characters/Plane";
import * as PIXI from "pixi.js";
import getTexture from "../getTexture";
import { Application } from "pixi.js";
import GameState from './game.state';
import keyJs from 'key-js';
import { GAME_START, emitter } from "./game.events";


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
            const bullets = Store.get('bullets', []);

            this.plane.update(deltaTime);
            bullets.forEach(bullet => bullet.update(deltaTime));
        });
        keyJs.startCapture();

        const instructions = new PIXI.Text('[Space] - Shoot \n[X] = Hatch');
        this.stage.addChild(instructions);
        emitter.emit(GAME_START);
    }
}

export default new Game();
