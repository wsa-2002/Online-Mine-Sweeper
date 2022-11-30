/****************************************************************************
  FileName      [ MineSweeper.js ]
  PackageName   [ src/containers ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ The control and main page of MineSweeper. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useState } from "react";
import "./MineSweeper.css";
import Board from "../components/Board";
import SelectMode from "../components/SelectMode";
import HomePage from "../components/HomePage";

const MineSweeper = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [startGame, setStartGame] = useState(false); // A boolean variable. If true, show the Board, else show the HomePage.
  const [mineNum, setMineNum] = useState(10); // A integer variable to store the number of mines in the game. The default value is 10.
  const [boardSize, setBoardSize] = useState(8); // A integer variable to store the board size in the game. The default value is 8.

  const startGameOnClick = () => {
    setStartGame(true);
  };

  const mineNumOnChange = (n) => {
    setMineNum(n);
    if (n < boardSize * boardSize) {
      return false;
    }
    return true;
  };

  const boardSizeOnChange = (n) => {
    setBoardSize(n);
    if (n * n > mineNum) {
      return false;
    }
    return true;
  };

  const backToHomeOnClick = () => {
    setStartGame(false);
    setMineNum(10);
    setBoardSize(8);
  };

  return (
    <div className="mineSweeper">
      {selectMode ? (
        <SelectMode
          startGameOnClick={startGameOnClick}
          mineNumOnChange={mineNumOnChange}
          boardSizeOnChange={boardSizeOnChange}
          mineNum={mineNum}
          boardSize={boardSize}
        />
      ) : (
        <HomePage moveOnToSelectMode={() => setSelectMode(true)} />
      )}
      {}
      {/*startGame ? (
      //   <Board
      //     boardSize={boardSize}
      //     mineNum={mineNum}
      //     backToHome={backToHomeOnClick}
      //   />
      // ) : (
        // <HomePage
        //   startGameOnClick={startGameOnClick}
        //   mineNumOnChange={mineNumOnChange}
        //   boardSizeOnChange={boardSizeOnChange}
        //   mineNum={mineNum}
        //   boardSize={boardSize}
        // />
      // )*/}
    </div>
  );
};
export default MineSweeper;
