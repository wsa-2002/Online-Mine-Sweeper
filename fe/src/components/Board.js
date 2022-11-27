/****************************************************************************
  FileName      [ Board.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Board. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import Modal from "./Modal";
import Dashboard from "./Dashboard";
import createBoard from "../util/createBoard";
import { revealed } from "../util/reveal";
import "./css/Board.css";

const Board = ({ boardSize, mineNum, backToHome }) => {
  const [board, setBoard] = useState([]); // An 2-dimentional array. It is used to store the board.
  const [nonMineCount, setNonMineCount] = useState(0); // An integer variable to store the number of cells whose value are not '💣'.
  const [mineLocations, setMineLocations] = useState([]); // An array to store all the coordinate of '💣'.
  const [gameOver, setGameOver] = useState(false); // A boolean variable. If true, means you lose the game (Game over).
  const [remainFlagNum, setRemainFlagNum] = useState(0); // An integer variable to store the number of remain flags.
  const [win, setWin] = useState(false); // A boolean variable. If true, means that you win the game.

  useEffect(() => {
    // Calling the function
    freshBoard();
  }, []);

  // Creating a board
  const freshBoard = () => {
    {
      /* -- TODO 3-1 -- */
    }
    {
      /* Useful Hint: createBoard(...) */
    }
    const newBoard = createBoard(boardSize, mineNum);
    setNonMineCount(boardSize * boardSize - mineNum);
    setRemainFlagNum(mineNum);
    setMineLocations(newBoard.mineLocations);
    setBoard(newBoard.board);
  };

  const restartGame = () => {
    {
      /* -- TODO 5-2 -- */
    }
    {
      /* Useful Hint: freshBoard() */
    }
    freshBoard();
    setGameOver(false);
    setWin(false);
  };

  // On Right Click / Flag Cell
  const updateFlag = (e, x, y) => {
    // To not have a dropdown on right click
    e.preventDefault();
    // Deep copy of a state
    {
      /* -- TODO 3-2 -- */
    }
    {
      /* Useful Hint: A cell is going to be flagged. 'x' and 'y' are the xy-coordinate of the cell. */
    }
    {
      /* Reminder: If the cell is already flagged, you should unflagged it. Also remember to update the board and the remainFlagNum. */
    }
    {
      /* Reminder: The cell can be flagged only when it is not revealed. */
    }
    let newBoard = JSON.parse(JSON.stringify(board));
    let newFlagNum = remainFlagNum;
    if (newBoard[x][y].revealed === true) return;
    if (newBoard[x][y].flagged !== true && newBoard[x][y].revealed !== true) {
      newBoard[x][y].flagged = true;
      newFlagNum--;
    } else {
      newBoard[x][y].flagged = false;
      newFlagNum++;
    }
    setRemainFlagNum(newFlagNum);
    setBoard(newBoard);
  };

  const revealCell = (x, y) => {
    {
      /* -- TODO 4-1 -- */
    }
    {
      /* Reveal the cell */
    }
    {
      /* Useful Hint: The function in reveal.js may be useful. You should consider if the cell you want to reveal is a location of mines or not. */
    }
    {
      /* Reminder: Also remember to handle the condition that after you reveal this cell then you win the game. */
    }
    if (board[x][y].revealed || gameOver || board[x][y].flagged) return;

    let newBoard = JSON.parse(JSON.stringify(board));
    // Hit the mine!!
    if (newBoard[x][y].value === "💣") {
      for (let i = 0; i < mineLocations.length; i++) {
        if (!newBoard[mineLocations[i][0]][mineLocations[i][1]].flagged)
          newBoard[mineLocations[i][0]][mineLocations[i][1]].revealed = true;
      }
      setBoard(newBoard);
      setGameOver(true);
    }
    // Reveal the number cell
    else {
      let newRevealedBoard = revealed(newBoard, x, y, nonMineCount);
      setBoard(newRevealedBoard.board);
      setNonMineCount(newRevealedBoard.newNonMinesCount);
      if (newRevealedBoard.newNonMinesCount === 0) {
        console.log("win");
        setGameOver(true);
        setWin(true);
      }
    }
  };

  return (
    <div className="boardPage">
      <div className="boardWrapper">
        {/* -- TODO 3-1 -- */}
        {/* Useful Hint: The board is composed of BOARDSIZE*BOARDSIZE of Cell (2-dimention). So, nested 'map' is needed to implement the board.  */}
        {/* Reminder: Remember to use the component <Cell> and <Dashboard>. See Cell.js and Dashboard.js for detailed information. */}
        {win === gameOver && (
          <div className="boardContainer">
            <Dashboard remainFlagNum={remainFlagNum} gameOver={gameOver} />
            {board.map((row, cnt) => (
              <div id={`row${cnt}`} style={{ display: "flex" }}>
                {row.map((cell, key) => (
                  <Cell
                    key={key}
                    rowIdx={cell.x}
                    colIdx={cell.y}
                    detail={cell}
                    updateFlag={updateFlag}
                    revealCell={revealCell}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {(win || gameOver) && (
          <Modal restartGame={restartGame} backToHome={backToHome} win={win} />
        )}
      </div>
    </div>
  );
};

export default Board;
