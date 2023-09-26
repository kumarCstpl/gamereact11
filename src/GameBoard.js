import chalk from 'chalk';
import { playerTypes } from './players/Player.js';

export default class GameBoard {
  constructor(board = []) {
    this.board = board;
  }

  addTokenToBoard(position, playerType) {
    if (this.isPositionOutOfBounds(position)) {
      throw new Error(`Position out of bound (${position})`);
    }

    if (this.isPositionFull(position)) {
      throw new Error(`Position ${position} is full! Choose another position`);
    }

    const colIndex = position - 1;
    const rowIndex = this.getRowIndexOfNewToken(position);

    this.board[rowIndex][colIndex] = playerType;
  }

  getRowIndexOfNewToken(position) {
    const colIndex = position - 1;
    let rowIndex = 0;

    while (rowIndex < this.board.length && !this.board[rowIndex][colIndex]) {
      rowIndex++;
    }

    return --rowIndex;
  }

  isPositionOutOfBounds(position) {
    return position < 1 || position > this.board[0].length;
  }

  isPositionFull(position) {
    return this.board[0][position - 1] !== 0;
  }

  emptySlotCount() {
    let count = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          count++;
        }
      }
    }
    return count;
  }

  getChildrenBoards(playerType) {
    const childrenBoards = [];

    for (let i = 0; i < this.board[0].length; i++) {
      if (this.isPositionFull(i + 1)) {
        //If current position is full, don't consider it (position = index + 1)
        continue;
      }

      const newBoard = this.board.map((row) => row.slice()); //Copy of current board array

      const newBoardClass = new GameBoard(newBoard);
      newBoardClass.addTokenToBoard(i + 1, playerType);
      childrenBoards.push(newBoardClass);
    }
    return childrenBoards;
  }

  isGameOver() {
    return (
      this.isDraw() ||
      this.isWinning(playerTypes.maximizing) ||
      this.isWinning(playerTypes.minimizing)
    );
  }

  isDraw() {
    return this.board[0].every((slot, i) => this.isPositionFull(i + 1));
  }

  isWinning(playerType) {
    return (
      this.isWinningHorizontal(playerType) ||
      this.isWinningVertical(playerType) ||
      this.isWinningDiagonal(playerType) ||
      this.isWinningAntidiagonal(playerType)
    );
  }

  isWinningHorizontal(playerType) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 3; j++) {
        if (
          this.board[i][j] === playerType &&
          this.board[i][j + 1] === playerType &&
          this.board[i][j + 2] === playerType &&
          this.board[i][j + 3] === playerType
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isWinningVertical(playerType) {
    for (let i = 0; i < this.board.length - 3; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          this.board[i][j] === playerType &&
          this.board[i + 1][j] === playerType &&
          this.board[i + 2][j] === playerType &&
          this.board[i + 3][j] === playerType
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isWinningDiagonal(playerType) {
    for (let i = 0; i < this.board.length - 3; i++) {
      for (let j = 0; j < this.board[i].length - 3; j++) {
        if (
          this.board[i][j] === playerType &&
          this.board[i + 1][j + 1] === playerType &&
          this.board[i + 2][j + 2] === playerType &&
          this.board[i + 3][j + 3] === playerType
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isWinningAntidiagonal(playerType) {
    for (let i = 0; i < this.board.length - 3; i++) {
      for (let j = this.board[i].length - 1; j > 2; j--) {
        if (
          this.board[i][j] === playerType &&
          this.board[i + 1][j - 1] === playerType &&
          this.board[i + 2][j - 2] === playerType &&
          this.board[i + 3][j - 3] === playerType
        ) {
          return true;
        }
      }
    }
    return false;
  }

  toString() {
    let string = '';

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        const boardValue = this.board[i][j];
        string += `${
          boardValue === 0
            ? ' '
            : boardValue === playerTypes.maximizing
            ? chalk.white.bgRed.bold(boardValue)
            : chalk.black.bgYellowBright.bold(boardValue)
        }${'|'}`;
      }
      string += '\n';
    }

    for (let i = 1; i <= this.board[0].length; i++) {
      string += `${i} `;
    }

    return string;
  }
}
