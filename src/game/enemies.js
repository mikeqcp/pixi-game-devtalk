import { ticker } from 'pixi.js';
import { reject, equals, range, nth } from "ramda";
import { Enemy } from '../characters/enemy';
import Game from "./game";
import GameState from './game.state';

const SPAWN_DELAY = 1000;

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

            if (Date.now() - this._lastEnemy > SPAWN_DELAY) {
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
