import {initialBoard} from './index.js';

/**
 * Traverses through the board array and returns the 2d array of the probabilities that
 * having a solution that passes through each position
 */
export function getProbabilitiesMatrix() {
  const probabilitiesMatrix = initialBoard.map(row => row.slice()); //Copy the initial board.
  
  horizontalProbabilities(probabilitiesMatrix);
  verticalProbabilities(probabilitiesMatrix);
  diagonalProbabilities(probabilitiesMatrix);
  antiDiagonalProbabilities(probabilitiesMatrix);

  return probabilitiesMatrix;
}

function horizontalProbabilities(probabilitiesArray) {
  for (let i = 0; i < probabilitiesArray.length; i++) {
    for (let j = 0; j < probabilitiesArray[i].length - 3; j++) {
      probabilitiesArray[i][j]++;
      probabilitiesArray[i][j + 1]++;
      probabilitiesArray[i][j + 2]++;
      probabilitiesArray[i][j + 3]++;
    }
  }
}

function verticalProbabilities(probabilitiesArray) {
  for (let i = 0; i < probabilitiesArray.length - 3; i++) {
    for (let j = 0; j < probabilitiesArray[i].length; j++) {
      probabilitiesArray[i][j]++;
      probabilitiesArray[i + 1][j]++;
      probabilitiesArray[i + 2][j]++;
      probabilitiesArray[i + 3][j]++;
    }
  }
}

function diagonalProbabilities(probabilitiesArray) {
  for (let i = 0; i < probabilitiesArray.length - 3; i++) {
    for (let j = 0; j < probabilitiesArray[i].length - 3; j++) {
      probabilitiesArray[i][j]++;
      probabilitiesArray[i + 1][j + 1]++;
      probabilitiesArray[i + 2][j + 2]++;
      probabilitiesArray[i + 3][j + 3]++;
    }
  }
}

function antiDiagonalProbabilities(probabilitiesArray) {
  for (let i = 0; i < probabilitiesArray.length - 3; i++) {
    for (let j = probabilitiesArray[i].length - 1; j > 2; j--) {
      probabilitiesArray[i][j]++;
      probabilitiesArray[i + 1][j - 1]++;
      probabilitiesArray[i + 2][j - 2]++;
      probabilitiesArray[i + 3][j - 3]++;
    }
  }
}

/**Returns The Sum of all the completable tokens for the given playerType*/
export function getCompletableSumOfPlayer(gameBoard, playerType) {
  const completableMatrix = getCompletableMatrixOfPlayer(gameBoard, playerType);

  let completableSum = 0;
  for (let i = 0; i < gameBoard.board.length; i++) {
    for (let j = 0; j < gameBoard.board[i].length; j++) {
      completableSum += completableMatrix[i][j];
    }
  }

  return completableSum;
}

export function getCompletableMatrixOfPlayer(gameBoard, playerType) {
  const completableMatrix = initialBoard.map(row => row.slice()); //Copy the initial board.

  for (let i = 0; i < gameBoard.board.length; i++) {
    for (let j = 0; j < gameBoard.board[i].length; j++) {
      if (gameBoard.board[i][j] === playerType) {
        if (verticalCompletableScore(gameBoard, i, j) > 0) {
          completableMatrix[i][j]++;
        }
        if (horizontalCompletableScore(gameBoard, i, j) > 0) {
          completableMatrix[i][j]++;
        }
        if (diagonalCompletableScore(gameBoard, i, j) > 0) {
          completableMatrix[i][j]++;
        }
        if (antiDiagonalCompletableScore(gameBoard, i, j) > 0) {
          completableMatrix[i][j]++;
        }
      }
    }
  }

  return completableMatrix;
}

//Get horizontal completable adjacent number of a point
function horizontalCompletableScore(gameBoard, row, col) {
  const tokenType = gameBoard.board[row][col];
  let [low, high] = [col - 1, col + 1];
  let [lowFast, highFast] = [col - 1, col + 1];

  while (low >= 0 && gameBoard.board[row][low] === tokenType) {
    low--;
  }

  while (
    high < gameBoard.board[0].length &&
    gameBoard.board[row][high] === tokenType
  ) {
    high++;
  }

  while (
    lowFast >= 0 &&
    (gameBoard.board[row][lowFast] === tokenType ||
      gameBoard.board[row][lowFast] === 0)
  ) {
    lowFast--;
  }

  while (
    highFast < gameBoard.board[0].length &&
    (gameBoard.board[row][highFast] === tokenType ||
      gameBoard.board[row][highFast] === 0)
  ) {
    highFast++;
  }

  const adjacentCount = high - low - 1;
  const potentialCount = highFast - lowFast - 1;
  const completableAdjacentCount = potentialCount < 4 ? 0 : adjacentCount;

  return completableAdjacentCount;
}

