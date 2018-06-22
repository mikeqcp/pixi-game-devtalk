import Eggs from './eggs';
import Enemies from './enemies';
import Score from './score';

class GameState {
    scoreController = Score;
    enemies = Enemies;
    eggsController = Eggs;

    reset() {
        this.scoreController.reset();
        this.enemies.reset();
        this.eggsController.reset();
    }
}

export default new GameState();
