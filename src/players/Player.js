export default class Player {
  constructor(gameBoard, playerType) {
    this.gameBoard = gameBoard;
    this.playerType = playerType;
  }
}

export const  playerTypes = {
  maximizing: 'X',
  minimizing: 'O',
};
