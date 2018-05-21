import { both, is, equals } from 'ramda';

export class Keyboard {
    constructor(keyCode) {
        this.keyCode = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.onPress = undefined;
        this.onRelease = undefined;

        window.addEventListener('keydown', this.downHandler, false);
        window.addEventListener('keyup', this.upHandler, false);
    }

    downHandler = event => {
        if (equals(this.keyCode)(event.keyCode)) {
            if (both(is(true, this.isUp), is(Function, this.onPress))) {
                this.onPress();
            }

            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    upHandler = event => {
        if (equals(this.keyCode)(event.keyCode)) {
            if (both(is(true, this.isDown), is(Function, this.onRelease))) {
                this.onRelease();
            }

            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    };

    destroy = () => {
        this.keyCode = null;
        this.isDown = null;
        this.isUp = null;
        this.onPress = null;
        this.onRelease = null;
        window.removeEventListener('keydown', this.downHandler, false);
        window.removeEventListener('keyup', this.upHandler, false);

        return null;
    }
}