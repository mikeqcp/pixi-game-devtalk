import Egg from "./Egg";
import { equals, reject, remove } from 'ramda';
import { emitter, EGG_HATCH_START, EARN_SCORE, EGG_HATCH_END } from './game.events';
import { ticker } from 'pixi.js';
import Game from './game';
import ProgressBar from "../effects/ProgressBar";

const EGG_HATCH_TIME = 1000;

class Eggs {
    eggs = [];
    _hatchStart = null;
    _hatchPosition = null;
    _progress = null;

    constructor() {
        emitter.on(EGG_HATCH_START, this.hatchEggStart);
        emitter.on(EGG_HATCH_END, this.hatchEggEnd);
        ticker.shared.add(this.update);
    }

    hatchEggStart = (position) => {
        this._hatchPosition = position;
        this._hatchStart = Date.now();
        this._progress = new ProgressBar(this._hatchPosition);
    };

    hatchEggEnd = () => {
        if (this._hatchStart && this.timeHatching >= EGG_HATCH_TIME) {
            this.eggs.push(new Egg(this._hatchPosition));
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
        this.eggs = reject(equals(egg), this.eggs)
    };

    update = () => {
        if (this._hatchStart && (this.timeHatching >= EGG_HATCH_TIME)) {
            this.hatchEggEnd();
        }

        if (this.isHatching && this._progress) {
            const progress = this.timeHatching / EGG_HATCH_TIME;
            this._progress.updateProgress(progress);
        }
    }
}

export default new Eggs();
