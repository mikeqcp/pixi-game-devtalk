import { EARN_SCORE, emitter, GAME_START } from "./game.events";
import PointsDisplay from "../effects/pointsDisplay";
import Game from './game';
import GameState from './game.state';

const POINTS_PER_EGG_PER_SECOND = 1;

const getComboMultiplier = count => {
    if (count >= 25) return 15;
    if (count >= 20) return 10;
    if (count >= 10) return 5;
    if (count >= 5) return 3;
    if (count >= 3) return 2;
    return 1;
};

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
            const eggsCount = GameState.eggsController.eggs.length;
            const pps = getComboMultiplier(eggsCount) * POINTS_PER_EGG_PER_SECOND;
            emitter.emit(EARN_SCORE, pps * eggsCount);
            this._lastScoreUpdate = Date.now();
        }
    }
}

export default new ScoreController();
