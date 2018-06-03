import Egg from "./Egg";
import { remove } from 'ramda';
import { emitter, EGG_HATCH_START, EARN_SCORE, EGG_HATCH_END } from './game.events';
import { ticker } from 'pixi.js';
import Game from './game';
import { vectorAsPosition } from "../helpers/vectors";

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
        this._progress = new PIXI.Text('0%');
        this._progress.position.x = position.x;
        this._progress.position.y = position.y - 50;
        this._progress.anchor.x = .5;
        this._progress.anchor.y = .5;
        Game.stage.addChild(this._progress);
    };

    hatchEggEnd = () => {
        if (this._hatchStart && this.timeHatching >= EGG_HATCH_TIME) {
            this.eggs.push(new Egg(this._hatchPosition));
        }

        Game.stage.removeChild(this._progress);
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
            this._progress.text = `${Math.round(progress * 100)}%`;
        }
    }
}

export default new Eggs();