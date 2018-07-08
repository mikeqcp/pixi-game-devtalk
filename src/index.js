import preloadResources from './preloadResources';
import Game from "./game/game";
window.game = Game; //todo: deprecate this and use module instead
import 'pixi-sound'

window.addEventListener("load", () => {
    // List of resources to load
    const resources = [
        "images/plane.png",
        "images/chicken.png",
        "images/bullet.png",
        "images/racoon.png",
        "images/background.jpg",
        "images/egg.png",
        "images/particle.png",
        "images/chicken_spritesheet.json",
        "images/racoon_spritesheet.json",
        "sound/shoot.wav",
        "sound/boom.wav",
        "sound/chicken.wav",
    ];

    // Then load the images
    preloadResources(resources, () => {
        Game.setupStage();
    });
});
