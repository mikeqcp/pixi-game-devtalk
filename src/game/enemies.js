import { ticker } from 'pixi.js';
import { reject, equals, range, nth, clamp } from "ramda";
import { Enemy } from '../characters/enemy';
import Game from "./game";
import GameState from './game.state';

const INITIAL_SPAWN_DELAY = 2000;
const MIN_SPAWN_DELAY = 500;
const SPAWN_DELAY_ACCURACY = 250;

const SPAWN_INCRESE_THRESHOLD = 5000;   //after this amount of milliseconds spawn delay gets lowered by SPAWN_DELAY_STEP
const SPAWN_DELAY_STEP = 250;

const spawnDelay = () => {
    const spawnSpeed =  Math.floor(GameState.gameTime / SPAWN_INCRESE_THRESHOLD);
    const spawnDelay = INITIAL_SPAWN_DELAY - spawnSpeed * SPAWN_DELAY_STEP;

    const delay = Math.floor(Math.random() * spawnDelay + SPAWN_DELAY_ACCURACY) + spawnDelay - SPAWN_DELAY_ACCURACY;
    return clamp(MIN_SPAWN_DELAY, INITIAL_SPAWN_DELAY + SPAWN_DELAY_ACCURACY, delay);
};

function getRandomElement(array) {
    const max = array.length;
    return array[Math.floor(Math.random() * max)];
}

class Enemies {
    enemies = [];
    _lastEnemy = 0;

    constructor() {
        ticker.shared.add(this.update);
    }

    remove = enemy => {
        this.enemies = reject(equals(enemy))(this.enemies);
        Game.stage.removeChild(enemy.sprite);
    };

    update = () => {
        const eggsCount = GameState.eggsController.eggs.length;
        if (eggsCount > 0) {
            const targetEgg = getRandomElement(GameState.eggsController.eggs);

            if (Date.now() - this._lastEnemy > spawnDelay()) {
                this.spawn(targetEgg);
            }
        }
    };

    spawn = (targetEgg) => {
        const enemy = new Enemy(targetEgg);
        this.enemies.push(enemy);
        this._lastEnemy = Date.now();
        Game.stage.addChild(enemy.sprite);
    };

    reset() {
        this._lastEnemy = 0;
        this.enemies.forEach(en => {
            Game.stage.removeChild(en.sprite);
        });
        this.enemies = [];
    }
}

export default new Enemies();
