import Eggs from './eggs';
import Enemies from './enemies';
import Score from './score';

class GameState {
    scoreController = Score;
    enemies = Enemies;
    eggsController = Eggs;
    _gameStart = Date.now();

    reset() {
        this.scoreController.reset();
        this.enemies.reset();
        this.eggsController.reset();
        this._gameStart = Date.now();
    }

    get gameTime() { return Date.now() - this._gameStart; }
}

export default new GameState();
