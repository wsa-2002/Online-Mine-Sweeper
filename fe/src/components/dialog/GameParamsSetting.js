import React, { useState, useEffect } from "react";
import "../css/dialog/GameParamsSetting.css";

const GameParamsSetting = ({
  close,
  startGame,
  roomType,
  setRoomType,
  mineNum,
  setMineNum,
  boardSize,
  setBoardSize,
  timeLimit,
  setTimeLimit,
}) => {
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [error, setError] = useState("");

  const handleStartGame = () => {
    close(); // close GameSetting dialog
    startGame(); // submit data for setup and start game
  };

  // handle disabled status of buttons
  useEffect(() => {
    if (!roomType || !mineNum || !boardSize || !timeLimit || error) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
  }, [roomType, mineNum, boardSize, timeLimit, error]);

  // initialize params for the first render
  useEffect(() => {
    setMineNum(10);
    setBoardSize(10);
    setRoomType("PUBLIC");
    setTimeLimit(60);
  }, []);
  // handle error message displayed
  useEffect(() => {
    if (mineNum && boardSize && timeLimit) {
      if (mineNum < 1 || mineNum > 50) {
        setError("⚠️ Mine number should be between 1 and 50.");
      } else if (boardSize < 8 || boardSize > 20) {
        setError("⚠️ Board size should be between 8 and 20.");
      } else if (timeLimit < 10 || timeLimit > 180) {
        setError("⚠️ Time limited should be between 60 and 180.");
      } else if (mineNum > boardSize * boardSize) {
        setError(
          "⚠️ The number of mines should be smaller than the board area!"
        );
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  }, [mineNum, boardSize, timeLimit]);

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
              checked={roomType === "PUBLIC"}
              onChange={() => setRoomType("PUBLIC")}
              className="radio"
            />
            <p className="radio_label_text">Public</p>
          </label>
          <label className="radio_set">
            <input
              type="radio"
              value="PRIVATE"
              checked={roomType === "PRIVATE"}
              onChange={() => setRoomType("PRIVATE")}
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
          onChange={(e) => setMineNum(Number(e.target.value))}
          placeholder="a number from 1 to 50"
        />
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Board Size</p>
        <input
          defaultValue={boardSize}
          onChange={(e) => setBoardSize(Number(e.target.value))}
          placeholder="a number from 8 to 20"
        />
      </div>
      <div className="alignedText">
        <p className="alignedTextLeft">Time Limited</p>
        <input
          defaultValue={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
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
