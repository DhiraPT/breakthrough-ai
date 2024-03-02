import { Board, Move, Player, Position } from "../types/types";
import { SIZE } from "./constants";

class Utils {
  static createBoard(player: Player): Board {
    const board: Board = [];
    const opponent = player === "W" ? "B" : "W";
    for (let r = 0; r < SIZE; r++) {
      const row: string[] = [];
      for (let c = 0; c < SIZE; c++) {
        if (r < SIZE / 2 - 1) {
          row[c] = opponent;
        } else if (r > SIZE / 2) {
          row[c] = player;
        } else {
          row[c] = "_";
        }
      }
      board.push(row);
    }
    return board;
  }

  static invertBoard(board: Board, inPlace: boolean = true): Board {
    if (!inPlace) {
      board = JSON.parse(JSON.stringify(board));
    }
    board.reverse();
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === "B") {
          board[r][c] = "W";
        } else if (board[r][c] === "W") {
          board[r][c] = "B";
        }
      }
    }
    return board;
  }

  static invertMove(move: Move): Move {
    return {
      src: { row: SIZE - 1 - move.src.row, col: move.src.col },
      dst: { row: SIZE - 1 - move.dst.row, col: move.dst.col },
    };
  }

  static isOutOfBounds(position: Position): boolean {
    return position.row < 0 || position.col < 0 || position.row >= SIZE || position.col >= SIZE;
  }

  static isValidMove(board: Board, player: Player, move: Move): boolean {
    const src = move.src;
    const dst = move.dst;
    // Move is in the wrong direction or is more than 1 tile
    if (src.row - dst.row !== 1 || Math.abs(src.col - dst.col) > 1) {
      return false;
    }
    // Dst is out of bounds
    if (Utils.isOutOfBounds(dst)) {
      return false;
    }
    // Forward move is blocked
    if (dst.col === src.col && board[dst.row][dst.col] !== "_") {
      return false;
    }
    // Diagonal move is blocked
    if (dst.col !== src.col && board[dst.row][dst.col] === player) {
      return false;
    }
    return true;
  }

  static getValidMoves(board: Board, player: Player, row: number, col: number): Move[] {
    const moves: Move[] = [];
    for (let dc = -1; dc < 2; dc++) {
      const move = { src: { row, col }, dst: { row: row - 1, col: col + dc } };
      if (Utils.isValidMove(board, player, move)) {
        moves.push(move);
      }
    }
    return moves;
  }

  static movePiece(board: Board, player: Player, move: Move, inPlace: boolean = true): Board {
    if (!inPlace) {
      board = JSON.parse(JSON.stringify(board));
    }
    if (move && this.isValidMove(board, player, move)) {
      board[move.dst.row][move.dst.col] = player;
      board[move.src.row][move.src.col] = "_";
    }
    return board;
  }

  static isGameOver(board: Board, player: Player): [boolean, Player | null] {
    const opponent = player === "W" ? "B" : "W";
    if (board[0].includes(player) || !board.flat().includes(opponent)) {
      return [true, player];
    } else if (board[5].includes(opponent) || !board.flat().includes(player)) {
      return [true, opponent];
    }
    return [false, null];
  }
}

export default Utils;
