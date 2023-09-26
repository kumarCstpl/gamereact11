import promptSync from 'prompt-sync';
import Player from './Player.js';
const prompt = promptSync();

export default class HumanPlayer extends Player {
  constructor(gameBoard, playerType) {
    super(gameBoard, playerType);
  }

  takeTurn() {
    const position = prompt('Position: ');

    try {
      this.gameBoard.addTokenToBoard(position, this.playerType);
    } catch (err) {
      console.log(err.message);
      console.log('Try again...');
      this.takeTurn();
    }
  }
}
