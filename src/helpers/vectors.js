import Victor from 'victor';

export const positionToVector = position => new Victor(position.x, position.y);

export const vectorAsPosition = (position, vector) => position.set(vector.x, vector.y);