import EventEmitter from 'event-emitter';

export const emitter = new EventEmitter();

export const GAME_START = 'GAME_START';
export const GAME_OVER = 'GAME_OVER';
export const GAME_RESET = 'GAME_RESET';

export const EGG_HATCH_START = 'EGG_HATCH_START';
export const EGG_HATCH_END = 'EGG_HATCH_END';

export const EARN_SCORE = 'EARN_SCORE';
