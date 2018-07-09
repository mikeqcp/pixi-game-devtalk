import Store from "../helpers/Store";
import { Plane } from "../characters/Plane";
import * as PIXI from "pixi.js";
import getTexture from "../getTexture";
import { Application } from "pixi.js";
import GameState from './game.state';
import keyJs from 'key-js';
import { GAME_START, emitter, GAME_OVER, GAME_RESET } from "./game.events";
import { TEXT_STYLE } from 'game.constants.js'


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

    _updateBullets = (deltaTime) => {
        const bullets = Store.get('bullets', []);

        this.chicken.update(deltaTime);
        bullets.forEach(bullet => bullet.update(deltaTime));
    };

    _resetBullets = () => {
        const bullets = Store.get('bullets', []);
        bullets.forEach(bullet => bullet.destroy());
    };

    setupStage() {
        document.getElementById("main").appendChild(this.view);

        const bgSprite = new PIXI.Sprite(getTexture('images/background.jpg'));
        bgSprite.width = window.innerWidth;
        bgSprite.height = window.innerHeight;
        this.stage.addChild(bgSprite);

        this.chicken = new Plane();

        this.stage.addChild(this.chicken.sprite);
        this.renderer.render(this.stage);

        this.ticker.add(this._updateBullets);
        keyJs.startCapture();

        const instructions = new PIXI.Text('[Space] - Shoot \n[X]     - Lay egg', TEXT_STYLE);
        instructions.position.x = 10;
        this.stage.addChild(instructions);
        emitter.emit(GAME_START);

        emitter.on(GAME_OVER, this.endGame);
    }

    endGame = ({ reason }) => {
        if (this._over) return;

        this._over = true;
        const score = GameState.scoreController.score;
        const summary = this.summary = new PIXI.Text(`GAME OVER! \n\nYour score: ${score} \n\n${reason}`, TEXT_STYLE);
        summary.position.x = window.innerWidth / 2;
        summary.position.y = window.innerHeight / 2;
        summary.anchor.x = summary.anchor.y = .5;

        this.stage.addChild(summary);

        this.ticker.stop();
        this.ticker.update();

        const btn = document.createElement("button");
        const t = document.createTextNode("RESTART");
        btn.appendChild(t);
        btn.className = 'restart-btn';

        const onClick = () => {
            this.restartGame();
            btn.removeEventListener('click', onClick);
            document.body.removeChild(btn);
        };
        btn.addEventListener('click', onClick);
        document.body.appendChild(btn);
    };

    restartGame() {
        this._over = false;
        GameState.reset();
        this.stage.removeChild(this.summary);
        this.chicken.reset();
        this._resetBullets();
        this.ticker.start();
        emitter.emit(GAME_RESET);
    }
}

export default new Game();
