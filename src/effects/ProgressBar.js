import Game from "../game/game";
import { Graphics, Container } from 'pixi.js';

const WIDTH = 100;
const HEIGHT = 20;

export default class ProgressBar {
    constructor(position) {
        this._container = new Container();
        this._container.position.x = position.x - WIDTH / 2;
        this._container.position.y = position.y - 50;

        this.drawBackground();
        this._progress = this.drawProgress();

        Game.stage.addChild(this._container);

    }

    _drawRect(fill) {
        const graphics = new Graphics();

        graphics.beginFill(fill);
        graphics.lineStyle(1, 0x000000);
        graphics.drawRect(0, 0, WIDTH, HEIGHT);

        this._container.addChild(graphics);

        return graphics;
    }

    drawProgress() {
        const progress = this._drawRect(0xFF5511);
        progress.scale.x = 0;
        return progress;
    }

    drawBackground() {
        return this._drawRect(0xFFFF00);
    }

    destroy() {
        Game.stage.removeChild(this._container);
    }

    updateProgress(value) {
        this._progress.scale.x = value;
    }
}