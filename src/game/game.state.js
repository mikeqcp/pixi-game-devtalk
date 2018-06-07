import Eggs from './eggs';
import Enemies from './enemies';
import Score from './score';

class GameState {
    scoreController = Score;
    enemies = Enemies;
    eggs = Eggs;
}

export default new GameState();
