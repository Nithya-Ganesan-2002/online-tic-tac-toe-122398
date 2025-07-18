import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * The main App component for the Tic Tac Toe game.
 * Implements a 2-player Tic Tac Toe with modern minimalistic, centered, responsive layout,
 * light theme and custom colors, status display, reset, winner highlighting and turn logic.
 */
function App() {
  // Constants for players and board size
  const PLAYER_X = 'X';
  const PLAYER_O = 'O';
  const BOARD_SIZE = 3;

  // Modern minimal color palette (overrides, used for inline highlight, etc.)
  const COLORS = {
    primary: '#1976d2',
    secondary: '#424242',
    accent: '#fbc02d',
  };

  // Board state: array of 9 squares. Null is empty.
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  // Which player's turn? X always starts new game.
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
  // Has someone won, or is it a draw?
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  // Game running status
  const [isGameActive, setIsGameActive] = useState(true);

  // When board changes, check for winner or draw
  useEffect(() => {
    const result = calculateWinner(board);
    if (result && result.winner) {
      setWinnerInfo(result);
      setIsGameActive(false);
    } else if (board.every(square => square !== null)) {
      // Draw
      setWinnerInfo({ winner: 'draw', line: null });
      setIsGameActive(false);
    } else {
      setWinnerInfo({ winner: null, line: null });
      setIsGameActive(true);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  // Handles a click on a tic tac toe square.
  function handleSquareClick(idx) {
    if (!isGameActive || board[idx]) return; // Ignore if not active or square filled

    const newBoard = board.slice();
    newBoard[idx] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X);
  }

  // PUBLIC_INTERFACE
  // Resets game to initial state
  function handleResetGame() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setCurrentPlayer(PLAYER_X);
    setWinnerInfo({ winner: null, line: null });
    setIsGameActive(true);
  }

  // Returns a status string for display
  function getStatusMessage() {
    if (winnerInfo.winner === 'draw') {
      return "It's a draw!";
    }
    if (winnerInfo.winner) {
      return `Winner: ${winnerInfo.winner}`;
    }
    return `Current turn: ${currentPlayer}`;
  }

  // Returns true if this square index is part of the winning line
  function isWinningSquare(idx) {
    return winnerInfo.line && winnerInfo.line.includes(idx);
  }

  // Generate board component
  function renderBoard() {
    const rows = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const cells = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const idx = i * BOARD_SIZE + j;
        cells.push(
          <button
            key={idx}
            className="ttt-square"
            aria-label={`Square ${i+1},${j+1} - ${board[idx] || 'empty'}`}
            onClick={() => handleSquareClick(idx)}
            disabled={!isGameActive || board[idx]}
            style={
              isWinningSquare(idx)
                ? { background: COLORS.accent, color: COLORS.secondary, borderColor: COLORS.primary }
                : undefined
            }
          >
            {board[idx]}
          </button>
        );
      }
      rows.push(
        <div key={i} className="ttt-board-row">
          {cells}
        </div>
      );
    }
    return rows;
  }

  return (
    <div className="ttt-app-outer">
      <div className="ttt-app-centerbox">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" role="status">
          {getStatusMessage()}
        </div>
        <div className="ttt-board-container">{renderBoard()}</div>
        <div className="ttt-controls">
          <button
            className="ttt-btn"
            style={{
              background: COLORS.primary,
              color: '#fff',
              marginRight: 8,
              border: 'none'
            }}
            onClick={handleResetGame}
            aria-label="Reset the game board"
          >
            {winnerInfo.winner ? 'New Game' : 'Reset'}
          </button>
        </div>
        <footer className="ttt-footer">
          <span className="ttt-credit">
            Modern Minimal Design &mdash; 2 Player Mode
          </span>
        </footer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Calculates if the board has a winner.
 * Returns { winner: X|O|null, line: [indices]|null }
 */
function calculateWinner(board) {
  const winningLines = [
    [0,1,2],[3,4,5],[6,7,8], // Rows
    [0,3,6],[1,4,7],[2,5,8], // Cols
    [0,4,8],[2,4,6]          // Diags
  ];
  for (let line of winningLines) {
    const [a, b, c] = line;
    if (
      board[a] && 
      board[a] === board[b] && 
      board[a] === board[c]
    ) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export default App;
