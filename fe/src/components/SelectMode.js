import React, { useEffect, useState } from "react";
import GameParamsSetting from "./dialog/GameParamsSetting";
import "./css/SelectMode.css";
import Popup from "reactjs-popup";
import EnterRoomNumber from "./dialog/EnterRoomNumber";

const SelectMode = ({
  roomOption,
  setRoomOption,
  roomType,
  setRoomType,
  mineNum,
  setMineNum,
  boardSize,
  setBoardSize,
  timeLimit,
  setTimeLimit,
  roomNumber,
  setRoomNumber,
  startGame,
  error,
}) => {
  const [showGameParamsSetting, setShowGameParamsSetting] = useState(false);
  const [showEnterRoomNumber, setShowEnterRoomNumber] = useState(false);

  const handleCreateNewRoom = () => {
    setRoomOption("NEW");
    setShowGameParamsSetting(!showGameParamsSetting);
  };

  const handleEnterRandomRoom = () => {
    setRoomOption("RANDOM");
    setRoomType(null);
    setBoardSize(null);
    setMineNum(null);
    setTimeLimit(null);
    setRoomNumber(null);
  };
  // for enter random room, only start game after states are set
  useEffect(() => {
    if (roomOption === "RANDOM") {
      startGame(); // submit data for setup and start game
    }
  }, [roomOption]);

  const handleEnterRoomNumber = () => {
    setRoomOption("ASSIGN");
    setRoomType(null);
    setBoardSize(null);
    setMineNum(null);
    setTimeLimit(null);
    setShowEnterRoomNumber(!showEnterRoomNumber);
  };

  return (
    <div className="HomeWrapper">
      <p className="title">MineSweeper</p>
      <div className="controlContainer">
        <Popup
          open={showGameParamsSetting}
          position="center"
          closeOnDocumentClick={false}
        >
          <div className="blurredBackground" />
          <GameParamsSetting
            close={() => {
              setShowGameParamsSetting(!showGameParamsSetting);
            }}
            startGame={startGame}
            roomType={roomType}
            setRoomType={setRoomType}
            mineNum={mineNum}
            setMineNum={setMineNum}
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
          />
        </Popup>
        <button className="btn" onClick={handleCreateNewRoom}>
          Create New Room
        </button>
        <button className="btn" onClick={handleEnterRandomRoom}>
          Enter Random Room
        </button>
        {error && <p style={{ marginTop: "-10px" }}>⚠️ {error}</p>}
        <Popup
          open={showEnterRoomNumber}
          position="center"
          closeOnDocumentClick={false}
        >
          <div className="blurredBackground" />
          <EnterRoomNumber
            close={() => {
              setShowEnterRoomNumber(!showEnterRoomNumber);
            }}
            startGame={startGame}
            roomNumber={roomNumber}
            setRoomNumber={setRoomNumber}
          />
        </Popup>
        <button className="btn" onClick={handleEnterRoomNumber}>
          Enter Room Number
        </button>
      </div>
    </div>
  );
};
export default SelectMode;
