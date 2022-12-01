import React, { useState } from "react";
import GameParamsSetting from "./dialog/GameParamsSetting";
import "./css/SelectMode.css";
import Popup from "reactjs-popup";
import EnterRoomNumber from "./dialog/EnterRoomNumber";

const SelectMode = ({ startGame }) => {
  const [showGameParamsSetting, setShowGameParamsSetting] = useState(false);
  const [showEnterRoomNumber, setShowEnterRoomNumber] = useState(false);

  const handleCreateNewRoom = (e) => {
    setShowGameParamsSetting(!showGameParamsSetting);
  };

  const handleEnterRandomRoom = (e) => {
    setShowGameParamsSetting(!showGameParamsSetting);
    // TODO: send username
  };

  const handleEnterRoomNumber = (e) => {
    setShowEnterRoomNumber(!showEnterRoomNumber);
    // TODO: send username
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
          />
        </Popup>
        <button className="btn" onClick={handleCreateNewRoom}>
          Create New Room
        </button>
        <button className="btn" onClick={handleEnterRandomRoom}>
          Enter Random Room
        </button>
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