function verticalCompletableScore(gameBoard, row, col) {
  const tokenType = gameBoard.board[row][col];

  let low = row - 1,
    lowFast = row - 1;
  let high = row + 1,
    highFast = row + 1;

  while (low >= 0 && gameBoard.board[low][col] === tokenType) {
    low--;
  }

  while (
    high < gameBoard.board.length &&
    gameBoard.board[high][col] === tokenType
  ) {
    high++;
  }

  while (
    lowFast >= 0 &&
    (gameBoard.board[lowFast][col] === tokenType ||
      gameBoard.board[lowFast][col] === 0)
  ) {
    lowFast--;
  }

  while (
    highFast < gameBoard.board.length &&
    (gameBoard.board[highFast][col] === tokenType ||
      gameBoard.board[highFast][col] === 0)
  ) {
    highFast++;
  }

  const adjacentCount = high - low - 1;
  const potentialCount = highFast - lowFast - 1;
  const completableAdjacentCount = potentialCount < 4 ? 0 : adjacentCount;

  return completableAdjacentCount;
}

function diagonalCompletableScore(gameBoard, row, col) {
  const tokenType = gameBoard.board[row][col];

  let lowI = row - 1,
    lowJ = col - 1,
    lowIFast = row - 1,
    lowJFast = col - 1;
  let highI = row + 1,
    highIFast = row + 1,
    highJ = col + 1,
    highJFast = col + 1;

  while (lowI >= 0 && lowJ >= 0 && gameBoard.board[lowI][lowJ] === tokenType) {
    lowI--;
    lowJ--;
  }

  while (
    highI < gameBoard.board.length &&
    highJ < gameBoard.board[0].length &&
    gameBoard.board[highI][highJ] === tokenType
  ) {
    highI++;
    highJ++;
  }

  while (
    lowIFast >= 0 &&
    lowJFast >= 0 &&
    (gameBoard.board[lowIFast][lowJFast] === tokenType ||
      gameBoard.board[lowIFast][lowJFast] === 0)
  ) {
    lowIFast--;
    lowJFast--;
  }

  while (
    highIFast < gameBoard.board.length &&
    highJFast < gameBoard.board[0].length &&
    (gameBoard.board[highIFast][highJFast] === tokenType ||
      gameBoard.board[highIFast][highJFast] === 0)
  ) {
    highIFast++;
    highJFast++;
  }

  const adjacentCount = highI - lowI - 1;
  const potentialCount = highIFast - lowIFast - 1;
  const completableAdjacentCount = potentialCount < 4 ? 0 : adjacentCount;

  return completableAdjacentCount;
}

function antiDiagonalCompletableScore(gameBoard, row, col) {
  const tokenType = gameBoard.board[row][col];

  let lowI = row - 1,
    lowJ = col + 1,
    lowIFast = row - 1,
    lowJFast = col + 1;
  let highI = row + 1,
    highIFast = row + 1,
    highJ = col - 1,
    highJFast = col - 1;

  while (
    lowI >= 0 &&
    lowJ < gameBoard.board[0].length &&
    gameBoard.board[lowI][lowJ] === tokenType
  ) {
    lowI--;
    lowJ++;
  }

  while (
    highI < gameBoard.board.length &&
    highJ >= 0 &&
    gameBoard.board[highI][highJ] === tokenType
  ) {
    highI++;
    highJ--;
  }

  while (
    lowIFast >= 0 &&
    lowJFast < gameBoard.board[0].length &&
    (gameBoard.board[lowIFast][lowJFast] === tokenType ||
      gameBoard.board[lowIFast][lowJFast] === 0)
  ) {
    lowIFast--;
    lowJFast++;
  }

  while (
    highIFast < gameBoard.board.length &&
    highJFast >= 0 &&
    (gameBoard.board[highIFast][highJFast] === tokenType ||
      gameBoard.board[highIFast][highJFast] === 0)
  ) {
    highIFast++;
    highJFast--;
  }

  const adjacentCount = highI - lowI - 1;
  const potentialCount = highIFast - lowIFast - 1;
  const completableAdjacentCount = potentialCount < 4 ? 0 : adjacentCount;

  return completableAdjacentCount;
}
