import Store from "../helpers/Store";
import { Plane } from "../characters/Plane";
import * as PIXI from "pixi.js";
import getTexture from "../getTexture";
import { Application } from "pixi.js";
import GameState from './game.state';
import keyJs from 'key-js';
import { GAME_START, emitter, GAME_OVER } from "./game.events";


const gameInstanceOpts = {
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: false,
    transparent: true,
    autoResize: true,
    resolution: window.devicePixelRatio,
};

class Game extends Application {
    _over = false;

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

        emitter.on(GAME_OVER, this.endGame);
    }

    endGame = () => {
        if (this._over) return;

        this._over = true;
        const score = GameState.scoreController.score;
        const summary = new PIXI.Text(`GAME OVER! \nYour score: ${score}`);
        summary.position.x = window.innerWidth / 2;
        summary.position.y = window.innerHeight / 2;
        summary.anchor.x = summary.anchor.y = .5;

        this.stage.addChild(summary);

        this.ticker.stop();
        this.ticker.update();
    }
}

export default new Game();
