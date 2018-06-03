import { ticker } from 'pixi.js';
import { reject, equals } from "ramda";
import { Enemy } from '../characters/enemy';
import Game from "./game";
import GameState from './game.state';

const SPAWN_DELAY = 750;

class Enemies {
    _enemies = [];
    _lastEnemy = 0;

    constructor() {
        ticker.shared.add(this.update);
    }

    remove = enemy => {
        this._enemies = reject(equals(enemy))(this._enemies);
        Game.stage.removeChild(enemy.sprite);
    };

    update = () => {
        if (GameState.eggs.eggs.length > 0) {
            if (Date.now() - this._lastEnemy > SPAWN_DELAY) {
                this.spawn();
            }
        }
    };

    spawn = () => {
        const enemy = new Enemy();
        this._enemies.push(enemy);
        this._lastEnemy = Date.now();
        Game.stage.addChild(enemy.sprite);
    }
}

export default new Enemies();