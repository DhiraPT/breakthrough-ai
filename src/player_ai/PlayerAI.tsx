import _ from "lodash";

import { Board, Move, MoveWithScore, Player, Position, Score } from "../types/types";
import { INF, SIZE, WIN } from "../utils/constants";
import Utils from "../utils/utils";
import TranspositionTable from "./TranspositionTable";

class PlayerAI {
  player: Player;
  opponent: Player;
  minDepth: number;
  transpositionTable: TranspositionTable;
  maxTime: number;

  constructor(player: Player) {
    this.player = player;
    this.opponent = player === "W" ? "B" : "W";
    this.minDepth = 4;
    this.transpositionTable = new TranspositionTable();
    this.maxTime = 2900;
  }

  getAllValidMoves(board: Board): Move[] {
    const moves: Move[] = [];
    for (let r = 0; r < SIZE; r++) {
      const shuffledCols = _.shuffle(Array.from(Array(SIZE).keys()));
      for (const c of shuffledCols) {
        if (board[r][c] === this.player) {
          moves.push(...Utils.getValidMoves(board, this.player, r, c));
        }
      }
    }
    return moves;
  }

  evaluate(board: Board): number {
    let activePlayerCount = 0;
    let nextPlayerCount = 0;
    let activePlayerScore = 0;
    let nextPlayerScore = 0;

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === this.player) {
          activePlayerCount++;
          if (r === 0) {
            return WIN;
          } else if (r === 1) {
            activePlayerScore += 80;
            let canWin = true;
            for (const dc of [-1, 1]) {
              const dst = { row: r - 1, col: c + dc };
              if (!Utils.isOutOfBounds(dst)) {
                if (board[dst.row][dst.col] === this.opponent) {
                  canWin = false;
                  break;
                }
              }
            }
            activePlayerScore += canWin ? 160 : -80;
          } else if (r === 2) {
            activePlayerScore += 40;
          } else if (r === 3) {
            activePlayerScore += 20;
          } else {
            activePlayerScore += 10;
          }
          // Center bonus
          if (c >= 2 && c <= 3) {
            activePlayerScore += 5;
          }
          // Chain bonus
          for (const dc of [-1, 1]) {
            const dst: Position = { row: r + 1, col: c + dc };
            if (!Utils.isOutOfBounds(dst) && board[dst.row][dst.col] === this.player) {
              activePlayerScore += (SIZE - 1 - dst.row) * 10;
            }
          }
          // Capture potential
          for (const dc of [-1, 1]) {
            const dst = { row: r - 1, col: c + dc };
            if (!Utils.isOutOfBounds(dst) && board[dst.row][dst.col] === this.opponent) {
              activePlayerScore += 20;
              break;
            }
          }
        } else if (board[r][c] === this.opponent) {
          nextPlayerCount++;
          if (r === 5) {
            return -WIN;
          } else if (r === 4) {
            nextPlayerScore += 80;
            let canWin = true;
            for (const dc of [-1, 1]) {
              const dst = { row: r + 1, col: c + dc };
              if (!Utils.isOutOfBounds(dst)) {
                if (board[dst.row][dst.col] === this.player) {
                  canWin = false;
                  break;
                }
              }
            }
            nextPlayerScore += canWin ? 160 : -80;
          } else if (r === 3) {
            nextPlayerScore += 40;
          } else if (r === 2) {
            nextPlayerScore += 20;
          } else {
            nextPlayerScore += 10;
          }
        }
        // Chain bonus
        for (const dc of [-1, 1]) {
          const dst: Position = { row: r - 1, col: c + dc };
          if (!Utils.isOutOfBounds(dst) && board[dst.row][dst.col] === this.opponent) {
            nextPlayerScore += dst.row * 10;
          }
        }
      }
    }

    if (activePlayerCount === 0) {
      return -WIN;
    } else if (nextPlayerCount === 0) {
      return WIN;
    }

    activePlayerScore += activePlayerCount * 5;
    nextPlayerScore += nextPlayerCount * 5;

    return activePlayerScore - nextPlayerScore;
  }

  negamaxAlphaBeta(
    board: Board,
    maxDepth: number,
    alpha: number,
    beta: number,
    startTime: number,
  ): MoveWithScore {
    const value = (state: Board, alpha: number, beta: number, depth: number): MoveWithScore => {
      const ttEntry = this.transpositionTable.get(state);
      if (ttEntry && ttEntry.depth >= depth) {
        return ttEntry.bestMove;
      }
      if (Utils.isGameOver(state, this.player)[0] || depth === maxDepth) {
        return { score: this.evaluate(state), move: null };
      }
      let score: Score = -INF;
      let bestMove: Move | null = null;
      for (const move of this.getAllValidMoves(state)) {
        const nextState = Utils.movePiece(state, this.player, move, false);
        const nextMove = value(Utils.invertBoard(nextState), -beta, -alpha, depth + 1);
        if (-nextMove.score > score) {
          score = -nextMove.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
        if (alpha >= beta) {
          break;
        }
        if (performance.now() - startTime >= this.maxTime) {
          break;
        }
      }
      if (performance.now() - startTime < this.maxTime) {
        this.transpositionTable.put(state, depth, {
          score: score,
          move: bestMove,
        });
      }
      return { score: score, move: bestMove };
    };

    return value(board, alpha, beta, 0);
  }

  makeMove(board: Board): MoveWithScore {
    const startTime = performance.now();
    let bestMove: MoveWithScore = { score: -INF, move: null };
    let maxDepth = this.minDepth;

    while (performance.now() - startTime < this.maxTime) {
      const nextMove = this.negamaxAlphaBeta(board, maxDepth, -INF, INF, startTime);
      if (nextMove.move && performance.now() - startTime < this.maxTime) {
        bestMove = nextMove;
      }
      maxDepth++;
    }

    return bestMove;
  }
}

export default PlayerAI;
