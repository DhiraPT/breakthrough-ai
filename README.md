# Breakthrough AI (6x6)

Breakthrough is an abstract strategy board game invented by Dan Troyka in 2000 and made available as a Zillions of Games file. [(source)](https://en.wikipedia.org/wiki/Breakthrough_(board_game)) The goal is to be the first player to move one of your pieces from your starting row to your opponent's back row or capture all the opponent's pieces.

### Game rules:

- Players take turns moving one piece per turn.
- Pieces can only move forward one space per turn, either straight or diagonally, in the direction facing the opponent's side.
- Capturing occurs when a player's piece moves diagonally to a tile occupied by an opponent's piece.
- Stacking is not allowed. Only one piece can occupy a space at a time.

## AI Player

The AI player utilizes the following algorithms and techniques:

- Iterative Deepening Alpha-Beta Pruning (Negamax)
- Transposition Table

## Evaluation Function

The AI leverages a sophisticated evaluation function to assess the current game state and guide its decision-making. This function considers various factors, assigning them weights based on their strategic importance:

- **Piece Distance to Goal**: This evaluates how close each piece is to reaching the opponent's back row.
- **Piece Count**: The remaining number of pieces for each player.
- **Capture Potential**: The ability to capture opponent's pieces.
- **Diagonal Chain Formation**: The potential to create diagonal chains of pieces.
- **Near-Win State**: When a piece is close to winning and cannot be blocked or captured.
- **Center Control**: While not the most crucial factor in Breakthrough, maintaining some presence in the center can offer tactical advantages.