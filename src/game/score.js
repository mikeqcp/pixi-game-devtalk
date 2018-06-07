import { EARN_SCORE, emitter, GAME_START } from "./game.events";
import PointsDisplay from "../effects/pointsDisplay";
import Game from './game';
import GameState from './game.state';

const POINTS_PER_EGG_PER_SECOND = 1;


class ScoreController {
    _score = 0;
    _lastScoreUpdate = 0;

    get score() { return this._score; }

    constructor() {
        emitter.on(GAME_START, () => {
            Game.ticker.add(this.update);

            this._pointsDisplay = new PointsDisplay();
            Game.stage.addChild(this._pointsDisplay.element);

            emitter.on(EARN_SCORE, points => {
                this._score += points;
                this._pointsDisplay.updateScore(this._score);
            });
        });
    }

    update = () => {
        if (Date.now() - this._lastScoreUpdate > 1000) {
            emitter.emit(EARN_SCORE, GameState.eggsController.eggs.length * POINTS_PER_EGG_PER_SECOND);
            this._lastScoreUpdate = Date.now();
        }
    }
}

export default new ScoreController();
