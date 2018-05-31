import Egg from "./Egg";
import { remove } from 'ramda';
import { emitter, EGG_HATCH_START, EARN_SCORE } from './game.events';
import { ticker } from 'pixi.js';

const POINTS_PER_EGG_PER_SECOND = 1;

class Eggs {
    eggs = [];

    constructor() {
        emitter.on(EGG_HATCH_START, position => {
            this.hatchEgg({ position });
        });
        ticker.shared.add(this.update);
    }

    hatchEgg = ({ position }) => this.eggs.push(new Egg(position));

    destroyEgg = id => this.eggs = remove(id, 1, this.eggs);

    update = () => {
        emitter.emit(EARN_SCORE, this.eggs.length * POINTS_PER_EGG_PER_SECOND);
    }
}

export default new Eggs();