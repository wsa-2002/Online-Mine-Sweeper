import React, { useState, useEffect } from "react";
import "../css/dialog/GameParamsSetting.css";

const GameParamsSetting = ({ close, startGame }) => {
  const [room, setRoom] = useState("PUBLIC");
  const [mineNum, setMineNum] = useState(10);
  const [boardSize, setBoardSize] = useState(8);
  const [timeLimit, setTimeLimit] = useState(60);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [error, setError] = useState("");

  const handleStartGame = () => {
    const data = {
      room_option: "NEW",
      board_size: boardSize,
      mine_num: mineNum,
      time_limit: timeLimit,
      room_type: room,
      room_number: null,
    };
    console.log("data for setup: ", data);
    close(); // close GameSetting dialog
    startGame();
  };

  // handle disabled status of buttons
  useEffect(() => {
    if (room && mineNum && boardSize && timeLimit) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [room, mineNum, boardSize, timeLimit]);

  // handle error message displayed
  useEffect(() => {
    if (mineNum && boardSize) {
      if (mineNum < 1 || mineNum > 50) {
        setError("Mine number should be between 1 and 50.");
      } else if (boardSize < 8 || boardSize > 20) {
        setError("Board size should be between 8 and 20.");
      } else if (mineNum > boardSize * boardSize) {
        setError("The number of mines should be smaller than the board area!");
      }
    }
  }, [mineNum, boardSize]);

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
          defaultValue={mineNum}
          onChange={(e) => setMineNum(e.target.value)}
          placeholder="a number from 1 to 50"
        />
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Board Size</p>
        <input
          defaultValue={boardSize}
          onChange={(e) => setBoardSize(e.target.value)}
          placeholder="a number from 8 to 20"
        />
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Time Limited</p>
        <input
          defaultValue={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          placeholder="a number from 60 to 180"
        />
      </div>
      {error && <p style={{ marginBottom: "0px" }}>{error}</p>}
      <div>
        <button className="dialogBtn" onClick={close}>
          Cancel
        </button>
        <button
          className="dialogBtn"
          onClick={handleStartGame}
          disabled={submitDisabled}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameParamsSetting;
