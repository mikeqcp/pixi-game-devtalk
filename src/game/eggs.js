import Egg from "./Egg";
import { remove } from 'ramda';
import { emitter, EGG_HATCH_START, EARN_SCORE, EGG_HATCH_END } from './game.events';
import { ticker } from 'pixi.js';
import Game from './game';
import { vectorAsPosition } from "../helpers/vectors";
import ProgressBar from "../effects/ProgressBar";

const POINTS_PER_EGG_PER_SECOND = 1;
const EGG_HATCH_TIME = 5000;

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

    destroyEgg = id => this.eggs = remove(id, 1, this.eggs);

    update = () => {
        emitter.emit(EARN_SCORE, this.eggs.length * POINTS_PER_EGG_PER_SECOND);

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