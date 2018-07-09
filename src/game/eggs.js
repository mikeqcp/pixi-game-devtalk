import Egg from "./Egg";
import { equals, reject, remove } from 'ramda';
import { emitter, EGG_HATCH_START, EARN_SCORE, EGG_HATCH_END, GAME_OVER } from './game.events';
import { ticker } from 'pixi.js';
import Game from './game';
import ProgressBar from "../effects/ProgressBar";
import { positionToVector } from "../helpers/vectors";

const EGG_HATCH_TIME = 1000;

class Eggs {
    eggs = [];
    _hatchStart = null;
    _hatchPosition = null;
    _progress = null;
    _atLeastOneHatched = false;

    constructor() {
        emitter.on(EGG_HATCH_START, this.hatchEggStart);
        emitter.on(EGG_HATCH_END, this.hatchEggEnd);
        ticker.shared.add(this.update);
    }

    validatePosition = position => {
        return this.eggs.every(e => {
           return e.position.distance(position) > 50;
        });
    };

    hatchEggStart = (position) => {
        if (!this.validatePosition(position)) return;

        this._hatchPosition = position;
        this._hatchStart = Date.now();
        this._progress = new ProgressBar(this._hatchPosition);
    };

    hatchEggEnd = () => {
        if (this._hatchStart && this.timeHatching >= EGG_HATCH_TIME) {
            PIXI.sound.play('sound/chicken.wav');
            this.eggs.push(new Egg(this._hatchPosition));
            this._atLeastOneHatched = true;
        }

        if(this._progress) {
            this._progress.destroy();
        }
        this._progress = null;
        this._hatchPosition = null;
        this._hatchStart = null;
    };

    get timeHatching() {
        if (!this._hatchStart) return 0;
        return Date.now() - this._hatchStart;
    }

    get isHatching() { return !!this._hatchStart; }

    destroyEgg = egg => {
        Game.stage.removeChild(egg.element);
        egg.destroy();
        this.eggs = reject(equals(egg), this.eggs);

        if (this.eggs.length === 0 && this._atLeastOneHatched) {
            emitter.emit(GAME_OVER, { reason: "All your eggs were stolen :(" });
        }
    };

    update = () => {
        if (this._hatchStart && (this.timeHatching >= EGG_HATCH_TIME)) {
            this.hatchEggEnd();
        }

        if (this.isHatching && this._progress) {
            const progress = this.timeHatching / EGG_HATCH_TIME;
            this._progress.updateProgress(progress);
        }
    };

    reset() {
        this._hatchStart = null;
        this._hatchPosition = null;
        this._progress = null;
        this._atLeastOneHatched = false;
        this.eggs.forEach(egg => {
            Game.stage.removeChild(egg.element);
        });
        this.eggs = [];
    }
}

export default new Eggs();
