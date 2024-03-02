import { useEffect, useState } from "react";

import "./App.css";
import StatusBar from "./components/StatusBar";
import Game from "./components/game/Game";
import { Player } from "./types/types";

function App() {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player>("W");
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    if (player === "B") {
      setIsPlayerTurn(false);
    } else {
      setIsPlayerTurn(true);
    }
    setIsGameOver(false);
    setWinner(null);
  }, [player]);

  return (
    <>
      <Game
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        isPlayerTurn={isPlayerTurn}
        setIsPlayerTurn={setIsPlayerTurn}
        player={player}
        setWinner={setWinner}
      />
      <StatusBar
        isGameOver={isGameOver}
        isPlayerTurn={isPlayerTurn}
        player={player}
        winner={winner}
      />
      <button onClick={() => setPlayer(player === "W" ? "B" : "W")}>Switch Player</button>
    </>
  );
}

export default App;
