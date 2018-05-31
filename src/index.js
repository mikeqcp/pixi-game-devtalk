import preloadResources from './preloadResources';
import Game from "./game/game";
window.game = Game; //todo: deprecate this and use module instead

window.addEventListener("load", () => {
    // List of resources to load
    const resources = ["images/plane.png", "images/chicken.png", "images/bullet.png", "images/racoon.png",
        "images/background.jpg"];

    // Then load the images
    preloadResources(resources, () => {
        Game.setupStage();
    });
});
