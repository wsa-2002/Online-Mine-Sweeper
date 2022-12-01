import React, { useEffect, useState } from "react";
import "./MineSweeper.css";
import Board from "../components/Board";
import SelectMode from "../components/SelectMode";
import HomePage from "../components/HomePage";

const MineSweeper = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [mineNum, setMineNum] = useState(10);
  const [boardSize, setBoardSize] = useState(8);

  const startGameOnClick = () => {
    setStartGame(true);
  };

  const backToHomeOnClick = () => {
    setStartGame(false);
    setMineNum(10);
    setBoardSize(8);
  };

  useEffect(() => {
    console.log("startGame(boolean): ", startGame);
  }, [startGame]);

  useEffect(() => {
    console.log("selectMode(boolean): ", selectMode);
  }, [selectMode]);

  return (
    <div className="mineSweeper">
      {selectMode ? (
        startGame ? (
          <Board
            boardSize={boardSize}
            mineNum={mineNum}
            backToHome={backToHomeOnClick}
          />
        ) : (
          <SelectMode startGame={startGameOnClick} />
        )
      ) : (
        <HomePage moveOnToSelectMode={() => setSelectMode(true)} />
      )}
    </div>
  );
};
export default MineSweeper;
