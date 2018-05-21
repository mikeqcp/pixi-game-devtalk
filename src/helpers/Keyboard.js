import { equals, defaultTo, always } from 'ramda';

export class Keyboard {
    constructor(keyCode, onPress, onRelease) {
        this.keyCode = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.onPress = defaultTo(always)(onPress);
        this.onRelease = defaultTo(always)(onRelease);

        window.addEventListener('keydown', this.downHandler, false);
        window.addEventListener('keyup', this.upHandler, false);
    }

    downHandler = event => {
        if (equals(this.keyCode)(event.keyCode)) {
            if (this.isUp) {
                this.onPress();
            }

            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    };

    upHandler = event => {
        if (equals(this.keyCode)(event.keyCode)) {
            if (this.isDown) {
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