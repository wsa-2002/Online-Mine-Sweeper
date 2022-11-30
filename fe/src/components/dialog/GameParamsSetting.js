import React, { useState, useEffect } from "react";
import "../css/dialog/GameParamsSetting.css";

const GameParamsSetting = ({ close }) => {
  const [room, setRoom] = useState("PUBLIC");
  const [mineNum, setMineNum] = useState(10);
  const [boardSize, setBoardSize] = useState(8);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleStartGame = () => {
    const data = {
      room_option: "NEW",
      board_size: boardSize,
      mine_num: mineNum,
      time_limit: timeLimit,
      room_type: room,
      room_number: null,
    };
    console.log(data);
  };

  // const handleMineNum = (num) => {
  //   if (num < 1) {
  //     setMineNum(1);
  //   } else if (num > 50) {
  //     setMineNum(50);
  //   } else {
  //     setMineNum(num);
  //   }
  //   console.log(mineNum);
  // };
  // useEffect(
  //   (mineNum) => {
  //     if (mineNum < 1) {
  //       setMineNum(1);
  //     } else if (mineNum > 50) {
  //       setMineNum(50);
  //     } else {
  //       setMineNum(mineNum);
  //     }
  //     console.log(mineNum);
  //   },
  //   [mineNum]
  // );

  return (
    <div className="dialog">
      <p className="dialogTitle">Game Setting</p>
      <div className="alignedText">
        <p className="alignedTextLeft">Room Privacy</p>
        <form className="radio_group">
          <label className="radio_set">
            <input
              type="radio"
              value="PUBLIC"
              checked={room === "PUBLIC"}
              onChange={() => setRoom("PUBLIC")}
              className="radio"
            />
            <p className="radio_label_text">Public</p>
          </label>
          <label className="radio_set">
            <input
              type="radio"
              value="PRIVATE"
              checked={room === "PRIVATE"}
              onChange={() => setRoom("PRIVATE")}
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
          onChange={(e) => setTimeLimit(e.target.value)}
          placeholder="a number from 60 to 180"
        />
      </div>
      <div>
        <button className="dialogBtn" onClick={close}>
          Cancel
        </button>
        <button className="dialogBtn" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameParamsSetting;
