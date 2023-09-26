import { probabilitiesMatrix } from './index.js';
import { playerTypes } from './players/Player.js';
import {
  getCompletableSumOfPlayer,
  getCompletableMatrixOfPlayer,
} from './utils.js';

/**Returns the completable score of the given gameBoard.
 * A piece is completable, if you can form a 4 connected pieces
 * that passes within that piece. The maximum score you can get from
 * an individual piece is 4 (completable for all directions), and the less is
 * 0 meaning that it is surrounded by enemy pieces and can't be a part of a solution
 */
export function completableScore(gameBoard) {
  const maximizingCompletableSum = getCompletableSumOfPlayer(
    gameBoard,
    playerTypes.maximizing
  );
  const minimizingCompletableSum = getCompletableSumOfPlayer(
    gameBoard,
    playerTypes.minimizing
  );

  const score = maximizingCompletableSum - minimizingCompletableSum;
  return score;
}

/**Returns the centrality score of the given GameBoard. We use the getProbabilities array
 * function to generate the 2d probabilities array for the gameboard by traversing
 * through it in four directions. After that, we increment the score for each maximizing piece
 * and decrement for each minimizing piece by looking at the probabilities of their indices.
 */
export function centralityScore(gameBoard) {
  let score = 0;
  for (let i = 0; i < gameBoard.board.length; i++) {
    for (let j = 0; j < gameBoard.board[i].length; j++) {
      const currentToken = gameBoard.board[i][j];
      if (currentToken === playerTypes.maximizing) {
        score += probabilitiesMatrix[i][j];
      }

      if (currentToken === playerTypes.minimizing) {
        score -= probabilitiesMatrix[i][j];
      }
    }
  }

  return score;
}

/**This is the combination of the completable score and
 * centrality score.
 */
export function completableCentralityScore(gameBoard) {
  const maximizingCompletableMatrix = getCompletableMatrixOfPlayer(
    gameBoard,
    playerTypes.maximizing
  );
  const minimizingCompletableMatrix = getCompletableMatrixOfPlayer(
    gameBoard,
    playerTypes.minimizing
  );

  let score = 0;
  for (let i = 0; i < probabilitiesMatrix.length; i++) {
    for (let j = 0; j < probabilitiesMatrix[i].length; j++) {
      if (maximizingCompletableMatrix[i][j] > 0) {
        score += probabilitiesMatrix[i][j] * maximizingCompletableMatrix[i][j];
      }
      if (minimizingCompletableMatrix[i][j] > 0) {
        score -= probabilitiesMatrix[i][j] * minimizingCompletableMatrix[i][j];
      }
    }
  }

  return score;
}
