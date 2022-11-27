/****************************************************************************
  FileName      [ HomePage.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Home page.  ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useState } from "react";
import "./css/HomePage.css";

const HomePage = ({
  startGameOnClick,
  mineNumOnChange,
  boardSizeOnChange,
  mineNum,
  boardSize,
}) => {
  const [showPanel, setShowPanel] = useState(false); // A boolean variable. If true, the controlPanel will show.
  const [error, setError] = useState(false); // A boolean variable. If true, means that the numbers of mines and the board size are invalid to build a game.

  const handleMineNum = (e) => {
    const isvalid = mineNumOnChange(e.target.value);
    setError(isvalid);
  };

  const handleBoardSize = (e) => {
    const isvalid = boardSizeOnChange(e.target.value);
    setError(isvalid);
  };

  return (
    <div className="HomeWrapper">
      <p className="title">MineSweeper</p>
      <button className="btn" onClick={startGameOnClick}>
        Start Game
      </button>
      <div className="controlContainer">
        <button className="btn" onClick={() => setShowPanel(!showPanel)}>
          Difficulty Adjustment
        </button>
        {showPanel && (
          <div className="controlWrapper">
            {error && (
              <div className="error" style={{ color: "#880000" }}>
                ERROR: Mines number and board size are invalid!
              </div>
            )}
            <div className="controlPanel">
              <div className="controlCol">
                <p className="controlTitle">Mines Number</p>
                <input
                  type="range"
                  step="1"
                  min="1"
                  max="50"
                  defaultValue="10"
                  onChange={(e) => handleMineNum(e)}
                />
                {error ? (
                  <p className="controlNum" style={{ color: "#880000" }}>
                    {mineNum}
                  </p>
                ) : (
                  <p className="controlNum" style={{ color: "#0f0f4b" }}>
                    {mineNum}
                  </p>
                )}
              </div>

              <div className="controlCol">
                <p className="controlTitle">Board Size (nxn)</p>
                <input
                  type="range"
                  step="1"
                  min="1"
                  max="20"
                  defaultValue="8"
                  onChange={(e) => handleBoardSize(e)}
                />
                {error ? (
                  <p className="controlNum" style={{ color: "#880000" }}>
                    {boardSize}
                  </p>
                ) : (
                  <p className="controlNum" style={{ color: "#0f0f4b" }}>
                    {boardSize}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
