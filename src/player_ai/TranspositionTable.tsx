import { Board, MoveWithScore } from "../types/types";

class TranspositionTable {
  table: Map<Board, { depth: number; bestMove: MoveWithScore }>;

  constructor() {
    this.table = new Map();
  }

  put(board: Board, depth: number, bestMove: MoveWithScore): void {
    this.table.set(board, { depth, bestMove });
  }

  get(board: Board): { depth: number; bestMove: MoveWithScore } | undefined {
    return this.table.get(board);
  }
}

export default TranspositionTable;
