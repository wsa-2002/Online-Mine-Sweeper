import React, { useState } from "react";
import GameParamsSetting from "./dialog/GameParamsSetting";
import "./css/SelectMode.css";
import Popup from "reactjs-popup";

const SelectMode = ({ startGame }) => {
  const [showGameParamsSetting, setShowGameParamsSetting] = useState(false);

  const handleCreateNewRoom = (e) => {
    setShowGameParamsSetting(!showGameParamsSetting);
  };

  const handleEnterRandomRoom = (e) => {
    setShowGameParamsSetting(!showGameParamsSetting);
  };

  const handleEnterRoomNumber = (e) => {
    setShowGameParamsSetting(!showGameParamsSetting);
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
        <button className="btn" onClick={handleEnterRoomNumber}>
          Enter Room Number
        </button>
      </div>
    </div>
  );
};
export default SelectMode;
