import Player, { playerTypes } from './Player.js';

export default class AIPlayer extends Player {
  constructor(gameBoard, playerType, plies, evaluationFunction) {
    super(gameBoard, playerType);
    this.plies = plies;
    this.isMaximizing = this.playerType === playerTypes.maximizing;
    this.evaluationFunction = evaluationFunction;
  }

  takeTurn() {
    const bestChild = this.getBestChild(); //Find the best child
    this.gameBoard.board = bestChild.board; //Change the board to this new child
  }

  /**Returns the best child by calling minimax for each of them */
  getBestChild() {
    const childrenBoards = this.gameBoard.getChildrenBoards(this.playerType);
    childrenBoards.forEach((child, i) => {
      const score = this.minimax(child, this.plies, !this.isMaximizing);
      console.log(`${score}`);
      child.minimaxScore = score;
    });

    childrenBoards.sort((a, b) => {
      return this.isMaximizing
        ? b.minimaxScore - a.minimaxScore
        : a.minimaxScore - b.minimaxScore;
    });

    return childrenBoards[0];
  }

  minimax(
    gameBoard,
    depth,
    isMaximizing,
    alpha = Number.NEGATIVE_INFINITY,
    beta = Number.POSITIVE_INFINITY
  ) {
    if (gameBoard.isGameOver() || depth === 0) {
      return this.getStaticEvaluationOfBoard(gameBoard);
    }

    if (isMaximizing) {
      let maxEvaluation = Number.NEGATIVE_INFINITY;

      const childrenBoards = gameBoard.getChildrenBoards(
        playerTypes.maximizing
      );
      for (const childBoard of childrenBoards) {
        const evaluation = this.minimax(
          childBoard,
          depth - 1,
          false,
          alpha,
          beta
        );
        maxEvaluation = Math.max(maxEvaluation, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEvaluation;
    } else {
      let minEvaluation = Number.POSITIVE_INFINITY;

      const childrenBoards = gameBoard.getChildrenBoards(
        playerTypes.minimizing
      );
      for (const childBoard of childrenBoards) {
        const evaluation = this.minimax(
          childBoard,
          depth - 1,
          true,
          alpha,
          beta
        );
        minEvaluation = Math.min(minEvaluation, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return minEvaluation;
    }
  }

  getStaticEvaluationOfBoard(gameBoard) {
    if (gameBoard.isDraw()) {
      return 0;
    }

    if (gameBoard.isWinning(playerTypes.maximizing)) {
      return 9999 * (gameBoard.emptySlotCount() + 1);
    }

    if (gameBoard.isWinning(playerTypes.minimizing)) {
      return -9999 * (gameBoard.emptySlotCount() + 1);
    }

    return this.evaluationFunction(gameBoard);
  }
}
