export type Board = string[][];

export type Position = {
  row: number;
  col: number;
};

export type Move = {
  src: Position;
  dst: Position;
};

export type Player = "W" | "B";

export type Score = number;

export type MoveWithScore = {
  score: Score;
  move: Move | null;
};
