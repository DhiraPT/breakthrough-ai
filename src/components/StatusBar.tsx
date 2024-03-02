import { Player } from "../types/types";

interface StatusBarProps {
  isGameOver: boolean;
  isPlayerTurn: boolean;
  player: Player;
  winner: Player | null;
}

const StatusBar = ({ isGameOver, isPlayerTurn, player, winner }: StatusBarProps) => {
  let status = "";
  if (isGameOver) {
    status = "Game Over" + (winner === player ? " - You Win!" : " - Player AI Wins!");
  } else {
    status = isPlayerTurn ? "Your Turn" : "Player AI's Turn";
  }
  return (
    <div className="status-bar">
      <h1>{status}</h1>
    </div>
  );
};

export default StatusBar;
