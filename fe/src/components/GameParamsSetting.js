import React, { useState, useEffect } from "react";
import "./css/GameParamsSetting.css";

export default function GameParamsSetting() {
  const [privateRoom, setPrivateRoom] = useState(false);
  const [mineNum, setMineNum] = useState(10);
  const [boardSize, setBoardSize] = useState(8);
  const [timeLimit, setTimeLimit] = useState(60);

  return (
    <div className="dialog">
      <p className="dialogTitle">Game Setting</p>
      <div className="alignedText">
        <p className="alignedTextLeft">Room Privacy</p>
        <form className="radio_group">
          <label className="radio_set">
            <input
              type="radio"
              value={false}
              checked={privateRoom == false}
              onChange={() => setPrivateRoom(false)}
              className="radio"
            />
            <p className="radio_label_text">Public</p>
          </label>
          <label className="radio_set">
            <input
              type="radio"
              value={true}
              checked={privateRoom == true}
              onChange={() => setPrivateRoom(true)}
              className="radio"
            />
            <p className="radio_label_text">Private</p>
          </label>
        </form>
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Mine Number</p>
        <input
          onChange={(e) => setMineNum(e.target.value)}
          placeholder="a number from 1 to 50"
        />
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Board Size</p>
        <input
          onChange={(e) => setBoardSize(e.target.value)}
          placeholder="a number from 8 to 20"
        />
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Time Limited</p>
        <input
          onChange={(e) => setBoardSize(e.target.value)}
          placeholder="a number from 60 to 180"
        />
      </div>
      <div>
        <button className="dialogBtn">Cancel</button>
        <button className="dialogBtn">Start Game</button>
      </div>
    </div>
  );
}
