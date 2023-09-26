import promptSync from 'prompt-sync';
import HumanPlayer from './players/HumanPlayer.js';
import AIPlayer from './players/AIPlayer.js';
import GameBoard from './GameBoard.js';
import { playerTypes } from './players/Player.js';
import {
  centralityScore,
  completableCentralityScore,
  completableScore,
} from './EvaluationFunctions.js';
import { getProbabilitiesMatrix } from './utils.js';
const prompt = promptSync();

export const initialBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
export const probabilitiesMatrix = getProbabilitiesMatrix(initialBoard); //Create the probabilities matrix for the initial board.

const gameBoard = new GameBoard(initialBoard);

function initiateTheGame() {
  try {
    const gameMode = getGameModeFromUser();
    const players = getPlayersFromUser(gameMode);
    playGame(players);
  } catch (err) {
    console.log(err.message);
    console.log('Try Again...');
    initiateTheGame();
  }
}

function getGameModeFromUser() {
  console.log(`
  Welcome to the Connect4 Game...
  Select the Game Mode:
  1 - Human vs Human
  2 - AI vs AI
  3 - Human vs AI
  4 - AI vs Human
  `);
  const gameMode = prompt('Select 1-4: ');

  return gameMode;
}

function getPlayersFromUser(gameMode) {
  const players = [];
  switch (gameMode) {
    case '1':
      players[0] = new HumanPlayer(gameBoard, playerTypes.maximizing);
      players[1] = new HumanPlayer(gameBoard, playerTypes.minimizing);
      break;
    case '2':
      console.log('\nFirst (Maximizing) AI Player (Player X): ');
      players[0] = getAIPlayerFromUser(playerTypes.maximizing);

      console.log('\nSecond (Minimizing) AI Player (Player O): ');
      players[1] = getAIPlayerFromUser(playerTypes.minimizing);
      break;
    case '3':
      players[0] = new HumanPlayer(gameBoard, playerTypes.maximizing);
      console.log('\nMinimizing AI Player (Player O): ');
      players[1] = getAIPlayerFromUser(playerTypes.minimizing);
      break;
    case '4':
      console.log('\nMaximizing AI Player (Player X): ');
      players[0] = getAIPlayerFromUser(playerTypes.maximizing);
      players[1] = new HumanPlayer(gameBoard, playerTypes.minimizing);
      break;
    default:
      throw new Error('\nPlease Choose a Valid Option From 1 to 4');
  }

  return players;
}

function getAIPlayerFromUser(playerType) {
  const heuristicFunctions = {
    1: completableScore,
    2: centralityScore,
    3: completableCentralityScore,
  };
  const numOfPlies = prompt('  Enter the number of plies: ');
  console.log(`
  Choose the Evaluation Heuristic For the AI player:
  1 - Completable Score,
  2 - Centrality Score,
  3 - Completable Centrality Score
  `);
  const heuristicFunctionKey = prompt(' Select 1-3: ');
  const heuristicFunction = heuristicFunctions[heuristicFunctionKey];

  if (!heuristicFunction) {
    throw new Error('\nPlease Choose a valid Evaluation Heuristic From 1 to 3');
  }

  return new AIPlayer(gameBoard, playerType, numOfPlies, heuristicFunction);
}

function playGame(players) {
  while (true) {
    for (const player of players) {
      console.log(`\n\nPlayer ${player.playerType} Plays...`);
      console.log(player.gameBoard.toString(), '\n');
      player.takeTurn();

      if (gameBoard.isWinning(player.playerType)) {
        console.log('\n');
        console.log(gameBoard.toString());
        console.log(
          `Player ${player.playerType} Won the Game. (${
            player.playerType === 'X' ? 'First Player' : 'Second Player'
          })`
        );
        return;
      }

      if (gameBoard.isDraw()) {
        console.log('\n');
        console.log(gameBoard.toString());
        console.log('Game Resulted in Draw.');
        return;
      }
    }
  }
}

initiateTheGame();
