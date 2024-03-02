import "@pixi/events";
import { Graphics, Stage } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js";
import { useCallback, useEffect, useState } from "react";

import PlayerAI from "../../player_ai/PlayerAI";
import { Board, Move, MoveWithScore, Player, Position } from "../../types/types";
import { SIZE } from "../../utils/constants";
import Utils from "../../utils/utils";
import Piece from "./Piece";

interface GameProps {
  isGameOver: boolean;
  setIsGameOver: (isGameOver: boolean) => void;
  isPlayerTurn: boolean;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
  player: Player;
  setWinner: (winner: Player | null) => void;
}

const Game = ({
  isGameOver,
  setIsGameOver,
  isPlayerTurn,
  setIsPlayerTurn,
  player,
  setWinner,
}: GameProps) => {
  const width = 500;
  const height = 500;
  const tileWidth = width / SIZE;
  /**
   * PlayerAI will switch to the player's color
   * when the board is flipped for the AI's turn.
   */
  const playerAI = new PlayerAI(player);
  const [board, setBoard] = useState<Board>([]);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [possibleDsts, setPossibleDsts] = useState<Position[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  const drawTile = useCallback(
    (g: GraphicsType, r: number, c: number, isSelected: boolean, isLastMove: boolean) => {
      g.clear();
      g.beginFill(isLightTile(r, c) ? 0xf7ce96 : 0xaa6c40);
      g.drawRect(c * tileWidth, r * tileWidth, tileWidth, tileWidth);
      g.endFill();
      if (isSelected) {
        g.beginFill(0xfcfc62, 0.7);
        g.drawRect(c * tileWidth, r * tileWidth, tileWidth, tileWidth);
        g.endFill();
      } else if (isLastMove) {
        g.beginFill(0xa3ed62, 0.7);
        g.drawRect(c * tileWidth, r * tileWidth, tileWidth, tileWidth);
        g.endFill();
      }
    },
    [tileWidth],
  );

  const isLightTile = (row: number, col: number) => {
    return (row + col) % 2 === 0;
  };

  const tileSelected = (row: number, col: number) => {
    if (board[row][col] === player) {
      // If player clicked on a tile containing their piece
      if (
        !selectedPiece ||
        (selectedPiece && selectedPiece.row !== row) ||
        selectedPiece.col !== col
      ) {
        // If the piece is not already selected, select it
        setSelectedPiece({ row, col });
        setPossibleDsts(Utils.getValidMoves(board, player, row, col).map((m) => m.dst));
      } else {
        // If the piece is already selected, deselect it
        setSelectedPiece(null);
        setPossibleDsts([]);
      }
    } else {
      // If player clicked on a tile that doesn't contain their piece
      if (
        selectedPiece &&
        possibleDsts.find((dst: Position) => dst.row === row && dst.col === col)
      ) {
        // If the selected tile is a valid destination, move the piece
        setLastMove({ src: { row: selectedPiece.row, col: selectedPiece.col }, dst: { row, col } });
        setBoard((currBoard: Board) => {
          const newBoard = [...currBoard];
          Utils.movePiece(newBoard, player, {
            src: { row: selectedPiece.row, col: selectedPiece.col },
            dst: { row: row, col: col },
          });
          return newBoard;
        });
        setSelectedPiece(null);
        setPossibleDsts([]);
        setIsPlayerTurn(false);
      } else {
        // If the selected tile is not a valid destination, deselect the piece
        setSelectedPiece(null);
        setPossibleDsts([]);
      }
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !isGameOver) {
      setTimeout(() => {
        const move: MoveWithScore = playerAI.makeMove(Utils.invertBoard(board, false));
        setBoard((currBoard: Board) => {
          const newBoard = [...currBoard];
          Utils.invertBoard(newBoard);
          setLastMove(move.move ? Utils.invertMove(move.move) : null);
          Utils.movePiece(newBoard, player, move.move!);
          Utils.invertBoard(newBoard);
          return newBoard;
        });
        setIsPlayerTurn(true);
      }, 20);
    }
  }, [isPlayerTurn, isGameOver, board, player, setIsPlayerTurn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (board.length > 0) {
      const [gameOver, winner] = Utils.isGameOver(board, player);
      if (gameOver) {
        setIsPlayerTurn(false);
        setIsGameOver(true);
        setWinner(winner);
      }
    }
  }, [board, player, setIsGameOver, setIsPlayerTurn, setWinner]);

  useEffect(() => {
    if (!isGameOver) {
      setBoard(Utils.createBoard(player));
      setSelectedPiece(null);
      setPossibleDsts([]);
      setLastMove(null);
    }
  }, [player, isGameOver]);

  return (
    <Stage
      width={width}
      height={height}
      raf={false}
      renderOnComponentChange={true}
      options={{ antialias: true }}
    >
      {(() => {
        const tiles = [];
        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            tiles.push(
              <Graphics
                key={`${r}-${c}`}
                draw={(g) =>
                  drawTile(
                    g,
                    r,
                    c,
                    selectedPiece ? selectedPiece.row === r && selectedPiece.col === c : false,
                    lastMove
                      ? (lastMove.src.row === r && lastMove.src.col === c) ||
                          (lastMove.dst.row === r && lastMove.dst.col === c)
                      : false,
                  )
                }
                eventMode={isPlayerTurn ? "static" : "none"}
                pointerdown={() => tileSelected(r, c)}
              />,
            );
          }
        }
        return tiles;
      })()}
      {board.map((row: string[], r: number) => {
        return row.map((p: string, c: number) => {
          if (p !== "_") {
            return (
              <Piece
                key={`${p} - ${r}, ${c}`}
                row={r}
                col={c}
                player={p as Player}
                x={c * tileWidth + tileWidth / 2}
                y={r * tileWidth + tileWidth / 2}
                radius={(0.75 * tileWidth) / 2}
              />
            );
          }
        });
      })}
    </Stage>
  );
};

export default Game;
