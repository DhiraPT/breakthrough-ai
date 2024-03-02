import { Graphics } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js";
import { useCallback } from "react";

import { Player } from "../../types/types";

interface PieceProps {
  row: number;
  col: number;
  player: Player;
  x: number;
  y: number;
  radius: number;
}

const Piece = ({ player, x, y, radius }: PieceProps) => {
  const draw = useCallback(
    (g: GraphicsType) => {
      g.clear();
      g.beginFill(player === "B" ? 0x000000 : 0xffffff);
      g.drawCircle(x, y, radius);
      g.endFill();
    },
    [player, x, y, radius],
  );

  return <Graphics draw={draw} />;
};

export default Piece;
