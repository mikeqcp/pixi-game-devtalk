import getTexture from "../getTexture";
import { Sprite } from "pixi.js";

export const createSprite = name => new Sprite(getTexture(`images/${name}`));