import Eggs from './eggs';
import Enemies from './enemies';
import Score from './score';

class GameState {
    scoreController = Score;
    enemies = Enemies;
    eggsController = Eggs;
}

export default new GameState();
